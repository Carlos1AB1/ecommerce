import { MySQLStorage } from './mysql-storage';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env si existe
dotenv.config();

// Obtener la configuración de la base de datos
const dbHost = process.env.PGHOST || 'localhost';
const dbPort = process.env.PGPORT || '5432';
const dbUser = process.env.PGUSER || 'postgres';
const dbPassword = process.env.PGPASSWORD || '';
const dbName = process.env.PGDATABASE || 'postgres';

// Usamos la URL de la base de datos, que ya está proporcionada por Replit
export const mysqlConnectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

// Crear un solo almacenamiento MySQL para toda la aplicación
let _mysqlStorage: MySQLStorage | null = null;

export function getMySQLStorage(): MySQLStorage {
  if (!_mysqlStorage) {
    _mysqlStorage = new MySQLStorage(mysqlConnectionString);
  }
  return _mysqlStorage;
}

// Función para inicializar la base de datos
export async function initializeDatabase() {
  const storage = getMySQLStorage();
  
  try {
    console.log('Inicializando la estructura de la base de datos...');
    await storage.initializeDatabase();
    console.log('Estructura de base de datos inicializada correctamente.');
    
    // Verificar si hay datos de ejemplo
    const categories = await storage.getCategories();
    if (categories.length === 0) {
      console.log('Inicializando datos de ejemplo...');
      await storage.initializeWithSampleData();
      console.log('Datos de ejemplo inicializados correctamente.');
    }
    
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return false;
  }
}

// Función para cerrar las conexiones a la base de datos
export async function closeDatabaseConnections() {
  if (_mysqlStorage) {
    await _mysqlStorage.close();
    _mysqlStorage = null;
    console.log('Conexión a la base de datos cerrada correctamente.');
  }
}