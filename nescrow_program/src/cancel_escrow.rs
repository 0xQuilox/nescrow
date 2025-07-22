use std::str::FromStr;
use std::ops::DerefMut;
use borsh::{BorshDeserialize, BorshSerialize};

// need to dynamically include this when there is an invoke
use solana_program::instruction::{AccountMeta, Instruction};

// need to dynamically include this when there is an invoke
use solana_program::program::{invoke, invoke_signed};

use solana_program::borsh0_10::try_from_slice_unchecked;
use solana_program::account_info::{AccountInfo, next_account_info, next_account_infos};
use solana_program::entrypoint::ProgramResult;
use solana_program::pubkey::Pubkey;
use solana_program::rent::Rent;
use solana_program::system_instruction::create_account;
use solana_program::{msg, system_program};
use solana_program::sysvar::Sysvar;
use solana_program::program_pack::Pack;
use crate::generated::errors::NescrowError;
use crate::generated::state::*;
use solana_program::keccak;

use crate::generated::state::{
	AccountPDA,
	Escrow,
};




/// Cancel an escrow if not yet accepted
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` escrow: [Escrow] 
/// 2. `[writable, signer]` creator: [AccountInfo] 
///
/// Data:
/// - counter: [u64] 
pub fn cancel_escrow(
	program_id: &Pubkey,
	accounts: &[AccountInfo],
	counter: u64,
) -> ProgramResult {
    // Implement your business logic here...
let account_info_iter = &mut accounts.iter();
	let fee_payer_info = next_account_info(account_info_iter)?;
	let escrow_info = next_account_info(account_info_iter)?;
	let creator_info = next_account_info(account_info_iter)?;

	// Derive PDAs
	let (escrow_pubkey, escrow_bump) = Pubkey::find_program_address(
		&[b"escrow", creator_info.key.as_ref(), counter.to_le_bytes().as_ref()],
		program_id,
	);

	// Security Checks
	if fee_payer_info.is_signer != true {
		return Err(NescrowError::InvalidSignerPermission.into());
	}

	if *escrow_info.key != escrow_pubkey {
		return Err(NescrowError::NotExpectedAddress.into());
	}

	if creator_info.is_signer != true {
		return Err(NescrowError::InvalidSignerPermission.into());
	}



	// Security Checks
	if *escrow_info.owner != *program_id {
		return Err(NescrowError::WrongAccountOwner.into());
	}

	if *creator_info.owner != *program_id {
		return Err(NescrowError::WrongAccountOwner.into());
	}

	if escrow_info.data_len() != 383usize {
		return Err(NescrowError::InvalidAccountLen.into());
	}


	// Accounts Deserialization
	let escrow = &mut AccountPDA::new(
		&escrow_info,
		try_from_slice_unchecked::<Escrow>(&escrow_info.data.borrow()).unwrap(),
		escrow_bump,
	);


	// Compressions



	// CPIs - Modify Default Values



	// Compression Calls - Modify Default Values

	// Accounts Serialization
	escrow.data.serialize(&mut &mut escrow_info.data.borrow_mut()[..])?;

    Ok(())
}