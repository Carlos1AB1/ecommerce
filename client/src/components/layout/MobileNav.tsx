import { Link, useLocation } from "wouter";
import { FaHome, FaSearch, FaTags, FaShoppingCart, FaUser } from "react-icons/fa";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "text-white" : "text-gray-400";
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-light py-2 px-4 border-t border-gray-800 z-40">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center ${isActive("/")} hover:text-white`}>
            <FaHome className="text-lg" />
            <span className="text-xs mt-1">Inicio</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center ${isActive("/search")} hover:text-white`}>
            <FaSearch className="text-lg" />
            <span className="text-xs mt-1">Buscar</span>
          </a>
        </Link>
        <Link href="/category/offers">
          <a className={`flex flex-col items-center ${isActive("/category/offers")} hover:text-white`}>
            <FaTags className="text-lg" />
            <span className="text-xs mt-1">Ofertas</span>
          </a>
        </Link>
        <Link href="/cart">
          <a className={`flex flex-col items-center ${isActive("/cart")} hover:text-white`}>
            <FaShoppingCart className="text-lg" />
            <span className="text-xs mt-1">Carrito</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center ${isActive("/profile")} hover:text-white`}>
            <FaUser className="text-lg" />
            <span className="text-xs mt-1">Perfil</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
