import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Sample users table.
 *
 * This serves as the foundational schema. Additional tables
 * (e.g., projects, invoices, contacts) will be added as the
 * platform grows.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
