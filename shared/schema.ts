import {
  mysqlTable,
  text,
  int,
  varchar,
  double,
  boolean,
  timestamp,
  json as mysqlJson,
  primaryKey,
  uniqueIndex
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true
});

export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 })
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true
});

export const platforms = mysqlTable("platforms", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull()
});

export const insertPlatformSchema = createInsertSchema(platforms).pick({
  name: true
});

export const games = mysqlTable("games", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: double("price").notNull(),
  discountedPrice: double("discounted_price"),
  imageUrl: text("image_url").notNull(),
  rating: double("rating"),
  categoryId: int("category_id").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isNewRelease: boolean("is_new_release").default(false),
  isTopRated: boolean("is_top_rated").default(false),
  platforms: mysqlJson("platforms").notNull().$type<number[]>(),
  releaseDate: timestamp("release_date")
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  description: true,
  price: true,
  discountedPrice: true,
  imageUrl: true,
  rating: true,
  categoryId: true,
  isFeatured: true,
  isNewRelease: true,
  isTopRated: true,
  platforms: true,
  releaseDate: true
});

export const cartItems = mysqlTable("cart_items", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  gameId: int("game_id").notNull(),
  quantity: int("quantity").notNull().default(1)
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  gameId: true,
  quantity: true
});

export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  total: double("total").notNull(),
  status: varchar("status", { length: 255 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  status: true
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull(),
  gameId: int("game_id").notNull(),
  quantity: int("quantity").notNull(),
  price: double("price").notNull()
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  gameId: true,
  quantity: true,
  price: true
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Extended types for frontend use
export type CartItemWithGame = CartItem & {
  game: Game;
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    game: Game;
  })[];
};