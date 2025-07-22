use std::str::FromStr;
use std::ops::DerefMut;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::AccountInfo;
use solana_program::entrypoint::ProgramResult;
use solana_program::pubkey::Pubkey;
use solana_program::msg;
use crate::generated::errors::NescrowError;
use crate::generated::instructions::NescrowInstruction;

use crate::src::*;

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        data: &[u8],
    ) -> ProgramResult {
        let instruction = NescrowInstruction::unpack(data)?;

        match instruction {
					NescrowInstruction::CreateEscrow(args) => {
				msg!("Instruction: CreateEscrow");
				create_escrow::create_escrow(
					program_id,
					accounts, 
					args.counter,
					args.amount,
					args.description,
					args.expiry_time,
				)
			}
			NescrowInstruction::AcceptEscrow(args) => {
				msg!("Instruction: AcceptEscrow");
				accept_escrow::accept_escrow(
					program_id,
					accounts, 
					args.creator,
					args.counter,
				)
			}
			NescrowInstruction::CompleteEscrow(args) => {
				msg!("Instruction: CompleteEscrow");
				complete_escrow::complete_escrow(
					program_id,
					accounts, 
					args.creator,
					args.counter,
				)
			}
			NescrowInstruction::CancelEscrow(args) => {
				msg!("Instruction: CancelEscrow");
				cancel_escrow::cancel_escrow(
					program_id,
					accounts, 
					args.counter,
				)
			}
			NescrowInstruction::ExtendEscrow(args) => {
				msg!("Instruction: ExtendEscrow");
				extend_escrow::extend_escrow(
					program_id,
					accounts, 
					args.counter,
					args.new_expiry_time,
				)
			}
        }
    }

}