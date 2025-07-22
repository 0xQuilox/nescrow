# Nescrow Technical Documentation

## System Architecture

Nescrow is a decentralized escrow system built on the Solana blockchain with a three-tier architecture:

1. **Solana Program (Smart Contract)**: The on-chain logic written in Rust
2. **Client Library**: A TypeScript SDK for interacting with the Solana program
3. **Web Frontend**: A React application providing a user interface

### Solana Program Architecture

The Solana program is structured using a modular approach:

```
nescrow_program/
├── Cargo.toml           # Rust dependencies and configuration
├── lib.rs               # Entry point for the program
├── generated/           # Generated code from CIDL
│   ├── entrypoint.rs    # Program entrypoint
│   ├── errors.rs        # Error definitions
│   ├── instructions.rs  # Instruction definitions
│   ├── processor.rs     # Instruction processor
│   ├── state.rs         # State definitions
│   └── mod.rs           # Module exports
└── src/                 # Implementation of instructions
    ├── create_escrow.rs # Create escrow implementation
    ├── accept_escrow.rs # Accept escrow implementation
    ├── complete_escrow.rs # Complete escrow implementation
    ├── cancel_escrow.rs # Cancel escrow implementation
    ├── extend_escrow.rs # Extend escrow implementation
    └── mod.rs           # Module exports
```

### Client Library Architecture

The TypeScript client library provides a high-level API for interacting with the Nescrow program:

```
nescrow_client/
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── index.ts             # Main exports
├── nescrow.ts           # NescrowClient class
└── lib/                 # Supporting modules
    ├── pda.ts           # PDA derivation functions
    ├── rpc.ts           # RPC functions for program instructions
    ├── types.ts         # TypeScript type definitions
    └── utils.ts         # Utility functions
```

### Frontend Architecture

The React frontend provides a user-friendly interface for interacting with the Nescrow program:

```
src/
├── App.js               # Main application component
├── index.js             # Entry point
├── index.css            # Global styles
├── components/          # Reusable UI components
│   ├── EscrowCard.js    # Card component for displaying escrows
│   └── Layout.js        # Layout component
├── contexts/            # React contexts
│   └── NescrowContext.js # Context for Nescrow client
└── pages/               # Application pages
    ├── Home.js          # Home page
    ├── CreateEscrow.js  # Create escrow page
    ├── EscrowDetails.js # Escrow details page
    ├── MyEscrows.js     # User's escrows page
    └── OpenEscrows.js   # Open escrows marketplace page
```

## Data Model

### Escrow Account

The main data structure in the Nescrow program is the `Escrow` account, which stores all the information about an escrow agreement:

```rust
pub struct Escrow {
    pub creator: Pubkey,       // Creator of the escrow
    pub taker: Option<Pubkey>, // Taker of the escrow (if accepted)
    pub amount: u64,           // Amount of lamports in escrow
    pub description: String,   // Description of the escrow
    pub expiry_time: i64,      // Expiry time (Unix timestamp)
    pub status: u8,            // Status of the escrow (0=Open, 1=Accepted, 2=Completed, 3=Cancelled)
}
```

### Account PDAs (Program Derived Addresses)

Escrow accounts are stored as PDAs with the following derivation path:

```
["escrow", creator_pubkey, counter]
```

Where:
- `"escrow"` is a static seed
- `creator_pubkey` is the public key of the escrow creator
- `counter` is a unique counter for each creator to ensure unique PDAs

## Program Instructions

### Create Escrow

Creates a new escrow agreement.

**Accounts:**
- `fee_payer`: Account paying for the transaction (signer)
- `escrow`: Escrow account to be created (PDA)
- `creator`: Creator of the escrow (signer)
- `system_program`: System program for account creation

**Data:**
- `counter`: Counter to make the escrow PDA unique
- `amount`: Amount of lamports to escrow
- `description`: Description of the escrow
- `expiry_time`: Expiry time of the escrow (Unix timestamp)

**Processing:**
1. Verify all accounts and signers
2. Create the escrow account as a PDA
3. Initialize the escrow data with status = Open

### Accept Escrow

Accepts an existing escrow agreement.

**Accounts:**
- `fee_payer`: Account paying for the transaction (signer)
- `escrow`: Escrow account to accept
- `taker`: Account accepting the escrow (signer)

**Data:**
- None

**Processing:**
1. Verify all accounts and signers
2. Check that the escrow is in Open status
3. Check that the escrow has not expired
4. Update the escrow with the taker's public key
5. Change the escrow status to Accepted

### Complete Escrow

Completes an escrow and distributes funds to the winner.

**Accounts:**
- `fee_payer`: Account paying for the transaction (signer)
- `escrow`: Escrow account to complete
- `authority`: Authority completing the escrow (must be creator or taker) (signer)
- `winner`: Account to receive the escrow funds

**Data:**
- None

**Processing:**
1. Verify all accounts and signers
2. Check that the escrow is in Accepted status
3. Check that the authority is either the creator or taker
4. Check that the winner is either the creator or taker
5. Transfer the escrow funds to the winner
6. Change the escrow status to Completed

### Cancel Escrow

Cancels an escrow that hasn't been accepted.

**Accounts:**
- `fee_payer`: Account paying for the transaction (signer)
- `escrow`: Escrow account to cancel
- `creator`: Creator of the escrow (signer)

