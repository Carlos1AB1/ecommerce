import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { IStorage } from "./storage";
import { getMySQLStorage } from "./mysql-config";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  type InsertOrderItem
} from "@shared/mysql-schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

const Session = MemoryStore(session);

export async function registerRoutes(app: Express, customStorage?: IStorage): Promise<Server> {
  // Usar el almacenamiento proporcionado o el por defecto
  const storageToUse = customStorage || getMySQLStorage();
  
  // Setup session and passport
  setupAuth(app, storageToUse);

  // Games routes
  app.get("/api/games", async (req, res) => {
    const games = await storageToUse.getGames();
    res.json(games);
  });

  app.get("/api/games/featured", async (req, res) => {
    const games = await storageToUse.getFeaturedGames();
    res.json(games);
  });

  app.get("/api/games/new-releases", async (req, res) => {
    const games = await storageToUse.getNewReleases();
    res.json(games);
  });

  app.get("/api/games/top-rated", async (req, res) => {
    const games = await storageToUse.getTopRatedGames();
    res.json(games);
  });

  app.get("/api/games/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const games = await storageToUse.searchGames(query);
    res.json(games);
  });

  app.get("/api/games/category/:categoryId", async (req, res) => {
    const categoryId = parseInt(req.params.categoryId, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const games = await storageToUse.getGamesByCategory(categoryId);
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }
    
    const game = await storageToUse.getGame(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    res.json(game);
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storageToUse.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const category = await storageToUse.getCategory(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });

  // Platforms routes
  app.get("/api/platforms", async (req, res) => {
    const platforms = await storageToUse.getPlatforms();
    res.json(platforms);
  });

  // Cart routes
  app.get("/api/cart", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const items = await storageToUse.getCartItems(userId);
    res.json(items);
  });

  app.post("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      
      const item = await storageToUse.createCartItem(cartItemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }
    
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }
    
    const userId = (req.user as any).id;
    const cartItem = await storageToUse.getCartItem(id);
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    if (cartItem.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to update this cart item" });
    }
    
    const updatedItem = await storageToUse.updateCartItemQuantity(id, quantity);
    res.json(updatedItem);
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }
    
    const userId = (req.user as any).id;
    const cartItem = await storageToUse.getCartItem(id);
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    if (cartItem.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to delete this cart item" });
    }
    
    await storageToUse.removeCartItem(id);
    res.status(204).end();
  });

  app.delete("/api/cart", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    await storageToUse.clearCart(userId);
    res.status(204).end();
  });

  // Orders routes
  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Validate order data
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId
      });
      
      // Verify cart items exist for this user
      const cartItems = await storageToUse.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cannot create order with empty cart" });
      }
      
      // Create order items from cart
      const orderItemsData: InsertOrderItem[] = cartItems.map(item => ({
        orderId: 0, // Will be set by the storage
        gameId: item.game.id,
        quantity: item.quantity,
        price: item.game.discountedPrice || item.game.price
      }));
      
      // Create order and items
      const order = await storageToUse.createOrder(orderData, orderItemsData);
      
      // Clear cart
      await storageToUse.clearCart(userId);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const orders = await storageToUse.getOrders(userId);
    res.json(orders);
  });

  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const userId = (req.user as any).id;
    const order = await storageToUse.getOrder(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to view this order" });
    }
    
    res.json(order);
  });

  // User profile
  app.get("/api/user/profile", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const user = await storageToUse.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Auth status
  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      const { password, ...userWithoutPassword } = req.user as any;
      res.json({ authenticated: true, user: userWithoutPassword });
    } else {
      res.json({ authenticated: false });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

function setupAuth(app: Express, storageToUse: IStorage) {
  // Configure passport
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await storageToUse.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        if (user.password !== password) { // In a real app, use proper password hashing
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storageToUse.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Session setup
  app.use(session({
    cookie: { maxAge: 86400000 },
    store: new Session({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
    secret: 'gaming_ecommerce_secret_key'
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storageToUse.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storageToUse.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storageToUse.createUser(userData);
      
      // Log in the user after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to login after registration" });
        }
        
        // Don't send password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Don't send password
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(204).end();
    });
  });
}

function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}