# Nescrow: Solana Escrow System

Nescrow is a decentralized escrow system built on the Solana blockchain. It enables secure peer-to-peer transactions by holding funds in escrow until predefined conditions are met.

## 🌟 Features

- **Create Escrows**: Create escrow agreements with customizable amounts and expiry times
- **Accept Escrows**: Join existing escrow agreements as a counterparty
- **Complete Escrows**: Settle escrows by designating a winner to receive the funds
- **Cancel Escrows**: Cancel escrows that haven't been accepted yet
- **Extend Escrows**: Extend the expiry time of existing escrows
- **User Dashboard**: View and manage all your escrow agreements
- **Open Marketplace**: Browse all open escrow opportunities

## 🏗️ Architecture

Nescrow consists of three main components:

1. **Solana Program (Smart Contract)**: Written in Rust, handles the on-chain logic
2. **Client Library**: TypeScript library for interacting with the Solana program
3. **Web Frontend**: React application for a user-friendly interface

### System Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│ TypeScript SDK  │────▶│  Solana Program │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.14 or later)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html) (optional, for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nescrow.git
   cd nescrow
   ```

2. Install dependencies for the client library:
   ```bash
   cd nescrow_client
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd ../
   npm install
   ```

4. Build the Solana program:
   ```bash
   cd nescrow_program
   cargo build-bpf
   ```

### Deployment

#### Deploy the Solana Program

1. Start a local Solana validator (for development):
   ```bash
   solana-test-validator
   ```

2. Build and deploy the program:
   ```bash
   cd nescrow_program
   cargo build-bpf
   solana program deploy target/deploy/nescrow.so
   ```

3. Note the program ID that is output after deployment.

#### Configure the Client and Frontend

1. Update the program ID in the frontend:
   ```bash
   cd ../src/contexts/NescrowContext.js
   ```
   Replace `YOUR_PROGRAM_ID_HERE` with your actual program ID.

2. Start the frontend:
   ```bash
   npm start
   ```

## 💻 Usage

### Creating an Escrow

1. Connect your Solana wallet
2. Navigate to "Create Escrow"
3. Enter the amount, description, and expiry time
4. Confirm the transaction in your wallet

### Accepting an Escrow

1. Browse open escrows on the marketplace
2. Click "Accept" on an escrow you want to join
3. Confirm the transaction in your wallet

### Completing an Escrow

1. Navigate to "My Escrows"
2. Find the escrow you want to complete
3. Click "Complete" and select the winner
4. Confirm the transaction in your wallet

## 🧪 Testing

### Program Tests

Run the Solana program tests:

```bash
cd nescrow_program
cargo test
```

### Frontend Tests

Run the React frontend tests:

```bash
cd ../
npm test
```

## 📚 API Documentation

### Solana Program Instructions

The Nescrow program supports the following instructions:

- `create_escrow`: Create a new escrow agreement
- `accept_escrow`: Accept an existing escrow as a counterparty
- `complete_escrow`: Complete an escrow and distribute funds
- `cancel_escrow`: Cancel an escrow that hasn't been accepted
- `extend_escrow`: Extend the expiry time of an escrow

### Client Library API

The TypeScript client library provides a high-level API for interacting with the Nescrow program:

```typescript
import { NescrowClient } from 'nescrow';

// Initialize the client
const client = new NescrowClient(connection, programId);

// Create an escrow
const { escrowPubkey, signature } = await client.createEscrow(
  creatorKeypair,
  amount,
  description,
  expiryTime
);

// Accept an escrow
const signature = await client.acceptEscrow(
  creatorPublicKey,
  counter,
  takerKeypair
);

// Complete an escrow
const signature = await client.completeEscrow(
  creatorPublicKey,
  counter,
  authorityKeypair,
  winnerPublicKey
);

// Cancel an escrow
const signature = await client.cancelEscrow(
  creatorKeypair,
  counter
);

// Extend an escrow
const signature = await client.extendEscrow(
  creatorKeypair,
  counter,
  newExpiryTime
);
```

## 🔒 Security Considerations

- All escrow operations are secured by Solana's transaction signing mechanism
- Program checks ensure that only authorized parties can modify escrows
- Expiry times prevent funds from being locked indefinitely
- Escrow accounts are program-derived addresses (PDAs) with secure derivation paths

## 🛣️ Roadmap

- [ ] Multi-token escrows (SPL tokens)
- [ ] Conditional escrows (oracle integration)
- [ ] Escrow templates for common use cases
- [ ] Mobile app support
- [ ] Multi-signature escrows

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please open an issue on the GitHub repository.