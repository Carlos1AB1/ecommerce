import { Link } from "wouter";
import { FaGamepad, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-primary-light py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <a className="flex items-center">
                <FaGamepad className="text-accent text-2xl mr-2" />
                <span className="font-rajdhani font-bold text-2xl text-white">GameVault</span>
              </a>
            </Link>
            <p className="text-gray-400 mt-4">
              Tu tienda de videojuegos preferida con los mejores títulos y ofertas especiales.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-rajdhani font-bold text-lg text-white mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">Inicio</a>
                </Link>
              </li>
              <li>
                <Link href="/category/offers">
                  <a className="text-gray-400 hover:text-white">Ofertas</a>
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <a className="text-gray-400 hover:text-white">Buscar</a>
                </Link>
              </li>
              <li>
                <Link href="/cart">
                  <a className="text-gray-400 hover:text-white">Carrito</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-rajdhani font-bold text-lg text-white mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/1">
                  <a className="text-gray-400 hover:text-white">Acción</a>
                </Link>
              </li>
              <li>
                <Link href="/category/2">
                  <a className="text-gray-400 hover:text-white">Aventura</a>
                </Link>
              </li>
              <li>
                <Link href="/category/4">
                  <a className="text-gray-400 hover:text-white">Estrategia</a>
                </Link>
              </li>
              <li>
                <Link href="/category/6">
                  <a className="text-gray-400 hover:text-white">Multijugador</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-rajdhani font-bold text-lg text-white mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Centro de soporte</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Preguntas frecuentes</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Política de privacidad</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Términos y condiciones</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GameVault. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
