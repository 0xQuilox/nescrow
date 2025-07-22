import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  TransactionSignature,
  Commitment,
  ConfirmOptions
} from '@solana/web3.js';
import * as rpc from './lib/rpc';
import * as pda from './lib/pda';
import * as types from './lib/types';
import { deserialize } from 'borsh';

/**
 * Escrow status constants
 */
export enum EscrowStatus {
  Open = 0,
  Accepted = 1,
  Completed = 2,
  Cancelled = 3
}

/**
 * Options for NescrowClient
 */
export interface NescrowClientOptions {
  /** Commitment level for transactions and queries */
  commitment?: Commitment;
  /** Confirmation options for transactions */
  confirmOptions?: ConfirmOptions;
  /** Whether to preload counters for creators */
  preloadCounters?: boolean;
}

/**
 * Result of creating an escrow
 */
export interface CreateEscrowResult {
  /** The public key of the created escrow account */
  escrowPubkey: PublicKey;
  /** The transaction signature */
  signature: TransactionSignature;
}

/**
 * NescrowClient provides a high-level API for interacting with the Nescrow program
 */
export class NescrowClient {
  private connection: Connection;
  private programId: PublicKey;
  private counterCache: Map<string, bigint> = new Map();
  private options: Required<NescrowClientOptions>;

  /**
   * Create a new NescrowClient
   * 
   * @param connection - Solana connection
   * @param programId - Nescrow program ID
   * @param options - Client options
   */
  constructor(
    connection: Connection, 
    programId: PublicKey,
    options: NescrowClientOptions = {}
  ) {
    this.connection = connection;
    this.programId = programId;
    
    // Set default options
    this.options = {
      commitment: options.commitment || 'confirmed',
      confirmOptions: options.confirmOptions || {
        skipPreflight: false,
        commitment: options.commitment || 'confirmed',
        preflightCommitment: options.commitment || 'confirmed',
      },
      preloadCounters: options.preloadCounters ?? false
    };
    
    // Initialize the RPC client
    rpc.initializeClient(programId, connection);
    
    // Preload counters if requested
    if (this.options.preloadCounters) {
      this.preloadCounters().catch(err => {
        console.error('Failed to preload counters:', err);
      });
    }
  }

  /**
   * Preload counters for all creators
   * This can be useful to avoid race conditions when creating multiple escrows
   * 
   * @private
   */
  private async preloadCounters(): Promise<void> {
    try {
      const accounts = await this.connection.getProgramAccounts(this.programId);
      
      for (const { account, pubkey } of accounts) {
        try {
          const escrow = types.decodeEscrow(
            deserialize(types.EscrowSchema, account.data) as Record<string, unknown>
          );
          
          const creatorStr = escrow.creator.toBase58();
          const counter = escrow.counter;
          
          // Update the counter cache if this is the highest counter for this creator
          const currentCounter = this.counterCache.get(creatorStr) || BigInt(0);
          if (BigInt(counter) >= currentCounter) {
            this.counterCache.set(creatorStr, BigInt(counter));
          }
        } catch (e) {
          // Skip accounts that can't be decoded as escrows
          continue;
        }
      }
    } catch (error) {
      console.error('Error preloading counters:', error);
    }
  }

  /**
   * Get the next available counter for a creator
   * 
   * @param creator - Creator's public key
   * @returns The next available counter
   * @private
   */
  private async getNextCounter(creator: PublicKey): Promise<bigint> {
    const creatorStr = creator.toBase58();
    let counter = this.counterCache.get(creatorStr) || BigInt(0);
    
    // Increment the counter
    counter = counter + BigInt(1);
    this.counterCache.set(creatorStr, counter);
    
    return counter;
  }

