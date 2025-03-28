import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  FaFireAlt, 
  FaDragon, 
  FaFootballBall, 
  FaChessKnight,
  FaGhost,
  FaUsers,
  FaCar,
  FaGamepad
} from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { Category, Platform } from "@shared/schema";

// Map category icons to React components
const categoryIcons: Record<string, React.ReactNode> = {
  "fire-alt": <FaFireAlt className="text-highlight mr-2" />,
  "dragon": <FaDragon className="text-highlight mr-2" />,
  "football-ball": <FaFootballBall className="text-highlight mr-2" />,
  "chess-knight": <FaChessKnight className="text-highlight mr-2" />,
  "ghost": <FaGhost className="text-highlight mr-2" />,
  "users": <FaUsers className="text-highlight mr-2" />,
  "car": <FaCar className="text-highlight mr-2" />,
  "gamepad": <FaGamepad className="text-highlight mr-2" />
};

export default function Sidebar() {
  const [location] = useLocation();
  const [priceRange, setPriceRange] = useState([0]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch platforms
  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const handlePlatformChange = (platformId: number) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <aside className="hidden md:block w-60 bg-primary-light p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-6">
        <h3 className="font-rajdhani font-bold text-lg mb-2 text-white">Categorías</h3>
        <ul className="space-y-1">
          {categories.map(category => (
            <li key={category.id}>
              <Link href={`/category/${category.id}`}>
                <a className={`flex items-center text-gray-300 hover:text-white p-2 rounded hover:bg-primary ${
                  location === `/category/${category.id}` ? 'bg-primary text-white' : ''
                }`}>
                  {category.icon && categoryIcons[category.icon]}
                  {category.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="font-rajdhani font-bold text-lg mb-2 text-white">Filtros</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-gray-400 text-sm mb-1">Precio</h4>
            <Slider
              defaultValue={[0]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>€0</span>
              <span>€{priceRange[0]}</span>
              <span>€100</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-400 text-sm mb-1">Plataforma</h4>
            <div className="space-y-1">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center space-x-2 text-gray-300">
                  <Checkbox 
                    id={`platform-${platform.id}`} 
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformChange(platform.id)}
                  />
                  <Label htmlFor={`platform-${platform.id}`} className="text-gray-300 cursor-pointer">
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-400 text-sm mb-1">Valoración</h4>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-yellow-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-gray-300 text-sm">o más</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-rajdhani font-bold text-lg mb-2 text-white">Ofertas especiales</h3>
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">¡Ofertas de verano!</p>
          <p className="text-gray-200 text-sm">Hasta 85% de descuento</p>
          <Link href="/category/offers">
            <button className="mt-2 bg-white text-purple-800 font-bold py-1 px-3 rounded-md text-sm hover:bg-gray-100">
              Ver ofertas
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
