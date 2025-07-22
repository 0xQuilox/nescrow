use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use crate::generated::errors::NescrowError;

#[derive(BorshSerialize, Debug)]
pub enum NescrowInstruction {
/// Create a new escrow for wagering
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` escrow: [Escrow] 
/// 2. `[writable, signer]` creator: [AccountInfo] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - counter: [u64] Counter to make the escrow PDA unique
/// - amount: [u64] The amount of lamports to wager
/// - description: [String] type
/// - expiry_time: [i64] The time when the escrow expires (Unix timestamp)
	CreateEscrow(CreateEscrowArgs),

/// Accept an existing escrow
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` escrow: [Escrow] 
/// 2. `[writable, signer]` taker: [AccountInfo] 
///
/// Data:
/// - creator: [Pubkey] 
/// - counter: [u64] 
	AcceptEscrow(AcceptEscrowArgs),

/// Complete the escrow and distribute funds to winner
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` escrow: [Escrow] 
/// 2. `[signer]` authority: [AccountInfo] Must be either creator or taker
/// 3. `[writable]` winner: [AccountInfo] The account that will receive the funds
///
/// Data:
/// - creator: [Pubkey] 
/// - counter: [u64] 
	CompleteEscrow(CompleteEscrowArgs),

/// Cancel an escrow if not yet accepted
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` escrow: [Escrow] 
/// 2. `[writable, signer]` creator: [AccountInfo] 
///
/// Data:
/// - counter: [u64] 
	CancelEscrow(CancelEscrowArgs),

/// Extend the expiry time of an escrow
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` escrow: [Escrow] 
/// 2. `[signer]` creator: [AccountInfo] 
///
/// Data:
/// - counter: [u64] 
/// - new_expiry_time: [i64] The new expiry time for the escrow (Unix timestamp)
	ExtendEscrow(ExtendEscrowArgs),

}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CreateEscrowArgs {
	pub counter: u64,
	pub amount: u64,
	pub description: String,
	pub expiry_time: i64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct AcceptEscrowArgs {
	pub creator: Pubkey,
	pub counter: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CompleteEscrowArgs {
	pub creator: Pubkey,
	pub counter: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CancelEscrowArgs {
	pub counter: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct ExtendEscrowArgs {
	pub counter: u64,
	pub new_expiry_time: i64,
}

impl NescrowInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(NescrowError::InvalidInstruction)?;

        Ok(match variant {
			0 => Self::CreateEscrow(CreateEscrowArgs::try_from_slice(rest).unwrap()),
			1 => Self::AcceptEscrow(AcceptEscrowArgs::try_from_slice(rest).unwrap()),
			2 => Self::CompleteEscrow(CompleteEscrowArgs::try_from_slice(rest).unwrap()),
			3 => Self::CancelEscrow(CancelEscrowArgs::try_from_slice(rest).unwrap()),
			4 => Self::ExtendEscrow(ExtendEscrowArgs::try_from_slice(rest).unwrap()),
			_ => return Err(NescrowError::InvalidInstruction.into())
        })
    }
}