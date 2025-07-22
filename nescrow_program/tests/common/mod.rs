use {
	solana_program_test::{processor, ProgramTest},
	nescrow::generated::entrypoint::process_instruction,
};

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"nescrow",
		nescrow_ix_interface::ID,
		processor!(process_instruction),
	);

	return program_test;
}
	
pub mod nescrow_ix_interface {

	use {
		borsh::BorshSerialize,
		solana_sdk::{
			declare_id,
			hash::Hash,
			instruction::{AccountMeta, Instruction},
			pubkey::Pubkey,
			signature::{Keypair, Signer},
			transaction::Transaction,
		},
		nescrow::generated::instructions::*,
	};

	declare_id!("FG4TENpdyGmjxqJYwheeKHyRfcXTwPxFT6nCs8aP1HdL");

	pub fn create_escrow_ix_setup(
		fee_payer: &Keypair,
		escrow: Pubkey,
		creator: &Keypair,
		system_program: Pubkey,
		counter: u64,
		amount: u64,
		description: &String,
		expiry_time: i64,
		recent_blockhash: Hash,
	) -> Transaction {
		let data = NescrowInstruction::CreateEscrow(
			CreateEscrowArgs{
				counter,
				amount,
				description: description.clone(),
				expiry_time,
			},
		);

		let instruction = Instruction {
			program_id: id(),
			accounts: vec![
				AccountMeta::new(fee_payer.pubkey(), true),
				AccountMeta::new(escrow, false),
				AccountMeta::new(creator.pubkey(), true),
				AccountMeta::new_readonly(system_program, false),
			],
			data: data.try_to_vec().unwrap(),
		};

		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&creator,
		], recent_blockhash);

		return transaction;
	}

	pub fn accept_escrow_ix_setup(
		fee_payer: &Keypair,
		escrow: Pubkey,
		taker: &Keypair,
		creator: Pubkey,
		counter: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let data = NescrowInstruction::AcceptEscrow(
			AcceptEscrowArgs{
				creator,
				counter,
			},
		);

		let instruction = Instruction {
			program_id: id(),
			accounts: vec![
				AccountMeta::new(fee_payer.pubkey(), true),
				AccountMeta::new(escrow, false),
				AccountMeta::new(taker.pubkey(), true),
			],
			data: data.try_to_vec().unwrap(),
		};

		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&taker,
		], recent_blockhash);

		return transaction;
	}

	pub fn complete_escrow_ix_setup(
		fee_payer: &Keypair,
		escrow: Pubkey,
		authority: &Keypair,
		winner: Pubkey,
		creator: Pubkey,
		counter: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let data = NescrowInstruction::CompleteEscrow(
			CompleteEscrowArgs{
				creator,
				counter,
			},
		);

		let instruction = Instruction {
			program_id: id(),
			accounts: vec![
				AccountMeta::new(fee_payer.pubkey(), true),
				AccountMeta::new(escrow, false),
				AccountMeta::new_readonly(authority.pubkey(), true),
				AccountMeta::new(winner, false),
			],
			data: data.try_to_vec().unwrap(),
		};

		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn cancel_escrow_ix_setup(
		fee_payer: &Keypair,
		escrow: Pubkey,
		creator: &Keypair,
		counter: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let data = NescrowInstruction::CancelEscrow(
			CancelEscrowArgs{
				counter,
			},
		);

		let instruction = Instruction {
			program_id: id(),
			accounts: vec![
				AccountMeta::new(fee_payer.pubkey(), true),
				AccountMeta::new(escrow, false),
				AccountMeta::new(creator.pubkey(), true),
			],
			data: data.try_to_vec().unwrap(),
		};

		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&creator,
		], recent_blockhash);

		return transaction;
	}

	pub fn extend_escrow_ix_setup(
		fee_payer: &Keypair,
		escrow: Pubkey,
		creator: &Keypair,
		counter: u64,
		new_expiry_time: i64,
		recent_blockhash: Hash,
	) -> Transaction {
		let data = NescrowInstruction::ExtendEscrow(
			ExtendEscrowArgs{
				counter,
				new_expiry_time,
			},
		);

		let instruction = Instruction {
			program_id: id(),
			accounts: vec![
				AccountMeta::new(fee_payer.pubkey(), true),
				AccountMeta::new(escrow, false),
				AccountMeta::new_readonly(creator.pubkey(), true),
			],
			data: data.try_to_vec().unwrap(),
		};

		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&fee_payer.pubkey()),
		);

		transaction.sign(&[
			&fee_payer,
			&creator,
		], recent_blockhash);

		return transaction;
	}

}
