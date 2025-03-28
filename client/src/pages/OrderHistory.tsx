import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { AuthContext } from '@/context/AuthContext';
import { Order, OrderWithItems } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderHistory() {
  const { id } = useParams();
  const orderId = id ? parseInt(id) : null;
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all orders (for order history)
  const { 
    data: orders = [], 
    isLoading: isOrdersLoading 
  } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: isAuthenticated && !orderId,
  });

  // Fetch specific order (for order details)
  const { 
    data: orderDetails,
    isLoading: isOrderDetailsLoading 
  } = useQuery<OrderWithItems>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: isAuthenticated && !!orderId,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-primary-light">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-white mb-4">Necesitas iniciar sesión</h2>
              <p className="text-gray-400 mb-6">Inicia sesión para ver tu historial de compras</p>
              <Button className="bg-accent hover:bg-accent-hover">
                Iniciar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to format status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-700 hover:bg-green-800">Completado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-700 hover:bg-yellow-800">Pendiente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-700 hover:bg-red-800">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Render order details view
  if (orderId) {
    if (isOrderDetailsLoading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <Card className="bg-primary-light mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary-light">
            <CardHeader>
              <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="flex border-b border-gray-700 pb-4">
                    <Skeleton className="h-16 w-16 mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!orderDetails) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Pedido no encontrado</h1>
          <Card className="bg-primary-light">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-white mb-4">El pedido que buscas no existe</h2>
                <p className="text-gray-400 mb-6">No hemos podido encontrar el pedido que buscas</p>
                <Button asChild className="bg-accent hover:bg-accent-hover">
                  <Link href="/orders">
                    Ver todos los pedidos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-rajdhani font-bold text-3xl text-white">Detalles del Pedido #{orderDetails.id}</h1>
          <Button asChild variant="outline" className="text-gray-300 border-gray-600">
            <Link href="/orders">
              Volver a pedidos
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-primary-light mb-6">
              <CardHeader>
                <CardTitle>Información del pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Número de pedido</p>
                    <p className="text-white font-medium">#{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Fecha</p>
                    <p className="text-white font-medium">
                      {new Date(orderDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Estado</p>
                    <div className="mt-1">{getStatusBadge(orderDetails.status)}</div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-highlight font-bold">€{orderDetails.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-light">
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex border-b border-gray-700 pb-4 last:border-0">
                      <div className="w-16 h-16 flex-shrink-0 mr-4">
                        <img 
                          src={item.game.imageUrl} 
                          alt={item.game.title} 
                          className="w-full h-full object-cover rounded" 
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/game/${item.game.id}`}>
                          <a className="font-medium text-white hover:text-accent">
                            {item.game.title}
                          </a>
                        </Link>
                        <p className="text-gray-400 text-sm">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">€{item.price.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">
                          Total: €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-primary-light">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white font-medium">
                      €{(orderDetails.total * 0.826).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Impuestos (21%):</span>
                    <span className="text-white font-medium">
                      €{(orderDetails.total * 0.174).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3 flex justify-between">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-highlight font-bold text-xl">
                      €{orderDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="font-medium text-white mb-2">Acciones</h3>
                  <Button className="w-full bg-accent hover:bg-accent-hover">
                    Descargar factura
                  </Button>
                  <Button variant="outline" className="w-full text-gray-300 border-gray-600">
                    Contactar soporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render order history view
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Historial de compras</h1>
      
      {isOrdersLoading ? (
        <Card className="bg-primary-light">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array(5).fill(0).map((_, idx) => (
                <div key={idx} className="bg-primary p-4 rounded-md">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="bg-primary-light">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-white mb-4">No has realizado ninguna compra todavía</h2>
              <p className="text-gray-400 mb-6">Explora nuestra colección de juegos y realiza tu primera compra</p>
              <Button asChild className="bg-accent hover:bg-accent-hover">
                <Link href="/">
                  Explorar juegos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-primary-light">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Fecha</p>
                    <p className="text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-highlight font-bold">
                      €{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Separator className="bg-gray-700 my-4" />
                <div className="flex justify-between items-center">
                  <Button
                    asChild
                    variant="link"
                    className="text-accent p-0 h-auto"
                  >
                    <Link href={`/orders/${order.id}`}>
                      Ver detalles
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600"
                  >
                    Descargar factura
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
