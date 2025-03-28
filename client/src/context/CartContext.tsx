import { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Game, CartItem, CartItemWithGame } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CartContextProps {
  cartItems: CartItemWithGame[];
  isCartOpen: boolean;
  toggleCartOpen: () => void;
  addToCart: (game: Game) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  isCartOpen: false,
  toggleCartOpen: () => {},
  addToCart: () => {},
  updateCartItemQuantity: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItemWithGame[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/status", {
          credentials: "include",
        });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuth();
  }, []);

  // Load cart items when authenticated
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated) return;
      
      try {
        const res = await fetch("/api/cart", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los items del carrito",
          variant: "destructive",
        });
      }
    };

    fetchCartItems();
  }, [isAuthenticated, toast]);

  const toggleCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };

  const addToCart = async (game: Game) => {
    if (!isAuthenticated) {
      // If not authenticated, store in local cart but prompt login
      const newItem: CartItemWithGame = {
        id: Date.now(), // Temporary ID
        userId: 0,
        gameId: game.id,
        quantity: 1,
        game,
      };
      
      setCartItems(prev => {
        const existingItem = prev.find(item => item.gameId === game.id);
        if (existingItem) {
          return prev.map(item => 
            item.gameId === game.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        return [...prev, newItem];
      });
      
      toast({
        title: "Iniciar sesión",
        description: "Para guardar tu carrito, inicia sesión o regístrate",
        variant: "default",
      });
      return;
    }

    try {
      // Send to server if authenticated
      const res = await apiRequest("POST", "/api/cart", {
        gameId: game.id,
        quantity: 1,
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Update local cart state
        setCartItems(prev => {
          const existingItem = prev.find(item => item.gameId === game.id);
          if (existingItem) {
            return prev.map(item => 
              item.gameId === game.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
          }
          return [...prev, {...data, game}];
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir al carrito",
        variant: "destructive",
      });
    }
  };

  const updateCartItemQuantity = async (id: number, quantity: number) => {
    if (!isAuthenticated) {
      // Update local cart if not authenticated
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
      return;
    }

    try {
      // Update on server if authenticated
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      
      if (res.ok) {
        setCartItems(prev => prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        ));
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      });
    }
  };

  const removeCartItem = async (id: number) => {
    if (!isAuthenticated) {
      // Remove from local cart if not authenticated
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }

    try {
      // Remove from server if authenticated
      const res = await apiRequest("DELETE", `/api/cart/${id}`, undefined);
      
      if (res.status === 204) {
        setCartItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el item del carrito",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      // Clear local cart if not authenticated
      setCartItems([]);
      return;
    }

    try {
      // Clear cart on server if authenticated
      const res = await apiRequest("DELETE", "/api/cart", undefined);
      
      if (res.status === 204) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive",
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.game.discountedPrice || item.game.price;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        toggleCartOpen,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
