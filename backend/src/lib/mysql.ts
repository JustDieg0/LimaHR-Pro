import mysql from 'mysql2/promise';

export class DatabasePool {
  private static instance: DatabasePool;
  public pool: mysql.Pool;

  private constructor() {
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
    
    this.pool = mysql.createPool({
      host: process.env.DB_HOST ?? 'localhost',
      port: port,
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'limahr_pro_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '-05:00',
    } as mysql.PoolOptions);
  }

  static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  /**
   * Prueba conexión a MySQL (ping)
   */
  async testConnection(): Promise<boolean> {
  try {
    await this.pool.execute('SELECT 1');
    console.log('Pool MySQL OK (sin getConnection)');
    return true;
  } catch (error) {
    console.error('Pool error:', error);
    throw error;
  }
}


  async close(): Promise<void> {
    await this.pool.end();
  }
}

