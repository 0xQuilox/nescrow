import * as pda from "./pda";
import * as T from "./types";
import {
    Commitment,
    Connection,
    GetAccountInfoConfig,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
} from "@solana/web3.js";
import {deserialize, serialize} from "borsh";


let _programId: PublicKey;
let _connection: Connection;

export const initializeClient = (
    programId: PublicKey,
    connection: Connection
) => {
    _programId = programId;
    _connection = connection;
};

export enum NescrowInstruction {
/**
 * Create a new escrow for wagering
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - counter: {@link BigInt} Counter to make the escrow PDA unique
 * - amount: {@link BigInt} The amount of lamports to wager
 * - description: {@link string} type
 * - expiry_time: {@link BigInt} The time when the escrow expires (Unix timestamp)
 */
    CreateEscrow = 0,

/**
 * Accept an existing escrow
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` taker: {@link PublicKey} 
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - counter: {@link BigInt} 
 */
    AcceptEscrow = 1,

/**
 * Complete the escrow and distribute funds to winner
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[signer]` authority: {@link PublicKey} Must be either creator or taker
 * 3. `[writable]` winner: {@link PublicKey} The account that will receive the funds
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - counter: {@link BigInt} 
 */
    CompleteEscrow = 2,

/**
 * Cancel an escrow if not yet accepted
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 *
 * Data:
 * - counter: {@link BigInt} 
 */
    CancelEscrow = 3,

/**
 * Extend the expiry time of an escrow
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[signer]` creator: {@link PublicKey} 
 *
 * Data:
 * - counter: {@link BigInt} 
 * - new_expiry_time: {@link BigInt} The new expiry time for the escrow (Unix timestamp)
 */
    ExtendEscrow = 4,
}

export type CreateEscrowArgs = {
	feePayer: PublicKey;
	creator: PublicKey;
	counter: bigint;
	amount: bigint;
	description: string;
	expiryTime: bigint;
};

/**
 * ### Returns a {@link TransactionInstruction}
 * Create a new escrow for wagering
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - counter: {@link BigInt} Counter to make the escrow PDA unique
 * - amount: {@link BigInt} The amount of lamports to wager
 * - description: {@link string} type
 * - expiry_time: {@link BigInt} The time when the escrow expires (Unix timestamp)
 */
export const createEscrow = (args: CreateEscrowArgs, remainingAccounts: Array<PublicKey> = []): TransactionInstruction => {
		const data = serialize(
        {
            struct: {
                id: "u8",
								counter: "u64",
								amount: "u64",
								description: "string",
								expiry_time: "i64",
            },
        },
        {
            id: NescrowInstruction.CreateEscrow,
						counter: args.counter,
						amount: args.amount,
						description: args.description,
						expiry_time: args.expiryTime,
        }
    );

		const [escrowPubkey] = pda.deriveEscrowAccountPDA({
				creator: args.creator,
				counter: args.counter,
    }, _programId);

    return new TransactionInstruction({
        data: Buffer.from(data),
        keys: [
						{pubkey: args.feePayer, isSigner: true, isWritable: true},
						{pubkey: escrowPubkey, isSigner: false, isWritable: true},
						{pubkey: args.creator, isSigner: true, isWritable: true},
						{pubkey: new PublicKey("11111111111111111111111111111111"), isSigner: false, isWritable: false},
            ...remainingAccounts.map(e => ({pubkey: e, isSigner: false, isWritable: false})),
        ],
        programId: _programId,
    });
};

/**
 * ### Returns a {@link TransactionSignature}
 * Create a new escrow for wagering
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - counter: {@link BigInt} Counter to make the escrow PDA unique
 * - amount: {@link BigInt} The amount of lamports to wager
 * - description: {@link string} type
 * - expiry_time: {@link BigInt} The time when the escrow expires (Unix timestamp)
 */
export const createEscrowSendAndConfirm = async (
	args: Omit<CreateEscrowArgs, "feePayer" | "creator"> & {
	  signers: {
			feePayer: Keypair,
			creator: Keypair,
	  }
  }, 
  remainingAccounts: Array<PublicKey> = []
): Promise<TransactionSignature> => {
  const trx = new Transaction();


	trx.add(createEscrow({
		...args,
		feePayer: args.signers.feePayer.publicKey,
		creator: args.signers.creator.publicKey,
	}, remainingAccounts));

  return await sendAndConfirmTransaction(
    _connection,
    trx,
    [
				args.signers.feePayer,
				args.signers.creator,
    ]
  );
};

export type AcceptEscrowArgs = {
	feePayer: PublicKey;
	taker: PublicKey;
	creator: PublicKey;
	counter: bigint;
};

/**
 * ### Returns a {@link TransactionInstruction}
 * Accept an existing escrow
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` taker: {@link PublicKey} 
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - counter: {@link BigInt} 
 */
