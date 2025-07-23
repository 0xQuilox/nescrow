import { escrows, transactions, users, type User, type InsertUser, type Escrow, type InsertEscrow, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(address: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Escrow operations
  getEscrow(escrowId: string): Promise<Escrow | undefined>;
  createEscrow(escrow: InsertEscrow): Promise<Escrow>;
  updateEscrow(escrowId: string, updates: Partial<Escrow>): Promise<Escrow | undefined>;
  getUserEscrows(userAddress: string): Promise<Escrow[]>;
  getActiveEscrows(userAddress: string): Promise<Escrow[]>;
  getAllEscrows(): Promise<Escrow[]>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getEscrowTransactions(escrowId: string): Promise<Transaction[]>;
  getUserTransactions(userAddress: string): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private escrows: Map<string, Escrow>;
  private transactions: Map<number, Transaction>;
  private userIdCounter: number;
  private escrowIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.escrows = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.escrowIdCounter = 1;
    this.transactionIdCounter = 1;

    // Add some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: this.userIdCounter++,
      address: "4x7k9mN2pL8qR1sT3uV6wX9yZ0aB2cD4eF5gH6iJ7kL8",
      username: "CryptoTrader",
      totalEscrows: 12,
      totalVolume: "1245.5",
      successRate: "94.20",
      createdAt: new Date(),
    };
    this.users.set(sampleUser.address, sampleUser);

    // Create sample escrows
    const sampleEscrows: Escrow[] = [
      {
        id: this.escrowIdCounter++,
        escrowId: "ESC001",
        type: "sports",
        title: "Lakers vs Warriors - Game 5",
        description: "Lakers to win the game",
        amount: "50.0",
        status: "active",
        creatorAddress: sampleUser.address,
        counterpartyAddress: "8xN3pL4qR1sT2uV5wX8yZ0aB1cD3eF4gH5iJ6kL7mN9",
        releaseConditions: JSON.stringify({ prediction: "Lakers Win", odds: "2.5" }),
        eventDate: new Date("2024-01-20T19:00:00Z"),
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:00:00Z"),
      },
      {
        id: this.escrowIdCounter++,
        escrowId: "ESC002",
        type: "marketplace",
        title: "Rare NFT Purchase",
        description: "Purchase of limited edition NFT",
        amount: "25.5",
        status: "pending",
        creatorAddress: sampleUser.address,
        counterpartyAddress: "2mR7pL8qS1tT2uV4wX7yZ9aB0cD2eF3gH4iJ5kL6mN8",
        releaseConditions: JSON.stringify({ deliveryConfirmed: false }),
        eventDate: null,
        createdAt: new Date("2024-01-16T14:30:00Z"),
        updatedAt: new Date("2024-01-16T14:30:00Z"),
      },
      {
        id: this.escrowIdCounter++,
        escrowId: "ESC003",
        type: "freelance",
        title: "Website Development Project",
        description: "Complete e-commerce website development",
        amount: "75.0",
        status: "active",
        creatorAddress: sampleUser.address,
        counterpartyAddress: "9kL2mN3pQ4rS1tU2vW5xY8zA0bC1dE2fG3hI4jK5lM6",
        releaseConditions: JSON.stringify({ milestones: ["Design", "Development", "Testing"] }),
        eventDate: new Date("2024-02-01T00:00:00Z"),
        createdAt: new Date("2024-01-10T09:00:00Z"),
        updatedAt: new Date("2024-01-10T09:00:00Z"),
      },
    ];

    sampleEscrows.forEach(escrow => {
      this.escrows.set(escrow.escrowId, escrow);
    });

    // Create sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: this.transactionIdCounter++,
        escrowId: "ESC042",
        transactionHash: "5KJhG9mN2pL8qR1sT3uV6wX9yZ0aB2cD4eF5gH6iJ7kL8nM1pQ3rS4tU5vW6xY7zA8bC9dE0fG1hI2jK3lM4nN5pQ6",
        type: "release",
        amount: "25.0",
        fromAddress: "contract_address",
        toAddress: sampleUser.address,
        status: "completed",
        createdAt: new Date("2024-01-15T20:00:00Z"),
      },
      {
        id: this.transactionIdCounter++,
        escrowId: "ESC041",
        transactionHash: "7yZ0aB2cD4eF5gH6iJ7kL8nM1pQ3rS4tU5vW6xY9zA8bC1dE2fG3hI4jK5lM6nN7pQ8rS9tU0vW1xY2zA3bC4dE5fG6",
        type: "release",
        amount: "150.0",
        fromAddress: "contract_address",
        toAddress: sampleUser.address,
        status: "completed",
        createdAt: new Date("2024-01-12T16:45:00Z"),
      },
    ];

    sampleTransactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });
  }

  async getUser(address: string): Promise<User | undefined> {
    return this.users.get(address);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      username: insertUser.username || null,
      totalEscrows: insertUser.totalEscrows || null,
      totalVolume: insertUser.totalVolume || null,
      successRate: insertUser.successRate || null,
      id: this.userIdCounter++,
      createdAt: new Date(),
    };
    this.users.set(user.address, user);
    return user;
  }

  async updateUser(address: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(address);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(address, updatedUser);
    return updatedUser;
  }

  async getEscrow(escrowId: string): Promise<Escrow | undefined> {
    return this.escrows.get(escrowId);
  }

  async createEscrow(insertEscrow: InsertEscrow): Promise<Escrow> {
    const escrow: Escrow = {
      ...insertEscrow,
      description: insertEscrow.description || null,
      status: insertEscrow.status || "pending",
      counterpartyAddress: insertEscrow.counterpartyAddress || null,
      releaseConditions: insertEscrow.releaseConditions || null,
      eventDate: insertEscrow.eventDate || null,
      id: this.escrowIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.escrows.set(escrow.escrowId, escrow);
    return escrow;
  }

  async updateEscrow(escrowId: string, updates: Partial<Escrow>): Promise<Escrow | undefined> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) return undefined;

    const updatedEscrow = { ...escrow, ...updates, updatedAt: new Date() };
    this.escrows.set(escrowId, updatedEscrow);
    return updatedEscrow;
  }

  async getUserEscrows(userAddress: string): Promise<Escrow[]> {
    return Array.from(this.escrows.values()).filter(
      escrow => escrow.creatorAddress === userAddress || escrow.counterpartyAddress === userAddress
    );
  }

  async getActiveEscrows(userAddress: string): Promise<Escrow[]> {
    return Array.from(this.escrows.values()).filter(
      escrow => 
        (escrow.creatorAddress === userAddress || escrow.counterpartyAddress === userAddress) &&
        (escrow.status === "pending" || escrow.status === "active")
    );
  }

  async getAllEscrows(): Promise<Escrow[]> {
    return Array.from(this.escrows.values());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTransaction,
      id: this.transactionIdCounter++,
      createdAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getEscrowTransactions(escrowId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.escrowId === escrowId
    );
  }

  async getUserTransactions(userAddress: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.fromAddress === userAddress || transaction.toAddress === userAddress
    );
  }
}

export const storage = new MemStorage();
