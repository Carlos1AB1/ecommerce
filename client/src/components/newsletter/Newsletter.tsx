import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Normally you'd send this to an API
    toast({
      title: "Suscripción exitosa",
      description: "Te has suscrito correctamente a nuestra newsletter",
      duration: 3000,
    });
    
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl p-6 mb-10">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="font-rajdhani font-bold text-2xl text-white mb-2">Mantente informado</h2>
          <p className="text-purple-200">Suscríbete para recibir las últimas noticias y ofertas especiales</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico" 
            className="px-4 py-2 rounded-l-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-accent" 
          />
          <button 
            type="submit"
            className="bg-accent hover:bg-accent-hover text-white font-medium py-2 px-6 rounded-r-lg mt-2 sm:mt-0"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </section>
  );
}
