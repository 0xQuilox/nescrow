import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { NescrowClient } from './nescrow';

// Example usage of the Nescrow client
async function main() {
  // Connect to the Solana devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  
  // Replace with your actual program ID
  const programId = new PublicKey('YOUR_PROGRAM_ID_HERE');
  
  // Create a new Nescrow client
  const nescrowClient = new NescrowClient(connection, programId);
  
  // Generate keypairs for testing (in a real app, you would use wallet adapters)
  const creator = Keypair.generate();
  const taker = Keypair.generate();
  
  console.log('Creator pubkey:', creator.publicKey.toBase58());
  console.log('Taker pubkey:', taker.publicKey.toBase58());
  
  // Request airdrop for testing
  console.log('Requesting airdrop for creator...');
  const airdropSignature = await connection.requestAirdrop(creator.publicKey, 2 * 10**9); // 2 SOL
  await connection.confirmTransaction(airdropSignature);
  
  console.log('Requesting airdrop for taker...');
  const airdropSignature2 = await connection.requestAirdrop(taker.publicKey, 2 * 10**9); // 2 SOL
  await connection.confirmTransaction(airdropSignature2);
  
  // Create an escrow
  console.log('Creating escrow...');
  const { escrowPubkey, signature } = await nescrowClient.createEscrow(
    creator,
    0.5, // 0.5 SOL
    'Bet on the football game: Team A vs Team B',
    Math.floor(Date.now() / 1000) + 3600 // Expires in 1 hour
  );
  
  console.log('Escrow created with signature:', signature);
  console.log('Escrow pubkey:', escrowPubkey.toBase58());
  
  // Get the escrow data
  const escrow = await nescrowClient.getEscrow(escrowPubkey);
  console.log('Escrow data:', escrow);
  
  // Accept the escrow
  console.log('Accepting escrow...');
  const acceptSignature = await nescrowClient.acceptEscrow(
    creator.publicKey,
    escrow!.counter,
    taker
  );
  
  console.log('Escrow accepted with signature:', acceptSignature);
  
  // Get the updated escrow data
  const updatedEscrow = await nescrowClient.getEscrow(escrowPubkey);
  console.log('Updated escrow data:', updatedEscrow);
  
  // Complete the escrow (creator decides the winner is the taker)
  console.log('Completing escrow...');
  const completeSignature = await nescrowClient.completeEscrow(
    creator.publicKey,
    escrow!.counter,
    creator, // Authority is the creator
    taker.publicKey // Winner is the taker
  );
  
  console.log('Escrow completed with signature:', completeSignature);
  
  // Get the final escrow data
  const finalEscrow = await nescrowClient.getEscrow(escrowPubkey);
  console.log('Final escrow data:', finalEscrow);
}

main().catch(err => {
  console.error('Error:', err);
});