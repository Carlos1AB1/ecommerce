import { MySQLStorage } from './mysql-storage';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

// Get database configuration with MySQL defaults
const dbHost = process.env.MYSQL_HOST || 'localhost';
const dbPort = process.env.MYSQL_PORT || '3306';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || '';
const dbName = process.env.MYSQL_DATABASE || 'gamevault';

export const mysqlConnectionString = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

// Create a single MySQL storage instance for the entire application
let _mysqlStorage: MySQLStorage | null = null;

export function getMySQLStorage(): MySQLStorage {
  if (!_mysqlStorage) {
    _mysqlStorage = new MySQLStorage(mysqlConnectionString);
  }
  return _mysqlStorage;
}

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing MySQL database connection...');
    // Create connection pool
    const connection = await mysql.createConnection(mysqlConnectionString);

    // Test the connection
    await connection.query('SELECT 1');
    console.log('MySQL connection successful!');

    // Close test connection
    await connection.end();

    // Initialize storage with tables and sample data
    const storage = getMySQLStorage();
    await storage.initializeDatabase();

    // Check if sample data needs to be loaded
    const categories = await storage.getCategories();
    if (categories.length === 0) {
      console.log('Initializing sample data...');
      await storage.initializeWithSampleData();
      console.log('Sample data initialized successfully.');
    }

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Function to close database connections
export async function closeDatabaseConnections() {
  if (_mysqlStorage) {
    await _mysqlStorage.close();
    _mysqlStorage = null;
    console.log('MySQL connection closed successfully.');
  }
}