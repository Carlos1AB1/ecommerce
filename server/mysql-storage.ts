import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, desc, ilike, or, sql } from 'drizzle-orm';
import { IStorage, GenericGame, GenericCartItemWithGame, GenericOrderWithItems } from './storage';
import {
  users, games, categories, platforms, cartItems, orders, orderItems,
  type User, type InsertUser,
  type Game, type InsertGame,
  type Category, type InsertCategory,
  type Platform, type InsertPlatform,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type CartItemWithGame,
  type OrderWithItems
} from '@shared/schema';
import {
  convertGameToGeneric,
  convertGamesToGeneric,
  convertCartItemsWithGameToGeneric,
  convertOrderWithItemsToGeneric
} from './mysql-converters';

export class MySQLStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool);
  }

  async initializeDatabase() {
    try {
      console.log('Las tablas ya han sido creadas utilizando drizzle-kit push.');
      return true;
    } catch (error) {
      console.error('Error al verificar las tablas:', error);
      return false;
    }
  }

  async initializeWithSampleData() {
    // Inicializar categorías de ejemplo
    const categories = [
      { name: "Acción", icon: "fire-alt" },
      { name: "Aventura", icon: "dragon" },
      { name: "Deportes", icon: "football-ball" },
      { name: "Estrategia", icon: "chess-knight" },
      { name: "Horror", icon: "ghost" },
      { name: "Multijugador", icon: "users" },
      { name: "Carreras", icon: "car" },
      { name: "Indie", icon: "gamepad" }
    ];
    
    for (const cat of categories) {
      await this.createCategory(cat);
    }
    
    // Inicializar plataformas de ejemplo
    const platforms = ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox One", "Nintendo Switch"];
    for (const platform of platforms) {
      await this.createPlatform({ name: platform });
    }
    
    // Inicializar juegos de ejemplo
    const games = [
      {
        title: "Starfield",
        description: "Explora el cosmos en esta nueva aventura épica de Bethesda",
        price: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1581675907488-1e5aeeb6d310?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
        rating: 4.5,
        categoryId: 2,
        isFeatured: true,
        isNewRelease: true,
        isTopRated: false,
        platforms: [1, 2, 4],
        releaseDate: new Date()
      },
      {
        title: "Horizon Forbidden West",
        description: "Continúa la aventura de Aloy en este impresionante mundo post-apocalíptico",
        price: 59.99,
        discountedPrice: 44.99,
        imageUrl: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 4.5,
        categoryId: 2,
        isFeatured: false,
        isNewRelease: true,
        isTopRated: false,
        platforms: [2, 3],
        releaseDate: new Date()
      },
      {
        title: "God of War Ragnarök",
        description: "Embárcate en un viaje épico mientras Kratos y Atreus se preparan para el Ragnarök",
        price: 69.99,
        imageUrl: "https://images.unsplash.com/photo-1621364090537-a213ada1de19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 5.0,
        categoryId: 1,
        isFeatured: false,
        isNewRelease: true,
        isTopRated: true,
        platforms: [2],
        releaseDate: new Date()
      },
      // Otros juegos de ejemplo...
    ];
    
    for (const game of games) {
      await this.createGame(game);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(userData).returning();
    const userId = result[0].id;
    return this.getUser(userId) as Promise<User>;
  }

  // Game operations
  async getGames(): Promise<GenericGame[]> {
    const gamesResult = await this.db.select().from(games);
    return convertGamesToGeneric(gamesResult);
  }

  async getGame(id: number): Promise<GenericGame | undefined> {
    const result = await this.db.select().from(games).where(eq(games.id, id)).limit(1);
    if (!result[0]) return undefined;
    return convertGameToGeneric(result[0]);
  }

  async getGamesByCategory(categoryId: number): Promise<GenericGame[]> {
    const gamesResult = await this.db.select().from(games).where(eq(games.categoryId, categoryId));
    return convertGamesToGeneric(gamesResult);
  }

  async getFeaturedGames(): Promise<GenericGame[]> {
    const gamesResult = await this.db.select().from(games).where(eq(games.isFeatured, true));
    return convertGamesToGeneric(gamesResult);
  }

  async getNewReleases(): Promise<GenericGame[]> {
    const gamesResult = await this.db.select().from(games).where(eq(games.isNewRelease, true));
    return convertGamesToGeneric(gamesResult);
  }

  async getTopRatedGames(): Promise<GenericGame[]> {
    const gamesResult = await this.db.select().from(games).where(eq(games.isTopRated, true));
    return convertGamesToGeneric(gamesResult);
  }

  async searchGames(query: string): Promise<GenericGame[]> {
    const searchPattern = `%${query}%`;
    const gamesResult = await this.db.select().from(games).where(
      or(
        ilike(games.title, searchPattern),
        ilike(games.description, searchPattern)
      )
    );
    return convertGamesToGeneric(gamesResult);
  }

  async createGame(gameData: InsertGame): Promise<GenericGame> {
    const result = await this.db.insert(games).values(gameData).returning();
    const gameId = result[0].id;
    const game = await this.getGame(gameId);
    return game as GenericGame;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return this.db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const result = await this.db.insert(categories).values(categoryData).returning();
    const categoryId = result[0].id;
    return this.getCategory(categoryId) as Promise<Category>;
  }

  // Platform operations
  async getPlatforms(): Promise<Platform[]> {
    return this.db.select().from(platforms);
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    const result = await this.db.select().from(platforms).where(eq(platforms.id, id)).limit(1);
    return result[0];
  }

  async createPlatform(platformData: InsertPlatform): Promise<Platform> {
    const result = await this.db.insert(platforms).values(platformData).returning();
    const platformId = result[0].id;
    return this.getPlatform(platformId) as Promise<Platform>;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<GenericCartItemWithGame[]> {
    const items = await this.db.select().from(cartItems).where(eq(cartItems.userId, userId));
    
    const result: CartItemWithGame[] = [];
    for (const item of items) {
      const game = await this.db.select().from(games).where(eq(games.id, item.gameId)).limit(1);
      if (game[0]) {
        result.push({
          ...item,
          game: game[0]
        });
      }
    }
    
    return convertCartItemsWithGameToGeneric(result);
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    const result = await this.db.select().from(cartItems).where(eq(cartItems.id, id)).limit(1);
    return result[0];
  }

  async createCartItem(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists for this user and game
    const existingItems = await this.db.select().from(cartItems).where(
      and(
        eq(cartItems.userId, cartItemData.userId),
        eq(cartItems.gameId, cartItemData.gameId)
      )
    ).limit(1);
    
    if (existingItems.length > 0) {
      // Update quantity
      const existingItem = existingItems[0];
      const newQuantity = existingItem.quantity + (cartItemData.quantity || 1);
      
      await this.db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
      
      return this.getCartItem(existingItem.id) as Promise<CartItem>;
    }
    
    // Create new item
    const result = await this.db.insert(cartItems).values(cartItemData).returning();
    const cartItemId = result[0].id;
    return this.getCartItem(cartItemId) as Promise<CartItem>;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    await this.db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id));
    
    return this.getCartItem(id);
  }

  async removeCartItem(id: number): Promise<boolean> {
    await this.db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }

  async clearCart(userId: number): Promise<boolean> {
    await this.db.delete(cartItems).where(eq(cartItems.userId, userId));
    return true;
  }

  // Order operations
  async createOrder(orderData: InsertOrder, orderItemsData: InsertOrderItem[]): Promise<Order> {
    try {
      // Crear orden con returning para obtener el ID
      const orderResult = await this.db.insert(orders).values(orderData).returning();
      
      const orderId = orderResult[0].id;
      
      // Crear items de orden
      for (const item of orderItemsData) {
        const orderItemWithId = { ...item, orderId };
        await this.db.insert(orderItems).values(orderItemWithId);
      }
      
      // Devolver la orden creada
      const order = await this.getOrder(orderId);
      return order as unknown as Order;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  }

  async getOrders(userId: number): Promise<Order[]> {
    return this.db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<GenericOrderWithItems | undefined> {
    const orderResult = await this.db.select().from(orders).where(eq(orders.id, id)).limit(1);
    const order = orderResult[0];
    
    if (!order) return undefined;
    
    const orderItemsResult = await this.db.select().from(orderItems).where(eq(orderItems.orderId, id));
    const items = [];
    
    for (const item of orderItemsResult) {
      const gameResult = await this.db.select().from(games).where(eq(games.id, item.gameId)).limit(1);
      if (gameResult[0]) {
        items.push({
          ...item,
          game: gameResult[0]
        });
      }
    }
    
    const result = {
      ...order,
      items
    };
    
    return convertOrderWithItemsToGeneric(result as OrderWithItems);
  }

  // Método para cerrar la conexión a la base de datos
  async close() {
    await this.pool.end();
  }
}

// Las funciones auxiliares se eliminen ya que ahora usamos las importadas directamente de drizzle-orm