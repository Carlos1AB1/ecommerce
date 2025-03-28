import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaTimes, FaFacebookF, FaGoogle } from 'react-icons/fa';

interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthModal({ isOpen, setIsOpen }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { login, register: registerUser } = useContext(AuthContext);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      setIsOpen(false);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: (error as Error).message || "No se ha podido iniciar sesión",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      setIsOpen(false);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error de registro",
        description: (error as Error).message || "No se ha podido registrar la cuenta",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="bg-primary-light rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 font-medium ${
              activeTab === 'login' ? 'bg-primary text-white' : 'text-gray-400'
            }`}
          >
            Iniciar sesión
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 font-medium ${
              activeTab === 'register' ? 'bg-primary text-white' : 'text-gray-400'
            }`}
          >
            Registrarse
          </button>
        </div>
        
        {activeTab === 'login' ? (
          <div className="p-6">
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div className="mb-4">
                <Label htmlFor="login-username" className="block text-gray-300 mb-2">
                  Nombre de usuario
                </Label>
                <Input
                  id="login-username"
                  {...loginForm.register('username')}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {loginForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="login-password" className="block text-gray-300 mb-2">
                  Contraseña
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
                <a href="#" className="text-accent text-sm mt-1 inline-block hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-medium mb-4"
              >
                {loginForm.formState.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-700" />
              <span className="px-3 text-gray-500 text-sm">O continúa con</span>
              <hr className="flex-grow border-gray-700" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                <FaFacebookF className="mr-2" />
                Facebook
              </button>
              <button className="flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 py-2 px-4 rounded-lg">
                <FaGoogle className="mr-2 text-red-500" />
                Google
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <div className="mb-4">
                <Label htmlFor="register-name" className="block text-gray-300 mb-2">
                  Nombre completo
                </Label>
                <Input
                  id="register-name"
                  {...registerForm.register('name')}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="register-email" className="block text-gray-300 mb-2">
                  Correo electrónico
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  {...registerForm.register('email')}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="register-username" className="block text-gray-300 mb-2">
                  Nombre de usuario
                </Label>
                <Input
                  id="register-username"
                  {...registerForm.register('username')}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {registerForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="register-password" className="block text-gray-300 mb-2">
                  Contraseña
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  {...registerForm.register('password')}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">La contraseña debe tener al menos 8 caracteres</p>
              </div>
              <Button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-medium mb-4"
              >
                {registerForm.formState.isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
              <p className="text-center text-gray-500 text-sm">
                Al registrarte, aceptas nuestros{' '}
                <a href="#" className="text-accent hover:underline">
                  Términos de servicio
                </a>{' '}
                y{' '}
                <a href="#" className="text-accent hover:underline">
                  Política de privacidad
                </a>
                .
              </p>
            </form>
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}
