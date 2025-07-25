use crate::generated::errors::NescrowError;
use crate::generated::processor::Processor;
use solana_program::program_error::PrintProgramError;
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    if let Err(error) = Processor::process(program_id, accounts, data) {
        // catch the error so we can print it
        error.print::<NescrowError>();
        return Err(error);
    }
    Ok(())
}