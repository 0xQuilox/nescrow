use std::str::FromStr;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    borsh0_10::try_from_slice_unchecked,
    entrypoint::ProgramResult,
    msg,
    program::{invoke_signed},
    pubkey::Pubkey,
    rent::Rent,
    system_instruction::create_account,
    sysvar::Sysvar,
};

use crate::generated::errors::NescrowError;
use crate::generated::state::{AccountPDA, Escrow};

/// Escrow status constants
pub const ESCROW_STATUS_OPEN: u8 = 0;
pub const ESCROW_STATUS_ACCEPTED: u8 = 1;
pub const ESCROW_STATUS_COMPLETED: u8 = 2;
pub const ESCROW_STATUS_CANCELLED: u8 = 3;

/// Create a new escrow for wagering
///
/// # Arguments
///
/// * `program_id` - The program ID
/// * `accounts` - The accounts required for this instruction
/// * `counter` - Counter to make the escrow PDA unique
/// * `amount` - The amount of lamports to wager
/// * `description` - Description of the escrow
/// * `expiry_time` - The time when the escrow expires (Unix timestamp)
///
/// # Accounts
///
/// * `[writable, signer]` fee_payer: Account paying for the transaction
/// * `[writable]` escrow: Escrow account to be created
/// * `[writable, signer]` creator: Creator of the escrow
/// * `[]` system_program: System program for account creation
///
/// # Errors
///
/// * `InvalidSignerPermission` - If required signers are not present
/// * `NotExpectedAddress` - If account addresses don't match expected values
/// * `WrongAccountOwner` - If account owners don't match expected values
/// * `InvalidAccountLen` - If account data length is incorrect
pub fn create_escrow(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    counter: u64,
    amount: u64,
    description: String,
    expiry_time: i64,
) -> ProgramResult {
    msg!("Instruction: CreateEscrow");
    
    // Parse accounts
    let account_info_iter = &mut accounts.iter();
    let fee_payer_info = next_account_info(account_info_iter)?;
    let escrow_info = next_account_info(account_info_iter)?;
    let creator_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;

    // Derive PDA for escrow account
    let (escrow_pubkey, escrow_bump) = Pubkey::find_program_address(
        &[
            b"escrow", 
            creator_info.key.as_ref(), 
            counter.to_le_bytes().as_ref()
        ],
        program_id,
    );
    
    // Validate accounts
    validate_accounts(
        fee_payer_info,
        escrow_info,
        creator_info,
        system_program_info,
        &escrow_pubkey,
        program_id,
    )?;

    // Initialize escrow account
    let space: usize = 383; // Size of the Escrow struct
    let rent = Rent::get()?;
    let rent_minimum_balance = rent.minimum_balance(space);

    // Create the escrow account
    msg!("Creating escrow account: {}", escrow_pubkey);
    invoke_signed(
        &create_account(
            &fee_payer_info.key,
            &escrow_info.key,
            rent_minimum_balance,
            space as u64,
            program_id,
        ),
        &[fee_payer_info.clone(), escrow_info.clone()],
        &[&[
            b"escrow", 
            creator_info.key.as_ref(), 
            counter.to_le_bytes().as_ref(), 
            &[escrow_bump]
        ]],
    )?;

    // Verify account ownership and size after creation
    if escrow_info.data_len() != space {
        return Err(NescrowError::InvalidAccountLen.into());
    }

    // Initialize escrow data
    let escrow = &mut AccountPDA::new(
        &escrow_info,
        try_from_slice_unchecked::<Escrow>(&escrow_info.data.borrow()).unwrap(),
        escrow_bump,
    );

    // Set escrow data
    escrow.data.creator = *creator_info.key;
    escrow.data.taker = None;
    escrow.data.amount = amount;
    escrow.data.status = ESCROW_STATUS_OPEN;
    escrow.data.winner = None;
    escrow.data.description = description;
    escrow.data.expiry_time = expiry_time;
    escrow.data.escrow_bump = escrow_bump;
    escrow.data.counter = counter;

    // Serialize escrow data back to the account
    escrow.data.serialize(&mut &mut escrow_info.data.borrow_mut()[..])?;

    msg!("Escrow created successfully");
    Ok(())
}

/// Validate all accounts for the create_escrow instruction
fn validate_accounts(
    fee_payer_info: &AccountInfo,
    escrow_info: &AccountInfo,
    creator_info: &AccountInfo,
    system_program_info: &AccountInfo,
    expected_escrow_pubkey: &Pubkey,
    program_id: &Pubkey,
) -> ProgramResult {
    // Check signers
    if !fee_payer_info.is_signer {
        msg!("Error: Fee payer must be a signer");
        return Err(NescrowError::InvalidSignerPermission.into());
    }

    if !creator_info.is_signer {
        msg!("Error: Creator must be a signer");
        return Err(NescrowError::InvalidSignerPermission.into());
    }

    // Check escrow address
    if escrow_info.key != expected_escrow_pubkey {
        msg!("Error: Escrow address does not match the derived PDA");
        return Err(NescrowError::NotExpectedAddress.into());
    }

    // Check system program
    let system_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    if system_program_info.key != &system_program_id {
        msg!("Error: System program does not match the expected address");
        return Err(NescrowError::NotExpectedAddress.into());
    }

    Ok(())
}