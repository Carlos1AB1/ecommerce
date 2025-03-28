import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-2">Términos y Condiciones</h1>
      <p className="text-gray-400 mb-6">Última actualización: 1 de marzo de 2025</p>
      
      <div className="bg-primary-light rounded-lg p-6 mb-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">Introducción</h2>
          <p>
            Estos Términos y Condiciones ("Términos") rigen tu acceso y uso de la plataforma GameVault, 
            incluyendo cualquier contenido, funcionalidad y servicios ofrecidos a través de nuestro sitio web.
          </p>
          <p>
            Al utilizar nuestra plataforma, aceptas estar legalmente obligado por estos Términos. 
            Si no estás de acuerdo con alguno de los términos establecidos, no debes acceder ni utilizar 
            nuestra plataforma.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Registro de cuenta</h2>
          <p>
            Para acceder a ciertas funciones de nuestra plataforma, deberás registrarte y crear una cuenta. 
            Al hacerlo, te comprometes a proporcionar información precisa, actual y completa durante el proceso 
            de registro, y a mantener actualizada esta información.
          </p>
          <p>
            Eres responsable de mantener la confidencialidad de tu información de cuenta, incluyendo tu 
            contraseña, y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente 
            sobre cualquier uso no autorizado de tu cuenta o cualquier otra violación de seguridad.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Compras y pagos</h2>
          <p>
            Los precios de los juegos se muestran en euros (€) e incluyen el IVA aplicable. Nos reservamos el 
            derecho de cambiar los precios en cualquier momento, pero los cambios no afectarán a los pedidos que 
            ya hayas realizado.
          </p>
          <p>
            Al realizar una compra, aceptas proporcionar información de pago actual, completa y precisa. Utilizamos 
            servicios de procesamiento de pagos de terceros para facilitar tu compra y no almacenamos tu información 
            de tarjeta de crédito en nuestros servidores.
          </p>
          <p>
            Recibirás una confirmación por correo electrónico una vez que tu pedido haya sido procesado. Los códigos 
            de activación de los juegos estarán disponibles en tu cuenta y/o serán enviados por correo electrónico.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Licencias y uso del contenido</h2>
          <p>
            Cuando compras un juego, adquieres una licencia personal, no exclusiva, no transferible y limitada para 
            acceder y utilizar el juego de acuerdo con estos Términos y cualquier término específico proporcionado 
            por el desarrollador o editor del juego.
          </p>
          <p>
            No debes:
          </p>
          <ul>
            <li>Copiar, modificar, distribuir, vender o alquilar ninguna parte de nuestros servicios o contenido</li>
            <li>Realizar ingeniería inversa o intentar extraer el código fuente de nuestro software</li>
            <li>Utilizar bots, rastreadores o métodos similares para acceder o extraer datos de nuestra plataforma</li>
            <li>Eludir o desactivar cualquier medida de seguridad o protección tecnológica</li>
            <li>Utilizar los servicios de manera que viole cualquier ley o regulación aplicable</li>
          </ul>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Política de reembolso</h2>
          <p>
            Puedes solicitar un reembolso dentro de los 14 días posteriores a la compra, siempre que no hayas 
            activado o utilizado el producto. Para iniciar el proceso de reembolso, contacta con nuestro servicio 
            de atención al cliente.
          </p>
          <p>
            Nos reservamos el derecho de rechazar solicitudes de reembolso si determinamos que se ha producido 
            un abuso de nuestra política de reembolsos o si el código de activación ya ha sido utilizado.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Limitación de responsabilidad</h2>
          <p>
            En la medida permitida por la ley, GameVault no será responsable de ningún daño indirecto, incidental, 
            especial, consecuente o punitivo, o cualquier pérdida de beneficios o ingresos, ya sea incurrida directa 
            o indirectamente, o cualquier pérdida de datos, uso, buena voluntad, u otras pérdidas intangibles.
          </p>
          <p>
            No garantizamos que los juegos estarán libres de errores o que funcionarán sin interrupciones. Si un juego 
            tiene problemas técnicos, te animamos a contactar primero con el desarrollador o editor del juego para 
            buscar asistencia.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Modificaciones a los términos</h2>
          <p>
            Podemos revisar y actualizar estos Términos en cualquier momento a nuestra sola discreción. Todos los 
            cambios son efectivos inmediatamente cuando los publicamos y se aplican a todo acceso y uso de la 
            plataforma a partir de ese momento.
          </p>
          <p>
            Tu uso continuado de la plataforma después de la publicación de los Términos revisados significa que 
            aceptas y consientes los cambios. Se espera que revises esta página periódicamente para estar al tanto 
            de cualquier cambio.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Ley aplicable</h2>
          <p>
            Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin dar efecto a ningún 
            principio de conflicto de leyes. Cualquier acción legal que surja o esté relacionada con estos Términos 
            estará sujeta a la jurisdicción exclusiva de los tribunales de Madrid, España.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Contacto</h2>
          <p>
            Si tienes preguntas o inquietudes sobre estos Términos y Condiciones, por favor contáctanos en:
          </p>
          <p className="font-medium mt-2">
            Email: legal@gamevault.es<br />
            Dirección: Calle Ejemplo 123, 28001 Madrid, España
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button asChild variant="outline" className="text-gray-300 border-gray-600 mr-4">
          <a href="/">Volver al inicio</a>
        </Button>
        <Button asChild className="bg-accent hover:bg-accent-hover">
          <a href="/support">Centro de soporte</a>
        </Button>
      </div>
    </div>
  );
}