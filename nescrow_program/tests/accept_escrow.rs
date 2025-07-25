pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		nescrow_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn accept_escrow_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// DATA
	let creator: Pubkey = Pubkey::default();
	let counter: u64 = Default::default();

	// KEYPAIR
	let fee_payer_keypair = Keypair::new();
	let taker_keypair = Keypair::new();

	// PUBKEY
	let fee_payer_pubkey = fee_payer_keypair.pubkey();
	let taker_pubkey = taker_keypair.pubkey();

	// PDA
	let (escrow_pda, _escrow_pda_bump) = Pubkey::find_program_address(
		&[
			b"escrow",
			creator.as_ref(),
			counter.to_le_bytes().as_ref(),
		],
		&nescrow_ix_interface::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		fee_payer_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		taker_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = nescrow_ix_interface::accept_escrow_ix_setup(
		&fee_payer_keypair,
		escrow_pda,
		&taker_keypair,
		creator,
		counter,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
