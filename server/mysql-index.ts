import express from 'express';
import { registerRoutes } from './routes';
import { log } from './vite';
import dotenv from 'dotenv';
import { getMySQLStorage, initializeDatabase } from './mysql-config';
import { IStorage } from './storage';

// Cargar variables de entorno
dotenv.config();

async function main() {
  // Crear la app Express
  const app = express();
  
  // Configuración de middleware
  app.use(express.json());
  
  // Configurar para usar almacenamiento MySQL
  try {
    // Inicializar la base de datos MySQL
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      log('Error al inicializar la base de datos MySQL. La aplicación no funcionará correctamente.', 'mysql');
      process.exit(1);
    }
    
    log('Base de datos MySQL inicializada correctamente', 'mysql');
    
    // Registrar las rutas con el almacenamiento MySQL
    // Nota: Aquí puedes proporcionar el almacenamiento MySQL específicamente
    // para ser utilizado por las rutas en lugar del almacenamiento predeterminado
    const server = await registerRoutes(app);
    
    // Iniciar el servidor HTTP
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      log(`servidor iniciado en puerto ${PORT}`, 'mysql');
    });
  } catch (error) {
    log(`Error al iniciar la aplicación: ${error}`, 'mysql');
    process.exit(1);
  }
}

// Capturar errores no manejados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Iniciar la aplicación
main();