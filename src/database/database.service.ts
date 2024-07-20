import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private connection: Connection) {}

  async testConnection() {
    try {
      await this.connection.query('SELECT 1');
      console.log('Connection to PostgreSQL successful.');
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error);
    }
  }
}
