import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEscrowSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user dashboard stats
  app.get("/api/users/:address/stats", async (req, res) => {
    try {
      const { address } = req.params;
      const user = await storage.getUser(address);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const activeEscrows = await storage.getActiveEscrows(address);
      const allEscrows = await storage.getUserEscrows(address);
      const completedEscrows = allEscrows.filter(e => e.status === "completed");

      const stats = {
        activeEscrows: activeEscrows.length,
        totalVolume: user.totalVolume,
        completed: completedEscrows.length,
        successRate: user.successRate,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get active escrows for user
  app.get("/api/users/:address/escrows/active", async (req, res) => {
    try {
      const { address } = req.params;
      const activeEscrows = await storage.getActiveEscrows(address);
      res.json(activeEscrows);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get transaction history for user
  app.get("/api/users/:address/transactions", async (req, res) => {
    try {
      const { address } = req.params;
      const transactions = await storage.getUserTransactions(address);
      
      // Get escrow details for each transaction
      const transactionsWithEscrows = await Promise.all(
        transactions.map(async (transaction) => {
          const escrow = await storage.getEscrow(transaction.escrowId);
          return {
            ...transaction,
            escrow,
          };
        })
      );

      res.json(transactionsWithEscrows);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new escrow
  app.post("/api/escrows", async (req, res) => {
    try {
      const escrowData = insertEscrowSchema.parse(req.body);
      const escrow = await storage.createEscrow(escrowData);
      res.status(201).json(escrow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid escrow data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get escrow details
  app.get("/api/escrows/:escrowId", async (req, res) => {
    try {
      const { escrowId } = req.params;
      const escrow = await storage.getEscrow(escrowId);
      
      if (!escrow) {
        return res.status(404).json({ message: "Escrow not found" });
      }

      res.json(escrow);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update escrow status
  app.patch("/api/escrows/:escrowId", async (req, res) => {
    try {
      const { escrowId } = req.params;
      const updates = req.body;
      
      const updatedEscrow = await storage.updateEscrow(escrowId, updates);
      
      if (!updatedEscrow) {
        return res.status(404).json({ message: "Escrow not found" });
      }

      res.json(updatedEscrow);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get escrow transactions
  app.get("/api/escrows/:escrowId/transactions", async (req, res) => {
    try {
      const { escrowId } = req.params;
      const transactions = await storage.getEscrowTransactions(escrowId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