  /**
   * Create a new escrow for wagering
   * 
   * @param creator - Creator's keypair
   * @param amount - Amount of lamports to wager
   * @param description - Description of the wager
   * @param expiryTime - Expiry time in seconds since epoch
   * @param feePayer - Optional fee payer, defaults to creator
   * @returns The escrow public key and transaction signature
   * @throws If the transaction fails
   */
  async createEscrow(
    creator: Keypair,
    amount: number | bigint,
    description: string,
    expiryTime: number | bigint,
    feePayer: Keypair = creator
  ): Promise<CreateEscrowResult> {
    // Validate inputs
    if (description.length === 0) {
      throw new Error('Description cannot be empty');
    }
    
    if (typeof expiryTime === 'number' && expiryTime <= Math.floor(Date.now() / 1000)) {
      throw new Error('Expiry time must be in the future');
    }
    
    // Get the next counter for this creator
    const counter = await this.getNextCounter(creator.publicKey);
    
    // Convert amount to lamports if it's a number (SOL)
    const amountLamports = typeof amount === 'number' 
      ? BigInt(Math.floor(amount * LAMPORTS_PER_SOL)) 
      : amount;
    
    // Convert expiry time to bigint
    const expiryTimestamp = typeof expiryTime === 'number' 
      ? BigInt(expiryTime) 
      : expiryTime;
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add the create escrow instruction
    transaction.add(
      rpc.createEscrow({
        feePayer: feePayer.publicKey,
        creator: creator.publicKey,
        counter,
        amount: amountLamports,
        description,
        expiryTime: expiryTimestamp
      })
    );
    
    // Send the transaction
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [feePayer, creator],
        this.options.confirmOptions
      );
      
      // Get the escrow PDA
      const [escrowPubkey] = pda.deriveEscrowAccountPDA(
        { creator: creator.publicKey, counter },
        this.programId
      );
      
