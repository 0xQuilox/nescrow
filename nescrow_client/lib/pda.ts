import {PublicKey} from "@solana/web3.js";

export type EscrowAccountSeeds = {
    creator: PublicKey, 
    counter: bigint, 
};

export const deriveEscrowAccountPDA = (
    seeds: EscrowAccountSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("escrow"),
            seeds.creator.toBuffer(),
            Buffer.from(BigUint64Array.from([seeds.counter]).buffer),
        ],
        programId,
    )
};