export const acceptEscrow = (args: AcceptEscrowArgs, remainingAccounts: Array<PublicKey> = []): TransactionInstruction => {
		const data = serialize(
        {
            struct: {
                id: "u8",
								creator: { array: { type: "u8", len: 32 } },
								counter: "u64",
            },
        },
        {
            id: NescrowInstruction.AcceptEscrow,
						creator: args.creator.toBytes(),
						counter: args.counter,
        }
    );

		const [escrowPubkey] = pda.deriveEscrowAccountPDA({
				creator: args.creator,
				counter: args.counter,
    }, _programId);

    return new TransactionInstruction({
        data: Buffer.from(data),
        keys: [
						{pubkey: args.feePayer, isSigner: true, isWritable: true},
						{pubkey: escrowPubkey, isSigner: false, isWritable: true},
						{pubkey: args.taker, isSigner: true, isWritable: true},
            ...remainingAccounts.map(e => ({pubkey: e, isSigner: false, isWritable: false})),
        ],
        programId: _programId,
    });
};

/**
 * ### Returns a {@link TransactionSignature}
 * Accept an existing escrow
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` taker: {@link PublicKey} 
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - counter: {@link BigInt} 
 */
export const acceptEscrowSendAndConfirm = async (
	args: Omit<AcceptEscrowArgs, "feePayer" | "taker"> & {
	  signers: {
			feePayer: Keypair,
			taker: Keypair,
	  }
  }, 
  remainingAccounts: Array<PublicKey> = []
): Promise<TransactionSignature> => {
  const trx = new Transaction();


	trx.add(acceptEscrow({
		...args,
		feePayer: args.signers.feePayer.publicKey,
		taker: args.signers.taker.publicKey,
	}, remainingAccounts));

  return await sendAndConfirmTransaction(
    _connection,
    trx,
    [
				args.signers.feePayer,
				args.signers.taker,
    ]
  );
};

export type CompleteEscrowArgs = {
	feePayer: PublicKey;
	authority: PublicKey;
	winner: PublicKey;
	creator: PublicKey;
	counter: bigint;
};

/**
 * ### Returns a {@link TransactionInstruction}
 * Complete the escrow and distribute funds to winner
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[signer]` authority: {@link PublicKey} Must be either creator or taker
 * 3. `[writable]` winner: {@link PublicKey} The account that will receive the funds
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - counter: {@link BigInt} 
 */
export const completeEscrow = (args: CompleteEscrowArgs, remainingAccounts: Array<PublicKey> = []): TransactionInstruction => {
		const data = serialize(
        {
            struct: {
                id: "u8",
								creator: { array: { type: "u8", len: 32 } },
								counter: "u64",
            },
        },
        {
            id: NescrowInstruction.CompleteEscrow,
						creator: args.creator.toBytes(),
						counter: args.counter,
        }
    );

		const [escrowPubkey] = pda.deriveEscrowAccountPDA({
				creator: args.creator,
				counter: args.counter,
    }, _programId);

    return new TransactionInstruction({
        data: Buffer.from(data),
        keys: [
						{pubkey: args.feePayer, isSigner: true, isWritable: true},
						{pubkey: escrowPubkey, isSigner: false, isWritable: true},
						{pubkey: args.authority, isSigner: true, isWritable: false},
						{pubkey: args.winner, isSigner: false, isWritable: true},
            ...remainingAccounts.map(e => ({pubkey: e, isSigner: false, isWritable: false})),
        ],
        programId: _programId,
    });
};

/**
 * ### Returns a {@link TransactionSignature}
 * Complete the escrow and distribute funds to winner
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[signer]` authority: {@link PublicKey} Must be either creator or taker
 * 3. `[writable]` winner: {@link PublicKey} The account that will receive the funds
 *
 * Data:
 * - creator: {@link PublicKey} 
 * - counter: {@link BigInt} 
 */
export const completeEscrowSendAndConfirm = async (
	args: Omit<CompleteEscrowArgs, "feePayer" | "authority"> & {
	  signers: {
			feePayer: Keypair,
			authority: Keypair,
	  }
  }, 
  remainingAccounts: Array<PublicKey> = []
): Promise<TransactionSignature> => {
  const trx = new Transaction();


	trx.add(completeEscrow({
		...args,
		feePayer: args.signers.feePayer.publicKey,
		authority: args.signers.authority.publicKey,
	}, remainingAccounts));

  return await sendAndConfirmTransaction(
    _connection,
    trx,
    [
				args.signers.feePayer,
				args.signers.authority,
    ]
  );
};

export type CancelEscrowArgs = {
	feePayer: PublicKey;
	creator: PublicKey;
	counter: bigint;
};

/**
 * ### Returns a {@link TransactionInstruction}
 * Cancel an escrow if not yet accepted
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 *
 * Data:
 * - counter: {@link BigInt} 
 */