**Data:**
- None

**Processing:**
1. Verify all accounts and signers
2. Check that the escrow is in Open status
3. Check that the signer is the creator
4. Return the escrow funds to the creator
5. Change the escrow status to Cancelled

### Extend Escrow

Extends the expiry time of an escrow.

**Accounts:**
- `fee_payer`: Account paying for the transaction (signer)
- `escrow`: Escrow account to extend
- `creator`: Creator of the escrow (signer)

**Data:**
- `new_expiry_time`: New expiry time (Unix timestamp)

**Processing:**
1. Verify all accounts and signers
2. Check that the escrow is in Open or Accepted status
3. Check that the signer is the creator
4. Check that the new expiry time is in the future
5. Update the escrow with the new expiry time

## Client Library Implementation

The TypeScript client library provides a high-level API for interacting with the Nescrow program. The main class is `NescrowClient`, which encapsulates all the functionality for creating, accepting, completing, canceling, and extending escrows.

### Key Components

#### PDA Derivation

The `pda.ts` module provides functions for deriving PDAs for escrow accounts:

```typescript
export function deriveEscrowAccountPDA(
  params: { creator: PublicKey; counter: bigint },
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow"),
      params.creator.toBuffer(),
      Buffer.from(params.counter.toString(16).padStart(16, '0'), 'hex')
    ],
    programId
  );
}
```

#### RPC Functions

The `rpc.ts` module provides functions for creating and sending transactions to the Nescrow program:

```typescript
export function createEscrow(params: {
  feePayer: PublicKey;
  creator: PublicKey;
  counter: bigint;
  amount: bigint;
  description: string;
  expiryTime: bigint;
}): TransactionInstruction {
  // Create and return the instruction
}
```

#### Type Definitions

The `types.ts` module provides TypeScript type definitions for the Nescrow program's data structures:

```typescript
export interface Escrow {
  creator: PublicKey;
  taker: PublicKey | null;
  amount: bigint;
  description: string;
  expiryTime: bigint;
  status: number;
}
```

## Frontend Implementation

The React frontend provides a user-friendly interface for interacting with the Nescrow program. It uses the client library to communicate with the Solana blockchain.

### Key Components

#### NescrowContext

The `NescrowContext` provides a global state for the application, including the Nescrow client, loading state, and escrow data:

```javascript
export function NescrowProvider({ children }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEscrows, setOpenEscrows] = useState([]);
  const [myEscrows, setMyEscrows] = useState([]);
  
  // Initialize client and load data
  
  return (
    <NescrowContext.Provider value={{ client, loading, openEscrows, myEscrows, refreshData }}>
      {children}
    </NescrowContext.Provider>
  );
}
```

#### Pages

The application has several pages for different functionality:

- `Home.js`: Landing page with overview and navigation
- `CreateEscrow.js`: Form for creating new escrows
- `EscrowDetails.js`: Detailed view of a specific escrow
- `MyEscrows.js`: List of the user's escrows
- `OpenEscrows.js`: Marketplace of open escrows

#### Components

Reusable components include:

- `EscrowCard.js`: Card component for displaying escrow information
- `Layout.js`: Layout component for consistent page structure

## Security Considerations

### Program Security

- **Signer Verification**: All instructions verify that the required accounts are signers
- **Status Checks**: Instructions check that escrows are in the appropriate status
- **Expiry Time**: Escrows have an expiry time to prevent funds from being locked indefinitely
- **PDA Verification**: The program verifies that PDAs are derived correctly

### Client Security

- **Transaction Signing**: All transactions are signed by the appropriate keypairs
- **Error Handling**: The client library includes robust error handling
- **Input Validation**: User inputs are validated before creating transactions

### Frontend Security

- **Wallet Connection**: The frontend uses the Solana wallet adapter for secure wallet connections
- **Loading States**: Loading states prevent users from submitting multiple transactions
- **Error Handling**: Errors are caught and displayed to the user

## Performance Considerations

### Program Performance

- **Account Size**: Escrow accounts are sized appropriately to minimize rent costs
- **Instruction Complexity**: Instructions are designed to be efficient and minimize compute units

### Client Performance

- **Caching**: The client library caches account data to reduce RPC calls
- **Batching**: Multiple instructions can be batched into a single transaction where appropriate

### Frontend Performance

- **React Optimization**: Components are optimized to prevent unnecessary re-renders
- **Data Loading**: Data is loaded asynchronously to prevent blocking the UI

## Deployment

### Program Deployment

The Nescrow program can be deployed to the Solana blockchain using the Solana CLI:

```bash
solana program deploy target/deploy/nescrow.so
```

### Client Deployment

The client library can be published to npm or used directly from the repository.

### Frontend Deployment

The React frontend can be deployed to any static hosting service:

```bash
npm run build
```

## Testing

### Program Testing

The Solana program includes unit tests for each instruction:

```bash
cargo test
```

### Client Testing

The client library includes tests for each function:

```bash
npm test
```

### Frontend Testing

The React frontend includes tests for components and pages:

```bash
npm test
```

## Conclusion

Nescrow is a comprehensive escrow system built on the Solana blockchain. It provides a secure and efficient way for users to conduct peer-to-peer transactions with escrow protection. The modular architecture and clean separation of concerns make it easy to maintain and extend.