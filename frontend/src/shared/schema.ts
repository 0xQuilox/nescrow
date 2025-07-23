import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const escrows = pgTable("escrows", {
  id: serial("id").primaryKey(),
  escrowId: text("escrow_id").notNull().unique(),
  type: text("type").notNull(), // 'sports', 'marketplace', 'freelance', 'custom'
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 18, scale: 9 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'active', 'completed', 'cancelled', 'disputed'
  creatorAddress: text("creator_address").notNull(),
  counterpartyAddress: text("counterparty_address"),
  releaseConditions: text("release_conditions"), // JSON string
  eventDate: timestamp("event_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  escrowId: text("escrow_id").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  type: text("type").notNull(), // 'create', 'release', 'cancel', 'dispute'
  amount: decimal("amount", { precision: 18, scale: 9 }).notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  status: text("status").notNull(), // 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  username: text("username"),
  totalEscrows: integer("total_escrows").default(0),
  totalVolume: decimal("total_volume", { precision: 18, scale: 9 }).default("0"),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEscrowSchema = createInsertSchema(escrows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertEscrow = z.infer<typeof insertEscrowSchema>;
export type Escrow = typeof escrows.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
