import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // FAQ data 
  const faqCategories = [
    {
      id: "compras",
      name: "Compras y Pagos",
      faqs: [
        {
          question: "¿Cómo realizo un pedido?",
          answer: "Para realizar un pedido, simplemente busca el juego que deseas, añádelo a tu carrito y procede al pago. Puedes pagar con tarjeta de crédito/débito, PayPal o transferencia bancaria."
        },
        {
          question: "¿Cuáles son los métodos de pago aceptados?",
          answer: "Aceptamos pagos mediante tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y transferencias bancarias."
        },
        {
          question: "¿Los precios incluyen impuestos?",
          answer: "Sí, todos los precios mostrados en nuestro sitio incluyen el IVA y cualquier otro impuesto aplicable."
        },
        {
          question: "¿Cómo puedo obtener una factura de mi compra?",
          answer: "Una vez completada tu compra, puedes descargar la factura desde la sección 'Historial de pedidos' en tu perfil. También recibirás una copia por correo electrónico."
        },
        {
          question: "¿Puedo cancelar mi pedido?",
          answer: "Puedes cancelar tu pedido siempre que aún no hayas recibido o activado el juego. Para hacerlo, contacta con nuestro servicio de atención al cliente lo antes posible."
        }
      ]
    },
    {
      id: "productos",
      name: "Productos y Activación",
      faqs: [
        {
          question: "¿Cómo recibo mi juego después de la compra?",
          answer: "Después de completar tu compra, recibirás inmediatamente un correo electrónico con los detalles de tu pedido. Los códigos de activación estarán disponibles en tu cuenta, en la sección 'Mis pedidos'."
        },
        {
          question: "¿Cómo activar un código de juego?",
          answer: "Para activar un código de juego, debes ingresar a la plataforma correspondiente (Steam, Epic Games, etc.), buscar la opción 'Activar producto' o 'Canjear código', introducir el código que recibiste y seguir las instrucciones en pantalla."
        },
        {
          question: "¿Qué hago si mi código no funciona?",
          answer: "Si tienes problemas con tu código, primero asegúrate de introducirlo exactamente como aparece, respetando mayúsculas, minúsculas y guiones. Si el problema persiste, contacta con nuestro servicio de atención al cliente y te ayudaremos a resolverlo."
        },
        {
          question: "¿Los juegos tienen restricciones regionales?",
          answer: "Algunos juegos pueden tener restricciones regionales. Siempre indicamos claramente en la página del producto si hay alguna restricción regional. Si no se menciona, el juego es activable globalmente."
        },
        {
          question: "¿Puedo regalar un juego a otra persona?",
          answer: "Sí, puedes comprar un juego como regalo. Durante el proceso de compra, selecciona la opción 'Comprar como regalo' y proporciona el correo electrónico del destinatario. El código de activación será enviado directamente a esa dirección."
        }
      ]
    },
    {
      id: "devoluciones",
      name: "Devoluciones y Reembolsos",
      faqs: [
        {
          question: "¿Cuál es la política de devoluciones?",
          answer: "Puedes solicitar un reembolso dentro de los 14 días posteriores a la compra, siempre que no hayas activado o utilizado el producto. Para iniciar el proceso, contacta con nuestro servicio de atención al cliente."
        },
        {
          question: "¿Cómo solicito un reembolso?",
          answer: "Para solicitar un reembolso, envía un correo electrónico a soporte@gamevault.es o utiliza el formulario de contacto en nuestra página de soporte. Incluye tu número de pedido y el motivo de la devolución."
        },
        {
          question: "¿Cuánto tiempo tarda en procesarse un reembolso?",
          answer: "Una vez aprobada tu solicitud de reembolso, el procesamiento suele tardar entre 3 y 5 días hábiles, dependiendo de tu método de pago."
        },
        {
          question: "¿Se puede devolver un juego si ya lo he activado?",
          answer: "Generalmente, no aceptamos devoluciones de productos ya activados. Sin embargo, si experimentas problemas técnicos graves que hacen que el juego sea injugable, contacta con nuestro servicio de atención al cliente y estudiaremos tu caso."
        },
        {
          question: "¿Hay algún cargo por solicitar un reembolso?",
          answer: "No, no cobramos ninguna tarifa por procesar reembolsos."
        }
      ]
    },
    {
      id: "cuenta",
      name: "Cuenta y Seguridad",
      faqs: [
        {
          question: "¿Cómo cambio mi contraseña?",
          answer: "Para cambiar tu contraseña, inicia sesión en tu cuenta, ve a la sección 'Configuración' o 'Perfil', y busca la opción 'Cambiar contraseña'. Sigue las instrucciones para actualizar tu contraseña."
        },
        {
          question: "¿Qué hago si olvidé mi contraseña?",
          answer: "Si olvidaste tu contraseña, haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión. Recibirás un correo electrónico con instrucciones para restablecer tu contraseña."
        },
        {
          question: "¿Cómo puedo eliminar mi cuenta?",
          answer: "Para eliminar tu cuenta, contacta con nuestro servicio de atención al cliente. Ten en cuenta que esto eliminará permanentemente toda tu información y no podrás acceder a los juegos comprados a través de nuestra plataforma."
        },
        {
          question: "¿Cómo protegen mis datos personales?",
          answer: "Utilizamos tecnología de encriptación avanzada para proteger tus datos personales. Además, nunca compartimos tu información con terceros sin tu consentimiento expreso. Para más detalles, consulta nuestra Política de Privacidad."
        },
        {
          question: "¿Qué hago si detectó una actividad sospechosa en mi cuenta?",
          answer: "Si detectas actividad sospechosa, cambia inmediatamente tu contraseña y contacta con nuestro servicio de atención al cliente para que podamos investigar y tomar medidas adicionales si es necesario."
        }
      ]
    }
  ];
  
  // Filter FAQs based on search term
  const filteredFAQs = searchTerm 
    ? faqCategories.flatMap(category => 
        category.faqs
          .filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(faq => ({ ...faq, category: category.name }))
      )
    : [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Preguntas frecuentes</h1>
      
      {/* Search bar */}
      <div className="bg-primary-light rounded-lg p-6 mb-8">
        <div className="max-w-3xl mx-auto relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar en las preguntas frecuentes..."
            className="w-full py-3 pl-12 pr-4 rounded-lg bg-primary border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Search results */}
      {searchTerm && (
        <div className="mb-8">
          <h2 className="font-rajdhani font-bold text-2xl text-white mb-4">
            Resultados de búsqueda ({filteredFAQs.length})
          </h2>
          
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="bg-primary-light rounded-lg overflow-hidden">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`search-${index}`} className="border-b border-gray-700 last:border-0">
                  <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
                    <div>
                      <div className="text-left">{faq.question}</div>
                      <div className="text-xs text-gray-400 text-left mt-1">Categoría: {faq.category}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card className="bg-primary-light p-6 text-center">
              <p className="text-gray-400 mb-4">No se encontraron resultados para "{searchTerm}".</p>
              <p className="text-white mb-4">Intenta con otros términos o revisa nuestras categorías de preguntas frecuentes.</p>
              <Button onClick={() => setSearchTerm("")} variant="outline" className="text-gray-300 border-gray-600">
                Ver todas las preguntas
              </Button>
            </Card>
          )}
        </div>
      )}
      
      {/* FAQ categories with tabs */}
      {!searchTerm && (
        <Tabs defaultValue="compras" className="mb-8">
          <TabsList className="bg-primary grid grid-cols-2 sm:grid-cols-4 mb-6">
            {faqCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-accent"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {faqCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <Accordion type="single" collapsible className="bg-primary-light rounded-lg overflow-hidden">
                {category.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`${category.id}-${index}`} className="border-b border-gray-700 last:border-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-primary/50 text-white">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {/* Contact section */}
      <div className="bg-primary-light rounded-lg p-6 text-center">
        <h2 className="font-rajdhani font-bold text-2xl text-white mb-4">¿No encuentras respuesta a tu pregunta?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Si no has encontrado la información que buscas, no dudes en contactar con nuestro equipo de soporte. 
          Estaremos encantados de ayudarte.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-accent hover:bg-accent-hover">
            <a href="/support">Contactar soporte</a>
          </Button>
          <Button asChild variant="outline" className="text-gray-300 border-gray-600">
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      </div>
    </div>
  );
}