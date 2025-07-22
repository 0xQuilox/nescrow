import type {Schema} from 'borsh';
import type {Decoded} from "./utils";
import {PublicKey} from "@solana/web3.js";
import { deserialize } from "borsh";

/// Status of the escrow
export interface EscrowStatus {
  status: number;
}

export const decodeEscrowStatus = (decoded: Decoded): EscrowStatus => ({
    status: decoded["status"] as number,
});

export const EscrowStatusSchema: Schema =  {
    struct: {
        status: "u8",
    }
};

/// Escrow account for wagering
export interface Escrow {
  creator: PublicKey;
  taker: PublicKey | undefined;
  amount: bigint;
  status: number;
  winner: PublicKey | undefined;
  description: string;
  expiryTime: bigint;
  escrowBump: number;
  counter: bigint;
}

export const decodeEscrow = (decoded: Decoded): Escrow => ({
    creator: new PublicKey(decoded["creator"] as Uint8Array),
    taker: decoded["taker"] ? new PublicKey(decoded["taker"]) : undefined,
    amount: decoded["amount"] as bigint,
    status: decoded["status"] as number,
    winner: decoded["winner"] ? new PublicKey(decoded["winner"]) : undefined,
    description: decoded["description"] as string,
    expiryTime: decoded["expiry_time"] as bigint,
    escrowBump: decoded["escrow_bump"] as number,
    counter: decoded["counter"] as bigint,
});

export const EscrowSchema: Schema =  {
    struct: {
        creator: { array: { type: "u8", len: 32 } },
        taker: { option: { array: { type: "u8", len: 32 } } },
        amount: "u64",
        status: "u8",
        winner: { option: { array: { type: "u8", len: 32 } } },
        description: "string",
        expiry_time: "i64",
        escrow_bump: "u8",
        counter: "u64",
    }
};