export const cancelEscrow = (args: CancelEscrowArgs, remainingAccounts: Array<PublicKey> = []): TransactionInstruction => {
		const data = serialize(
        {
            struct: {
                id: "u8",
								counter: "u64",
            },
        },
        {
            id: NescrowInstruction.CancelEscrow,
						counter: args.counter,
        }
    );

		const [escrowPubkey] = pda.deriveEscrowAccountPDA({
				creator: args.creator,
				counter: args.counter,
    }, _programId);

    return new TransactionInstruction({
        data: Buffer.from(data),
        keys: [
						{pubkey: args.feePayer, isSigner: true, isWritable: true},
						{pubkey: escrowPubkey, isSigner: false, isWritable: true},
						{pubkey: args.creator, isSigner: true, isWritable: true},
            ...remainingAccounts.map(e => ({pubkey: e, isSigner: false, isWritable: false})),
        ],
        programId: _programId,
    });
};

/**
 * ### Returns a {@link TransactionSignature}
 * Cancel an escrow if not yet accepted
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[writable, signer]` creator: {@link PublicKey} 
 *
 * Data:
 * - counter: {@link BigInt} 
 */
export const cancelEscrowSendAndConfirm = async (
	args: Omit<CancelEscrowArgs, "feePayer" | "creator"> & {
	  signers: {
			feePayer: Keypair,
			creator: Keypair,
	  }
  }, 
  remainingAccounts: Array<PublicKey> = []
): Promise<TransactionSignature> => {
  const trx = new Transaction();


	trx.add(cancelEscrow({
		...args,
		feePayer: args.signers.feePayer.publicKey,
		creator: args.signers.creator.publicKey,
	}, remainingAccounts));

  return await sendAndConfirmTransaction(
    _connection,
    trx,
    [
				args.signers.feePayer,
				args.signers.creator,
    ]
  );
};

export type ExtendEscrowArgs = {
	feePayer: PublicKey;
	creator: PublicKey;
	counter: bigint;
	newExpiryTime: bigint;
};

/**
 * ### Returns a {@link TransactionInstruction}
 * Extend the expiry time of an escrow
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[signer]` creator: {@link PublicKey} 
 *
 * Data:
 * - counter: {@link BigInt} 
 * - new_expiry_time: {@link BigInt} The new expiry time for the escrow (Unix timestamp)
 */
export const extendEscrow = (args: ExtendEscrowArgs, remainingAccounts: Array<PublicKey> = []): TransactionInstruction => {
		const data = serialize(
        {
            struct: {
                id: "u8",
								counter: "u64",
								new_expiry_time: "i64",
            },
        },
        {
            id: NescrowInstruction.ExtendEscrow,
						counter: args.counter,
						new_expiry_time: args.newExpiryTime,
        }
    );

		const [escrowPubkey] = pda.deriveEscrowAccountPDA({
				creator: args.creator,
				counter: args.counter,
    }, _programId);

    return new TransactionInstruction({
        data: Buffer.from(data),
        keys: [
						{pubkey: args.feePayer, isSigner: true, isWritable: true},
						{pubkey: escrowPubkey, isSigner: false, isWritable: true},
						{pubkey: args.creator, isSigner: true, isWritable: false},
            ...remainingAccounts.map(e => ({pubkey: e, isSigner: false, isWritable: false})),
        ],
        programId: _programId,
    });
};

/**
 * ### Returns a {@link TransactionSignature}
 * Extend the expiry time of an escrow
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` escrow: {@link Escrow} 
 * 2. `[signer]` creator: {@link PublicKey} 
 *
 * Data:
 * - counter: {@link BigInt} 
 * - new_expiry_time: {@link BigInt} The new expiry time for the escrow (Unix timestamp)
 */
export const extendEscrowSendAndConfirm = async (
	args: Omit<ExtendEscrowArgs, "feePayer" | "creator"> & {
	  signers: {
			feePayer: Keypair,
			creator: Keypair,
	  }
  }, 
  remainingAccounts: Array<PublicKey> = []
): Promise<TransactionSignature> => {
  const trx = new Transaction();


	trx.add(extendEscrow({
		...args,
		feePayer: args.signers.feePayer.publicKey,
		creator: args.signers.creator.publicKey,
	}, remainingAccounts));

  return await sendAndConfirmTransaction(
    _connection,
    trx,
    [
				args.signers.feePayer,
				args.signers.creator,
    ]
  );
};

// Getters

export const getEscrowStatus = async (
    publicKey: PublicKey,
    commitmentOrConfig: Commitment | GetAccountInfoConfig | undefined = "processed"
): Promise<T.EscrowStatus | undefined> => {
    const buffer = await _connection.getAccountInfo(publicKey, commitmentOrConfig);

    if (!buffer) {
        return undefined
    }

    if (buffer.data.length <= 0) {
        return undefined
    }

    return T.decodeEscrowStatus(deserialize(T.EscrowStatusSchema, buffer.data) as Record<string, unknown>);
}

export const getEscrow = async (
    publicKey: PublicKey,
    commitmentOrConfig: Commitment | GetAccountInfoConfig | undefined = "processed"
): Promise<T.Escrow | undefined> => {
    const buffer = await _connection.getAccountInfo(publicKey, commitmentOrConfig);

    if (!buffer) {
        return undefined
    }

    if (buffer.data.length <= 0) {
        return undefined
    }

    return T.decodeEscrow(deserialize(T.EscrowSchema, buffer.data) as Record<string, unknown>);
}


// Websocket Events

