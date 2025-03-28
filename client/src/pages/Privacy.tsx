import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-2">Política de Privacidad</h1>
      <p className="text-gray-400 mb-6">Última actualización: 1 de marzo de 2025</p>
      
      <div className="bg-primary-light rounded-lg p-6 mb-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">Introducción</h2>
          <p>
            En GameVault, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. 
            Esta política de privacidad explica cómo recopilamos, utilizamos y protegemos tu información 
            cuando utilizas nuestra plataforma.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Información que recopilamos</h2>
          <p>Podemos recopilar los siguientes tipos de información:</p>
          <ul>
            <li>
              <strong>Información de registro:</strong> Cuando creas una cuenta, recopilamos tu nombre, 
              dirección de correo electrónico, nombre de usuario y contraseña.
            </li>
            <li>
              <strong>Información de perfil:</strong> Puedes proporcionar información adicional como 
              preferencias de juego y foto de perfil.
            </li>
            <li>
              <strong>Información de transacciones:</strong> Cuando realizas una compra, recopilamos 
              datos sobre la transacción, incluyendo los juegos comprados, método de pago y dirección 
              de facturación.
            </li>
            <li>
              <strong>Información técnica:</strong> Recopilamos información sobre tu dispositivo, 
              dirección IP, tipo de navegador, sistema operativo y patrones de uso.
            </li>
          </ul>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Cómo utilizamos tu información</h2>
          <p>Utilizamos tu información para los siguientes propósitos:</p>
          <ul>
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Procesar transacciones y enviar confirmaciones</li>
            <li>Enviar actualizaciones, alertas y mensajes de soporte</li>
            <li>Responder a tus comentarios y preguntas</li>
            <li>Personalizar tu experiencia y recomendarte juegos que puedan interesarte</li>
            <li>Detectar, investigar y prevenir actividades fraudulentas o no autorizadas</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Compartir tu información</h2>
          <p>
            No vendemos ni alquilamos tu información personal a terceros. Sin embargo, podemos compartir 
            información en las siguientes circunstancias:
          </p>
          <ul>
            <li>
              <strong>Proveedores de servicios:</strong> Podemos compartir información con terceros 
              que nos ayudan a operar nuestro sitio web y proporcionar servicios (procesadores de pago, 
              servicios de alojamiento, etc.).
            </li>
            <li>
              <strong>Cumplimiento legal:</strong> Podemos divulgar información si creemos de buena fe 
              que es necesario para cumplir con la ley, proteger nuestros derechos o en respuesta a una 
              solicitud legal.
            </li>
            <li>
              <strong>Con tu consentimiento:</strong> Podemos compartir información con terceros cuando 
              nos hayas dado tu consentimiento para hacerlo.
            </li>
          </ul>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Seguridad de los datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tus 
            datos personales contra pérdida accidental, uso indebido, alteración o divulgación no autorizada. 
            Sin embargo, ninguna transmisión por Internet o método de almacenamiento electrónico es 100% seguro, 
            por lo que no podemos garantizar su seguridad absoluta.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Tus derechos</h2>
          <p>Dependiendo de tu ubicación, puedes tener los siguientes derechos:</p>
          <ul>
            <li>Acceder y recibir una copia de tus datos personales</li>
            <li>Rectificar datos inexactos o incompletos</li>
            <li>Solicitar la eliminación de tus datos personales</li>
            <li>Restringir u oponerte al procesamiento de tus datos</li>
            <li>Solicitar la portabilidad de tus datos</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, por favor contáctanos 
            a través de soporte@gamevault.es.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política de privacidad periódicamente. Te notificaremos cualquier 
            cambio significativo a través de un aviso destacado en nuestro sitio web o por correo electrónico. 
            Te recomendamos revisar esta política regularmente para estar informado sobre cómo protegemos tu información.
          </p>
          
          <Separator className="my-6 bg-gray-700" />
          
          <h2 className="text-2xl font-bold mb-4">Contacto</h2>
          <p>
            Si tienes preguntas o inquietudes sobre esta política de privacidad o sobre cómo 
            manejamos tus datos personales, por favor contáctanos en:
          </p>
          <p className="font-medium mt-2">
            Email: privacy@gamevault.es<br />
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