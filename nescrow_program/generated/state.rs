use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::AccountInfo;
use solana_program::pubkey::Pubkey;

#[derive(Clone, Debug)]
pub struct Account<'a, 'b, T> {
    pub data: T,
    pub info: &'a AccountInfo<'b>,
}

#[derive(Clone, Debug)]
pub struct AccountPDA<'a, 'b, T> {
    pub data: T,
    pub info: &'a AccountInfo<'b>,
    pub bump: u8,
}

impl<'a, 'b, T> Account<'a, 'b, T> {
    pub fn new(info: &'a AccountInfo<'b>, data: T) -> Self {
        Self { data, info }
    }
}

impl<'a, 'b, T> AccountPDA<'a, 'b, T> {
    pub fn new(info: &'a AccountInfo<'b>, data: T, bump: u8) -> Self {
        Self { data, info, bump }
    }
}

/// Status of the escrow
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Default)]
pub struct EscrowStatus {
	pub status: u8,
}

/// Escrow account for wagering
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Default)]
pub struct Escrow {
	pub creator: Pubkey,
	pub taker: Option<Pubkey>,
	pub amount: u64,
	pub status: u8,
	pub winner: Option<Pubkey>,
	pub description: String,
	pub expiry_time: i64,
	pub escrow_bump: u8,
	pub counter: u64,
}

