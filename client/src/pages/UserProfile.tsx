import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Order } from '@shared/schema';

export default function UserProfile() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');

  // Fetch user orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-primary-light">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-white mb-4">Necesitas iniciar sesión</h2>
              <p className="text-gray-400 mb-6">Inicia sesión para ver tu perfil</p>
              <Button 
                onClick={() => toast({
                  title: "Inicio de sesión",
                  description: "Se ha abierto el formulario de inicio de sesión",
                })}
                className="bg-accent hover:bg-accent-hover"
              >
                Iniciar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Tu perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card className="bg-primary-light">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" alt="User avatar" />
                <AvatarFallback className="text-2xl font-bold">{user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold text-white mb-1">{user?.name || user?.username}</h2>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              
              <div className="w-full space-y-4 mt-4">
                <Button className="w-full bg-accent hover:bg-accent-hover" asChild>
                  <Link href="/orders">
                    Ver historial de compras
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full text-gray-300 border-gray-600">
                  Editar perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-light mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">Información de cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-400">Usuario desde</dt>
                  <dd className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Nombre de usuario</dt>
                  <dd className="text-white">{user?.username || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Email</dt>
                  <dd className="text-white">{user?.email || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          <Card className="bg-primary-light">
            <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-primary grid grid-cols-3 mb-2">
                <TabsTrigger value="personal">Información personal</TabsTrigger>
                <TabsTrigger value="purchases">Compras recientes</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Información personal</h2>
                <Separator className="bg-gray-700 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-white mb-2">Perfil</h3>
                    <div className="bg-primary p-4 rounded-md">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Nombre completo:</dt>
                          <dd className="text-white">{user?.name || 'No especificado'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Usuario:</dt>
                          <dd className="text-white">{user?.username}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Email:</dt>
                          <dd className="text-white">{user?.email}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-2">Preferencias</h3>
                    <div className="bg-primary p-4 rounded-md">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Idioma:</dt>
                          <dd className="text-white">Español</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Moneda:</dt>
                          <dd className="text-white">EUR (€)</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Newsletter:</dt>
                          <dd className="text-white">Suscrito</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-white mb-2">Dirección de facturación</h3>
                  <div className="bg-primary p-4 rounded-md">
                    <p className="text-gray-400">No hay información de facturación guardada.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Añadir dirección
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Purchases Tab */}
              <TabsContent value="purchases" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Compras recientes</h2>
                <Separator className="bg-gray-700 mb-6" />

                {isOrdersLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Cargando historial de compras...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No has realizado ninguna compra todavía.</p>
                    <Button asChild className="bg-accent hover:bg-accent-hover">
                      <Link href="/">
                        Explorar juegos
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="bg-primary p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-white">Pedido #{order.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-900 text-green-300' :
                            order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-800 text-gray-300'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Fecha:</span>
                          <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total:</span>
                          <span className="text-highlight font-bold">€{order.total.toFixed(2)}</span>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-accent p-0 h-auto mt-2"
                          asChild
                        >
                          <Link href={`/orders/${order.id}`}>
                            Ver detalles
                          </Link>
                        </Button>
                      </div>
                    ))}

                    <div className="text-center mt-6">
                      <Button variant="outline" className="text-gray-300 border-gray-600" asChild>
                        <Link href="/orders">
                          Ver historial completo
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Configuración</h2>
                <Separator className="bg-gray-700 mb-6" />

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-white mb-2">Notificaciones</h3>
                    <div className="bg-primary p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Recibir emails de ofertas</span>
                        <Button variant="outline" size="sm" className="h-7 px-3">
                          Activado
                        </Button>
                      </div>
                      <Separator className="bg-gray-700 my-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Notificaciones de pedidos</span>
                        <Button variant="outline" size="sm" className="h-7 px-3">
                          Activado
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-2">Cambiar contraseña</h3>
                    <div className="bg-primary p-4 rounded-md">
                      <p className="text-gray-400 mb-3">Actualiza tu contraseña periódicamente para mayor seguridad.</p>
                      <Button variant="outline" className="text-gray-300 border-gray-600">
                        Cambiar contraseña
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-2">Preferencias de privacidad</h3>
                    <div className="bg-primary p-4 rounded-md">
                      <p className="text-gray-400 mb-3">Gestiona cómo utilizamos tus datos.</p>
                      <Button variant="outline" className="text-gray-300 border-gray-600">
                        Gestionar preferencias
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-2">Eliminar cuenta</h3>
                    <div className="bg-primary p-4 rounded-md">
                      <p className="text-gray-400 mb-3">
                        Al eliminar tu cuenta, perderás acceso a todos tus juegos y datos.
                        Esta acción no se puede deshacer.
                      </p>
                      <Button variant="destructive">
                        Eliminar cuenta
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
