import {
  users, type User, type InsertUser,
  games, type Game, type InsertGame,
  categories, type Category, type InsertCategory,
  platforms, type Platform, type InsertPlatform,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  type CartItemWithGame,
  type OrderWithItems
} from "@shared/schema";

// Tipo modificado para Game que acepta que platforms pueda ser null
export type GenericGame = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  imageUrl: string;
  rating: number | null;
  categoryId: number;
  isFeatured: boolean | null;
  isNewRelease: boolean | null;
  isTopRated: boolean | null;
  platforms: number[] | null;
  releaseDate: Date | null;
};

// Tipo modificado de CartItemWithGame que usa GenericGame
export type GenericCartItemWithGame = {
  id: number;
  userId: number;
  gameId: number;
  quantity: number;
  game: GenericGame;
};

// Tipo modificado para OrderWithItems que usa GenericGame
export type GenericOrderWithItems = {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: Date | null;
  items: {
    id: number;
    orderId: number;
    gameId: number;
    quantity: number;
    price: number;
    game: GenericGame;
  }[];
};

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  getGames(): Promise<GenericGame[]>;
  getGame(id: number): Promise<GenericGame | undefined>;
  getGamesByCategory(categoryId: number): Promise<GenericGame[]>;
  getFeaturedGames(): Promise<GenericGame[]>;
  getNewReleases(): Promise<GenericGame[]>;
  getTopRatedGames(): Promise<GenericGame[]>;
  searchGames(query: string): Promise<GenericGame[]>;
  createGame(game: InsertGame): Promise<GenericGame>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Platform operations
  getPlatforms(): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  
  // Cart operations
  getCartItems(userId: number): Promise<GenericCartItemWithGame[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder, orderItems: InsertOrderItem[]): Promise<Order>;
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<GenericOrderWithItems | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private categories: Map<number, Category>;
  private platforms: Map<number, Platform>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  private nextUserId: number;
  private nextGameId: number;
  private nextCategoryId: number;
  private nextPlatformId: number;
  private nextCartItemId: number;
  private nextOrderId: number;
  private nextOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.categories = new Map();
    this.platforms = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.nextUserId = 1;
    this.nextGameId = 1;
    this.nextCategoryId = 1;
    this.nextPlatformId = 1;
    this.nextCartItemId = 1;
    this.nextOrderId = 1;
    this.nextOrderItemId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create categories
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
    
    categories.forEach(cat => {
      this.createCategory({ name: cat.name, icon: cat.icon });
    });
    
    // Create platforms
    const platforms = ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox One", "Nintendo Switch"];
    platforms.forEach(platform => {
      this.createPlatform({ name: platform });
    });
    
    // Create games
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
      {
        title: "Elden Ring",
        description: "Un RPG de acción desarrollado por FromSoftware y creado en colaboración con George R. R. Martin",
        price: 59.99,
        discountedPrice: 50.99,
        imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 4.8,
        categoryId: 1,
        isFeatured: false,
        isNewRelease: true,
        isTopRated: true,
        platforms: [1, 2, 4],
        releaseDate: new Date()
      },
      {
        title: "Hogwarts Legacy",
        description: "Vive la vida de un estudiante en Hogwarts en el siglo XIX",
        price: 54.99,
        imageUrl: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 4.0,
        categoryId: 2,
        isFeatured: false,
        isNewRelease: true,
        isTopRated: false,
        platforms: [1, 2, 4],
        releaseDate: new Date()
      },
      {
        title: "Cyberpunk 2077",
        description: "Un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder y la modificación corporal",
        price: 59.99,
        discountedPrice: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 3.5,
        categoryId: 1,
        isFeatured: false,
        isNewRelease: false,
        isTopRated: false,
        platforms: [1, 2, 4],
        releaseDate: new Date("2020-12-10")
      },
      {
        title: "Red Dead Redemption 2",
        description: "Una épica historia del salvaje oeste ambientada en América en 1899",
        price: 59.99,
        discountedPrice: 23.99,
        imageUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 4.7,
        categoryId: 2,
        isFeatured: false,
        isNewRelease: false,
        isTopRated: true,
        platforms: [1, 3, 5],
        releaseDate: new Date("2018-10-26")
      },
      {
        title: "Control: Ultimate Edition",
        description: "Un juego de acción y aventura en tercera persona que combina disparos, habilidades sobrenaturales y entornos destructibles",
        price: 39.99,
        discountedPrice: 9.99,
        imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 4.0,
        categoryId: 1,
        isFeatured: false,
        isNewRelease: false,
        isTopRated: false,
        platforms: [1, 2, 4],
        releaseDate: new Date("2019-08-27")
      },
      {
        title: "The Witcher 3: Wild Hunt",
        description: "Un RPG de mundo abierto con una trama intensa y ambientado en un universo de fantasía visualmente impresionante",
        price: 49.99,
        discountedPrice: 14.99,
        imageUrl: "https://images.unsplash.com/photo-1533236897111-3e94666b2edf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 4.9,
        categoryId: 2,
        isFeatured: false,
        isNewRelease: false,
        isTopRated: true,
        platforms: [1, 2, 4],
        releaseDate: new Date("2015-05-19")
      },
      {
        title: "Baldur's Gate 3",
        description: "La esperada secuela de la legendaria serie de RPG Baldur's Gate, basada en Dungeons & Dragons",
        price: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 5.0,
        categoryId: 4,
        isFeatured: false,
        isNewRelease: false,
        isTopRated: true,
        platforms: [1, 2],
        releaseDate: new Date("2023-08-03")
      }
    ];
    
    games.forEach(game => {
      this.createGame(game);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Game operations
  async getGames(): Promise<GenericGame[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<GenericGame | undefined> {
    return this.games.get(id);
  }

  async getGamesByCategory(categoryId: number): Promise<GenericGame[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.categoryId === categoryId
    );
  }

  async getFeaturedGames(): Promise<GenericGame[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.isFeatured
    );
  }

  async getNewReleases(): Promise<GenericGame[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.isNewRelease
    );
  }

  async getTopRatedGames(): Promise<GenericGame[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.isTopRated
    );
  }

  async searchGames(query: string): Promise<GenericGame[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.games.values()).filter(
      (game) => game.title.toLowerCase().includes(lowercaseQuery) || 
                game.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createGame(insertGame: InsertGame): Promise<GenericGame> {
    const id = this.nextGameId++;
    const game: Game = { ...insertGame, id };
    this.games.set(id, game);
    return game;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.nextCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Platform operations
  async getPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.nextPlatformId++;
    const platform: Platform = { ...insertPlatform, id };
    this.platforms.set(id, platform);
    return platform;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<GenericCartItemWithGame[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );

    return items.map(item => {
      const game = this.games.get(item.gameId);
      return {
        ...item,
        game: game!
      };
    });
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists for this user and game
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.gameId === insertCartItem.gameId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    // Create new item
    const id = this.nextCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const items = Array.from(this.cartItems.values());
    for (const item of items) {
      if (item.userId === userId) {
        this.cartItems.delete(item.id);
      }
    }
    return true;
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder, orderItemsData: InsertOrderItem[]): Promise<Order> {
    const id = this.nextOrderId++;
    const now = new Date();
    const order: Order = { ...insertOrder, id, createdAt: now };
    this.orders.set(id, order);
    
    // Create order items
    for (const item of orderItemsData) {
      const orderItemId = this.nextOrderItemId++;
      const orderItem: OrderItem = { ...item, id: orderItemId, orderId: id };
      this.orderItems.set(orderItemId, orderItem);
    }
    
    return order;
  }

  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<GenericOrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = Array.from(this.orderItems.values())
      .filter((item) => item.orderId === id)
      .map(item => {
        const game = this.games.get(item.gameId)!;
        return { ...item, game };
      });
    
    return {
      ...order,
      items,
    };
  }
}

export const storage = new MemStorage();
