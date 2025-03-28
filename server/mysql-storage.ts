import mysql from 'mysql2/promise';
import { IStorage, GenericGame, GenericCartItemWithGame, GenericOrderWithItems } from './storage';
import {
  User, InsertUser,
  Game, InsertGame,
  Category, InsertCategory,
  Platform, InsertPlatform,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  CartItemWithGame,
  OrderWithItems
} from '@shared/schema';
import {
  convertGameToGeneric,
  convertGamesToGeneric,
  convertCartItemsWithGameToGeneric,
  convertOrderWithItemsToGeneric
} from './mysql-converters';

export class MySQLStorage implements IStorage {
  private pool: mysql.Pool;

  constructor(connectionString: string) {
    this.pool = mysql.createPool(connectionString);
  }

  async initializeDatabase() {
    try {
      // Use the raw connection to set up tables if they don't exist
      const createTables = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        // Categories table
        `CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          icon VARCHAR(255)
        )`,
        // Platforms table
        `CREATE TABLE IF NOT EXISTS platforms (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )`,
        // Games table
        `CREATE TABLE IF NOT EXISTS games (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DOUBLE NOT NULL,
          discounted_price DOUBLE,
          image_url TEXT NOT NULL,
          rating DOUBLE,
          category_id INT NOT NULL,
          is_featured BOOLEAN DEFAULT FALSE,
          is_new_release BOOLEAN DEFAULT FALSE,
          is_top_rated BOOLEAN DEFAULT FALSE,
          platforms JSON NOT NULL,
          release_date TIMESTAMP
        )`,
        // Cart items table
        `CREATE TABLE IF NOT EXISTS cart_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          game_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1
        )`,
        // Orders table
        `CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          total DOUBLE NOT NULL,
          status VARCHAR(255) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        // Order items table
        `CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          game_id INT NOT NULL,
          quantity INT NOT NULL,
          price DOUBLE NOT NULL
        )`
      ];

      const connection = await this.pool.getConnection();
      try {
        for (const query of createTables) {
          await connection.query(query);
        }
        console.log('Database tables created or already exist.');
        return true;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error initializing database tables:', error);
      return false;
    }
  }

  async initializeWithSampleData() {
    // Initialize categories
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

    // Initialize platforms
    const platforms = ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox One", "Nintendo Switch"];
    for (const platform of platforms) {
      await this.createPlatform({ name: platform });
    }

    // Initialize sample games
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
      }
    ];

    for (const game of games) {
      await this.createGame(game);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    const users = rows as User[];
    return users.length ? users[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    const users = rows as User[];
    return users.length ? users[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    const users = rows as User[];
    return users.length ? users[0] : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [result] = await this.pool.query(
        'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)',
        [userData.username, userData.password, userData.email, userData.name]
    );
    const insertResult = result as mysql.ResultSetHeader;
    const userId = insertResult.insertId;
    return this.getUser(userId) as Promise<User>;
  }

  // Game operations
  async getGames(): Promise<GenericGame[]> {
    const [rows] = await this.pool.query('SELECT * FROM games');
    const games = rows as Game[];
    return convertGamesToGeneric(games);
  }

  async getGame(id: number): Promise<GenericGame | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM games WHERE id = ?',
        [id]
    );
    const games = rows as Game[];
    if (!games.length) return undefined;
    return convertGameToGeneric(games[0]);
  }

  async getGamesByCategory(categoryId: number): Promise<GenericGame[]> {
    const [rows] = await this.pool.query(
        'SELECT * FROM games WHERE category_id = ?',
        [categoryId]
    );
    const games = rows as Game[];
    return convertGamesToGeneric(games);
  }

  async getFeaturedGames(): Promise<GenericGame[]> {
    const [rows] = await this.pool.query(
        'SELECT * FROM games WHERE is_featured = TRUE'
    );
    const games = rows as Game[];
    return convertGamesToGeneric(games);
  }

  async getNewReleases(): Promise<GenericGame[]> {
    const [rows] = await this.pool.query(
        'SELECT * FROM games WHERE is_new_release = TRUE'
    );
    const games = rows as Game[];
    return convertGamesToGeneric(games);
  }

  async getTopRatedGames(): Promise<GenericGame[]> {
    const [rows] = await this.pool.query(
        'SELECT * FROM games WHERE is_top_rated = TRUE'
    );
    const games = rows as Game[];
    return convertGamesToGeneric(games);
  }

  async searchGames(query: string): Promise<GenericGame[]> {
    const searchQuery = `%${query}%`;
    const [rows] = await this.pool.query(
        'SELECT * FROM games WHERE title LIKE ? OR description LIKE ?',
        [searchQuery, searchQuery]
    );
    const games = rows as Game[];
    return convertGamesToGeneric(games);
  }

  async createGame(gameData: InsertGame): Promise<GenericGame> {
    const platformsJson = JSON.stringify(gameData.platforms);
    const [result] = await this.pool.query(
        `INSERT INTO games (
        title, description, price, discounted_price, image_url, 
        rating, category_id, is_featured, is_new_release, 
        is_top_rated, platforms, release_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          gameData.title, gameData.description, gameData.price,
          gameData.discountedPrice, gameData.imageUrl, gameData.rating,
          gameData.categoryId, gameData.isFeatured, gameData.isNewRelease,
          gameData.isTopRated, platformsJson, gameData.releaseDate
        ]
    );
    const insertResult = result as mysql.ResultSetHeader;
    const gameId = insertResult.insertId;
    const game = await this.getGame(gameId);
    return game as GenericGame;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    const [rows] = await this.pool.query('SELECT * FROM categories');
    return rows as Category[];
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM categories WHERE id = ?',
        [id]
    );
    const categories = rows as Category[];
    return categories.length ? categories[0] : undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [result] = await this.pool.query(
        'INSERT INTO categories (name, icon) VALUES (?, ?)',
        [categoryData.name, categoryData.icon]
    );
    const insertResult = result as mysql.ResultSetHeader;
    const categoryId = insertResult.insertId;
    return this.getCategory(categoryId) as Promise<Category>;
  }

  // Platform operations
  async getPlatforms(): Promise<Platform[]> {
    const [rows] = await this.pool.query('SELECT * FROM platforms');
    return rows as Platform[];
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM platforms WHERE id = ?',
        [id]
    );
    const platforms = rows as Platform[];
    return platforms.length ? platforms[0] : undefined;
  }

  async createPlatform(platformData: InsertPlatform): Promise<Platform> {
    const [result] = await this.pool.query(
        'INSERT INTO platforms (name) VALUES (?)',
        [platformData.name]
    );
    const insertResult = result as mysql.ResultSetHeader;
    const platformId = insertResult.insertId;
    return this.getPlatform(platformId) as Promise<Platform>;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<GenericCartItemWithGame[]> {
    const [rows] = await this.pool.query(
        'SELECT * FROM cart_items WHERE user_id = ?',
        [userId]
    );
    const cartItems = rows as CartItem[];

    const result: CartItemWithGame[] = [];
    for (const item of cartItems) {
      const [gameRows] = await this.pool.query(
          'SELECT * FROM games WHERE id = ?',
          [item.gameId]
      );
      const games = gameRows as Game[];
      if (games.length) {
        result.push({
          ...item,
          game: games[0]
        });
      }
    }

    return convertCartItemsWithGameToGeneric(result);
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    const [rows] = await this.pool.query(
        'SELECT * FROM cart_items WHERE id = ?',
        [id]
    );
    const cartItems = rows as CartItem[];
    return cartItems.length ? cartItems[0] : undefined;
  }

  async createCartItem(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists for this user and game
    const [existingRows] = await this.pool.query(
        'SELECT * FROM cart_items WHERE user_id = ? AND game_id = ?',
        [cartItemData.userId, cartItemData.gameId]
    );
    const existingItems = existingRows as CartItem[];

    if (existingItems.length > 0) {
      // Update quantity
      const existingItem = existingItems[0];
      const newQuantity = existingItem.quantity + (cartItemData.quantity || 1);

      await this.pool.query(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQuantity, existingItem.id]
      );

      return this.getCartItem(existingItem.id) as Promise<CartItem>;
    }

    // Create new item
    const [result] = await this.pool.query(
        'INSERT INTO cart_items (user_id, game_id, quantity) VALUES (?, ?, ?)',
        [cartItemData.userId, cartItemData.gameId, cartItemData.quantity || 1]
    );
    const insertResult = result as mysql.ResultSetHeader;
    const cartItemId = insertResult.insertId;
    return this.getCartItem(cartItemId) as Promise<CartItem>;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    await this.pool.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [quantity, id]
    );

    return this.getCartItem(id);
  }

  async removeCartItem(id: number): Promise<boolean> {
    const [result] = await this.pool.query(
        'DELETE FROM cart_items WHERE id = ?',
        [id]
    );
    const deleteResult = result as mysql.ResultSetHeader;
    return deleteResult.affectedRows > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const [result] = await this.pool.query(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId]
    );
    const deleteResult = result as mysql.ResultSetHeader;
    return deleteResult.affectedRows > 0;
  }

  // Order operations
  async createOrder(orderData: InsertOrder, orderItemsData: InsertOrderItem[]): Promise<Order> {
    try {
      // Start a transaction
      const connection = await this.pool.getConnection();
      await connection.beginTransaction();

      try {
        // Create order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
            [orderData.userId, orderData.total, orderData.status]
        );
        const orderInsertResult = orderResult as mysql.ResultSetHeader;
        const orderId = orderInsertResult.insertId;

        // Create order items
        for (const item of orderItemsData) {
          await connection.query(
              'INSERT INTO order_items (order_id, game_id, quantity, price) VALUES (?, ?, ?, ?)',
              [orderId, item.gameId, item.quantity, item.price]
          );
        }

        // Commit transaction
        await connection.commit();

        // Get the created order
        const [orderRows] = await connection.query(
            'SELECT * FROM orders WHERE id = ?',
            [orderId]
        );
        const orders = orderRows as Order[];

        connection.release();
        return orders[0];
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrders(userId: number): Promise<Order[]> {
    const [rows] = await this.pool.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows as Order[];
  }

  async getOrder(id: number): Promise<GenericOrderWithItems | undefined> {
    const [orderRows] = await this.pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [id]
    );
    const orders = orderRows as Order[];
    if (!orders.length) return undefined;

    const order = orders[0];

    // Get order items
    const [itemRows] = await this.pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [id]
    );
    const orderItems = itemRows as OrderItem[];

    // Get games for order items
    const items = [];
    for (const item of orderItems) {
      const [gameRows] = await this.pool.query(
          'SELECT * FROM games WHERE id = ?',
          [item.gameId]
      );
      const games = gameRows as Game[];
      if (games.length) {
        items.push({
          ...item,
          game: games[0]
        });
      }
    }

    return convertOrderWithItemsToGeneric({
      ...order,
      items
    } as OrderWithItems);
  }

  // Clean up method
  async close() {
    await this.pool.end();
  }
}