      return { escrowPubkey, signature };
    } catch (error) {
      throw new Error(`Failed to create escrow: ${error.message}`);
    }
  }

  /**
   * Accept an existing escrow
   * 
   * @param creator - Creator's public key
   * @param counter - Escrow counter
   * @param taker - Taker's keypair
   * @param feePayer - Optional fee payer, defaults to taker
   * @returns Transaction signature
   * @throws If the transaction fails
   */
  async acceptEscrow(
    creator: PublicKey,
    counter: bigint,
    taker: Keypair,
    feePayer: Keypair = taker
  ): Promise<TransactionSignature> {
    // Create transaction
    const transaction = new Transaction();
    
    // Add the accept escrow instruction
    transaction.add(
      rpc.acceptEscrow({
        feePayer: feePayer.publicKey,
        taker: taker.publicKey,
        creator,
        counter
      })
    );
    
    // Send the transaction
    try {
      return await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [feePayer, taker],
        this.options.confirmOptions
      );
    } catch (error) {
      throw new Error(`Failed to accept escrow: ${error.message}`);
    }
  }

  /**
   * Complete an escrow and distribute funds to the winner
   * 
   * @param creator - Creator's public key
   * @param counter - Escrow counter
   * @param authority - Authority's keypair (must be either creator or taker)
   * @param winner - Winner's public key
   * @param feePayer - Optional fee payer, defaults to authority
   * @returns Transaction signature
   * @throws If the transaction fails
   */
  async completeEscrow(
    creator: PublicKey,
    counter: bigint,
    authority: Keypair,
    winner: PublicKey,
    feePayer: Keypair = authority
  ): Promise<TransactionSignature> {
    // Create transaction
    const transaction = new Transaction();
    
    // Add the complete escrow instruction
    transaction.add(
      rpc.completeEscrow({
        feePayer: feePayer.publicKey,
        authority: authority.publicKey,
        winner,
        creator,
        counter
      })
    );
    
    // Send the transaction
    try {
      return await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [feePayer, authority],
        this.options.confirmOptions
      );
    } catch (error) {
      throw new Error(`Failed to complete escrow: ${error.message}`);
    }
  }

  /**
   * Cancel an escrow if not yet accepted
   * 
   * @param creator - Creator's keypair
   * @param counter - Escrow counter
   * @param feePayer - Optional fee payer, defaults to creator
   * @returns Transaction signature
   * @throws If the transaction fails
   */
  async cancelEscrow(
    creator: Keypair,
    counter: bigint,
    feePayer: Keypair = creator
  ): Promise<TransactionSignature> {
    // Create transaction
    const transaction = new Transaction();
    
    // Add the cancel escrow instruction
    transaction.add(
      rpc.cancelEscrow({
        feePayer: feePayer.publicKey,
        creator: creator.publicKey,
        counter
      })
    );
    
    // Send the transaction
    try {
      return await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [feePayer, creator],
        this.options.confirmOptions
      );
    } catch (error) {
      throw new Error(`Failed to cancel escrow: ${error.message}`);
    }
  }

  /**
   * Extend the expiry time of an escrow
   * 
   * @param creator - Creator's keypair
   * @param counter - Escrow counter
   * @param newExpiryTime - New expiry time in seconds since epoch
   * @param feePayer - Optional fee payer, defaults to creator
   * @returns Transaction signature
   * @throws If the transaction fails
   */
  async extendEscrow(
    creator: Keypair,
    counter: bigint,
    newExpiryTime: number | bigint,
    feePayer: Keypair = creator
  ): Promise<TransactionSignature> {
    // Validate inputs
    if (typeof newExpiryTime === 'number' && newExpiryTime <= Math.floor(Date.now() / 1000)) {
      throw new Error('New expiry time must be in the future');
    }
    
    // Convert expiry time to bigint
    const expiryTimestamp = typeof newExpiryTime === 'number' 
      ? BigInt(newExpiryTime) 
      : newExpiryTime;
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add the extend escrow instruction
    transaction.add(
      rpc.extendEscrow({
        feePayer: feePayer.publicKey,
        creator: creator.publicKey,
        counter,
        newExpiryTime: expiryTimestamp
      })
    );
    
    // Send the transaction
    try {
      return await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [feePayer, creator],
        this.options.confirmOptions
      );
    } catch (error) {
      throw new Error(`Failed to extend escrow: ${error.message}`);
    }
  }

  /**
   * Get an escrow by its public key
   * 
   * @param escrowPubkey - Escrow public key
   * @returns Escrow data or undefined if not found
   */
  async getEscrow(escrowPubkey: PublicKey): Promise<types.Escrow | undefined> {
    try {
      return await rpc.getEscrow(escrowPubkey);
    } catch (error) {
      console.error('Error fetching escrow:', error);
      return undefined;
    }
  }

  /**
   * Get an escrow by creator and counter
   * 
   * @param creator - Creator's public key
   * @param counter - Escrow counter
   * @returns Escrow data or undefined if not found
   */
  async getEscrowByCreatorAndCounter(
    creator: PublicKey,
    counter: bigint
  ): Promise<types.Escrow | undefined> {
    const [escrowPubkey] = pda.deriveEscrowAccountPDA(
      { creator, counter },
      this.programId
    );
    
    return this.getEscrow(escrowPubkey);
  }

  /**
   * Get all escrows for a creator
   * 
   * @param creator - Creator's public key
   * @returns Array of escrows
   */
  async getEscrowsByCreator(
    creator: PublicKey
  ): Promise<Array<{ pubkey: PublicKey, account: types.Escrow }>> {
    try {
      // Get all program accounts
      const accounts = await this.connection.getProgramAccounts(
        this.programId,
        {
          commitment: this.options.commitment,
          filters: [
            {
              memcmp: {
                offset: 0, // Offset of the creator field in the account data
                bytes: creator.toBase58(),
              },
            },
          ],
        }
      );
      
      // Filter and decode accounts
      const escrows = await Promise.all(
        accounts.map(async ({ pubkey, account }) => {
          try {
            const escrow = types.decodeEscrow(
              deserialize(types.EscrowSchema, account.data) as Record<string, unknown>
            );
            
            return { pubkey, account: escrow };
          } catch (e) {
            return null;
          }
        })
      );
      
      // Filter out null values
      return escrows.filter((item): item is { pubkey: PublicKey, account: types.Escrow } => 
        item !== null && item.account.creator.toBase58() === creator.toBase58()
      );
    } catch (error) {
      console.error('Error fetching escrows by creator:', error);
      return [];
    }
  }

  /**
   * Get all open escrows
   * 
   * @returns Array of open escrows
   */
  async getOpenEscrows(): Promise<Array<{ pubkey: PublicKey, account: types.Escrow }>> {
    try {
      // Get all program accounts
      const accounts = await this.connection.getProgramAccounts(
        this.programId,
        {
          commitment: this.options.commitment,
          filters: [
            {
              memcmp: {
                offset: 32 + 1 + 8, // Offset of the status field in the account data
                bytes: Buffer.from([EscrowStatus.Open]).toString('base64'),
              },
            },
          ],
        }
      );
      
      // Filter and decode accounts
      const escrows = await Promise.all(
        accounts.map(async ({ pubkey, account }) => {
          try {
            const escrow = types.decodeEscrow(
              deserialize(types.EscrowSchema, account.data) as Record<string, unknown>
            );
            
            return { pubkey, account: escrow };
          } catch (e) {
            return null;
          }
        })
      );
      
      // Filter out null values
      return escrows.filter((item): item is { pubkey: PublicKey, account: types.Escrow } => 
        item !== null && item.account.status === EscrowStatus.Open
      );
    } catch (error) {
      console.error('Error fetching open escrows:', error);
      return [];
    }
  }
}

// Export all the types and functions from the generated client
export * from './lib/pda';
export * from './lib/rpc';
export * from './lib/types';