import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';
import { queryClient } from '@/lib/queryClient';

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nombre completo es requerido"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Dirección es requerida"),
  city: z.string().min(2, "Ciudad es requerida"),
  postalCode: z.string().min(5, "Código postal es requerido"),
  country: z.string().min(2, "País es requerido"),
  paymentMethod: z.enum(["credit", "paypal", "transfer"], {
    required_error: "Método de pago es requerido",
  }),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.21; // 21% tax
  const shipping = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + tax + shipping;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      paymentMethod: 'credit',
    },
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setLocation('/cart');
      toast({
        title: "Carrito vacío",
        description: "Debes añadir productos al carrito antes de proceder al pago",
        variant: "destructive",
      });
    }
  }, [cartItems, setLocation, toast]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isSubmitting) {
      setLocation('/');
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para continuar con la compra",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isSubmitting, setLocation, toast]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "No puedes realizar el pago con un carrito vacío",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const res = await apiRequest("POST", "/api/orders", {
        total,
        status: "pending",
      });

      if (res.ok) {
        // Clear cart after successful order
        clearCart();
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        
        toast({
          title: "¡Pedido realizado con éxito!",
          description: "Gracias por tu compra. Recibirás un email con los detalles de tu pedido.",
        });
        
        // Redirect to order confirmation page
        setLocation('/orders');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error al procesar el pedido",
        description: "Ha ocurrido un error al procesar tu pedido. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchPaymentMethod = form.watch('paymentMethod');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-primary-light rounded-lg p-6">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-8">
                {/* Shipping Section */}
                <div>
                  <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Información de envío</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName" className="text-gray-300 mb-1 block">Nombre completo</Label>
                      <Input
                        id="fullName"
                        className="bg-primary border border-gray-700 text-white"
                        {...form.register('fullName')}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="email" className="text-gray-300 mb-1 block">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        className="bg-primary border border-gray-700 text-white"
                        {...form.register('email')}
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-gray-300 mb-1 block">Dirección</Label>
                      <Textarea
                        id="address"
                        className="bg-primary border border-gray-700 text-white"
                        {...form.register('address')}
                      />
                      {form.formState.errors.address && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-gray-300 mb-1 block">Ciudad</Label>
                      <Input
                        id="city"
                        className="bg-primary border border-gray-700 text-white"
                        {...form.register('city')}
                      />
                      {form.formState.errors.city && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode" className="text-gray-300 mb-1 block">Código postal</Label>
                      <Input
                        id="postalCode"
                        className="bg-primary border border-gray-700 text-white"
                        {...form.register('postalCode')}
                      />
                      {form.formState.errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.postalCode.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="country" className="text-gray-300 mb-1 block">País</Label>
                      <Input
                        id="country"
                        className="bg-primary border border-gray-700 text-white"
                        {...form.register('country')}
                      />
                      {form.formState.errors.country && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Payment Section */}
                <div>
                  <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Método de pago</h2>
                  
                  <RadioGroup 
                    defaultValue="credit"
                    {...form.register('paymentMethod')}
                    className="mb-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="payment-credit" />
                      <Label htmlFor="payment-credit" className="text-gray-300">Tarjeta de crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="payment-paypal" />
                      <Label htmlFor="payment-paypal" className="text-gray-300">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="payment-transfer" />
                      <Label htmlFor="payment-transfer" className="text-gray-300">Transferencia bancaria</Label>
                    </div>
                  </RadioGroup>

                  {form.formState.errors.paymentMethod && (
                    <p className="text-red-500 text-sm mb-4">{form.formState.errors.paymentMethod.message}</p>
                  )}

                  {watchPaymentMethod === 'credit' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber" className="text-gray-300 mb-1 block">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="bg-primary border border-gray-700 text-white"
                          {...form.register('cardNumber')}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="cardName" className="text-gray-300 mb-1 block">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          placeholder="NOMBRE APELLIDO"
                          className="bg-primary border border-gray-700 text-white"
                          {...form.register('cardName')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardExpiry" className="text-gray-300 mb-1 block">Fecha de expiración</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          className="bg-primary border border-gray-700 text-white"
                          {...form.register('cardExpiry')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCVC" className="text-gray-300 mb-1 block">CVC</Label>
                        <Input
                          id="cardCVC"
                          placeholder="123"
                          className="bg-primary border border-gray-700 text-white"
                          {...form.register('cardCVC')}
                        />
                      </div>
                    </div>
                  )}

                  {watchPaymentMethod === 'paypal' && (
                    <div className="bg-primary p-4 rounded border border-gray-700">
                      <p className="text-gray-300 text-sm">
                        Al hacer clic en "Completar pedido", serás redirigido a PayPal para completar tu compra de forma segura.
                      </p>
                    </div>
                  )}

                  {watchPaymentMethod === 'transfer' && (
                    <div className="bg-primary p-4 rounded border border-gray-700">
                      <p className="text-gray-300 text-sm mb-2">
                        Realiza una transferencia bancaria a la siguiente cuenta:
                      </p>
                      <p className="text-white text-sm">
                        Banco: GameVault Bank<br />
                        IBAN: ES12 3456 7890 1234 5678 9012<br />
                        BIC/SWIFT: GAMEVLT12XXX<br />
                        Referencia: Tu número de pedido (se te proporcionará tras completar el pedido)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Link href="/cart">
                  <Button 
                    type="button"
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    Volver al carrito
                  </Button>
                </Link>
                <Button 
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Completar pedido'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-primary-light rounded-lg p-6 sticky top-20">
            <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Resumen del pedido</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cartItems.map(item => {
                const price = item.game.discountedPrice || item.game.price;
                return (
                  <div key={item.id} className="flex items-center py-2 border-b border-gray-800 last:border-0">
                    <div className="w-12 h-12 flex-shrink-0 mr-4">
                      <img 
                        src={item.game.imageUrl} 
                        alt={item.game.title} 
                        className="w-full h-full object-cover rounded" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-medium">{item.game.title}</h3>
                      <p className="text-gray-400 text-xs">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-highlight font-medium ml-4">
                      €{(price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal:</span>
                <span className="text-white font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Impuestos (21%):</span>
                <span className="text-white font-medium">€{tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Envío:</span>
                <span className="text-white font-medium">€{shipping.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-800 pt-3 flex justify-between">
                <span className="text-white font-medium">Total:</span>
                <span className="text-highlight font-bold text-xl">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
