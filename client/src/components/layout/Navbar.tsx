import { useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { FaGamepad, FaSearch, FaShoppingCart, FaUser, FaChevronDown } from "react-icons/fa";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CartPanel from "@/components/cart/CartPanel";
import AuthModal from "@/components/auth/AuthModal";
import SearchBar from "@/components/search/SearchBar";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { cartItems, toggleCartOpen } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <nav className="bg-primary-light px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <FaGamepad className="text-accent text-2xl mr-2" />
              <span className="font-rajdhani font-bold text-2xl text-white">GameVault</span>
            </a>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleCartOpen} 
            className="relative p-2"
            aria-label="Shopping cart"
          >
            <FaShoppingCart className="text-xl text-gray-300 hover:text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-xs text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" alt="User avatar" />
                    <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-gray-300">{user?.username || "Usuario"}</span>
                  <FaChevronDown className="text-xs text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-primary-light rounded-lg shadow-xl py-2">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="flex items-center px-4 py-2 text-gray-300 hover:bg-primary hover:text-white cursor-pointer">
                      <FaUser className="mr-2" />
                      Mi perfil
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <a className="flex items-center px-4 py-2 text-gray-300 hover:bg-primary hover:text-white cursor-pointer">
                      <FaShoppingCart className="mr-2" />
                      Historial de compras
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-primary hover:text-white cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm2 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-1"
            >
              <FaUser className="text-gray-300" />
              <span className="hidden md:inline text-gray-300">Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden mt-3">
        <SearchBar />
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
      
      {/* Cart Panel */}
      <CartPanel />
    </nav>
  );
}
