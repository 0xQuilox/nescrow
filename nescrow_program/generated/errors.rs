use num_derive::FromPrimitive;
use solana_program::decode_error::DecodeError;
use solana_program::msg;
use solana_program::program_error::{PrintProgramError, ProgramError};
use thiserror::Error;

#[derive(Error, FromPrimitive, Debug, Clone)]
pub enum NescrowError {
    #[error("Invalid Instruction")]
    InvalidInstruction,

    #[error("Invalid Signer Permission")]
    InvalidSignerPermission,

    #[error("Not The Expected Account Address")]
    NotExpectedAddress,

    #[error("Wrong Account Owner")]
    WrongAccountOwner,

    #[error("Invalid Account Len")]
    InvalidAccountLen,

    #[error("Executable Account Expected")]
    ExecutableAccountExpected,

	#[error("Account Already Closed")]
	AccountAlreadyClosed,

	#[error("EscrowNotOpen")]
	EscrowNotOpen,
	#[error("EscrowAlreadyAccepted")]
	EscrowAlreadyAccepted,
	#[error("EscrowExpired")]
	EscrowExpired,
	#[error("InvalidAuthority")]
	InvalidAuthority,
	#[error("InvalidWinner")]
	InvalidWinner,
	#[error("EscrowNotAccepted")]
	EscrowNotAccepted,
 
}

impl From<NescrowError> for ProgramError {
    fn from(e: NescrowError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for NescrowError {
    fn type_of() -> &'static str {
        "NescrowError"
    }
}

impl PrintProgramError for NescrowError {
    fn print<E>(&self)
    where
        E: 'static
            + std::error::Error
            + DecodeError<E>
            + PrintProgramError
            + num_traits::FromPrimitive,
    {
        match self {
            NescrowError::InvalidInstruction => msg!("Error: Invalid instruction"),
            NescrowError::InvalidSignerPermission => msg!("Error: The account is_signer value is not the expected one"),
            NescrowError::NotExpectedAddress => {
                msg!("Error: Not the expected account address")
            }
            NescrowError::WrongAccountOwner => msg!("Error: Wrong account owner"),
            NescrowError::InvalidAccountLen => msg!("Error: Invalid account length"),
            NescrowError::ExecutableAccountExpected => msg!("Error: Executable account expected"),
            NescrowError::AccountAlreadyClosed => msg!("Error: Account Already Closed"),
			NescrowError::EscrowNotOpen => msg!("Error: Escrow is not in Open status"),
			NescrowError::EscrowAlreadyAccepted => msg!("Error: Escrow has already been accepted"),
			NescrowError::EscrowExpired => msg!("Error: Escrow has expired"),
			NescrowError::InvalidAuthority => msg!("Error: Only the creator can perform this action"),
			NescrowError::InvalidWinner => msg!("Error: Winner must be either creator or taker"),
			NescrowError::EscrowNotAccepted => msg!("Error: Escrow must be in Accepted status to complete"),
 
        }
    }
}