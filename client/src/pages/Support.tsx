import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaQuestionCircle, FaHeadset, FaEnvelope } from "react-icons/fa";

export default function Support() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Centro de soporte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Card className="bg-primary-light p-6">
          <div className="flex items-center mb-4">
            <FaQuestionCircle className="text-accent text-2xl mr-3" />
            <h2 className="font-rajdhani font-bold text-xl text-white">Preguntas frecuentes</h2>
          </div>
          <p className="text-gray-400 mb-4">Encuentra respuestas a las preguntas más comunes sobre pedidos, pagos y envíos.</p>
          <Button asChild variant="outline" className="w-full text-gray-300 border-gray-600">
            <a href="/support/faq">Ver preguntas frecuentes</a>
          </Button>
        </Card>
        
        <Card className="bg-primary-light p-6">
          <div className="flex items-center mb-4">
            <FaHeadset className="text-accent text-2xl mr-3" />
            <h2 className="font-rajdhani font-bold text-xl text-white">Contacto directo</h2>
          </div>
          <p className="text-gray-400 mb-4">¿Necesitas ayuda personalizada? Contacta con nuestro equipo de soporte.</p>
          <Button className="w-full bg-accent hover:bg-accent-hover">
            Chat en vivo
          </Button>
        </Card>
        
        <Card className="bg-primary-light p-6">
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-accent text-2xl mr-3" />
            <h2 className="font-rajdhani font-bold text-xl text-white">Correo electrónico</h2>
          </div>
          <p className="text-gray-400 mb-4">Envíanos un correo electrónico y te responderemos en un plazo de 24 horas.</p>
          <Button asChild variant="outline" className="w-full text-gray-300 border-gray-600">
            <a href="mailto:soporte@gamevault.es">soporte@gamevault.es</a>
          </Button>
        </Card>
      </div>
      
      <h2 className="font-rajdhani font-bold text-2xl text-white mb-4">Preguntas frecuentes</h2>
      
      <Accordion type="single" collapsible className="bg-primary-light rounded-lg overflow-hidden mb-10">
        <AccordionItem value="item-1" className="border-b border-gray-700">
          <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
            ¿Cómo puedo realizar un seguimiento de mi pedido?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Puedes realizar un seguimiento de tu pedido iniciando sesión en tu cuenta y visitando la sección "Historial de pedidos". 
            Allí encontrarás el estado actual de todos tus pedidos y podrás ver los detalles completos haciendo clic en "Ver detalles".
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border-b border-gray-700">
          <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
            ¿Cuáles son los métodos de pago aceptados?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Aceptamos los siguientes métodos de pago:
            <ul className="list-disc list-inside mt-2">
              <li>Tarjetas de crédito/débito (Visa, Mastercard, American Express)</li>
              <li>PayPal</li>
              <li>Transferencia bancaria</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border-b border-gray-700">
          <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
            ¿Cómo activar un código de juego?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Para activar un código de juego:
            <ol className="list-decimal list-inside mt-2 space-y-2">
              <li>Inicia la plataforma correspondiente (Steam, Epic Games, etc.)</li>
              <li>Busca la opción "Activar producto" o "Canjear código"</li>
              <li>Introduce el código que recibiste</li>
              <li>Sigue las instrucciones en pantalla para completar la activación</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="border-b border-gray-700">
          <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
            ¿Puedo solicitar un reembolso?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Sí, puedes solicitar un reembolso dentro de los 14 días posteriores a la compra, siempre que no hayas activado o utilizado el producto. 
            Para iniciar el proceso de reembolso, contacta con nuestro servicio de atención al cliente a través del correo electrónico soporte@gamevault.es 
            o mediante el chat en vivo.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
            ¿Ofrecen soporte técnico para los juegos?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Proporcionamos soporte básico relacionado con la activación de productos y problemas de compra. 
            Para problemas técnicos específicos del juego, te recomendamos contactar directamente con el soporte 
            del desarrollador o editor del juego, ya que están mejor equipados para ayudarte con problemas específicos.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="bg-primary-light rounded-lg p-6 text-center">
        <h2 className="font-rajdhani font-bold text-2xl text-white mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta o problema que puedas tener.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-accent hover:bg-accent-hover">
            Contactar soporte
          </Button>
          <Button asChild variant="outline" className="text-gray-300 border-gray-600">
            <a href="/support/faq">Ver todas las FAQs</a>
          </Button>
        </div>
      </div>
    </div>
  );
}