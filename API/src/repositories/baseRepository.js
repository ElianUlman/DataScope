// repositories/BaseRepository.js
import {pool} from "../db.js";


export default class BaseRepository {
  
  constructor(table) {
    this.table = table;
  }

  async query(sql, params, client) {
    const executor = client || pool;
    try {
      console.log(`[API DB] Intentando operar en base de datos. Tabla: ${this.table}`);
      const result = await executor.query(sql, params);
      console.log(`[API DB SUCCESS] Operación exitosa en base de datos. Tabla: ${this.table}`);
      return result;
    } catch (error) {
      console.error(`[API DB ERROR] Fallo al operar en la base de datos. Tabla: ${this.table}`);
      console.error(`[API DB ERROR DETAILS] SQL Ejecutado: ${sql}`);
      console.error(`[API DB ERROR DETAILS] Parámetros:`, params);
      console.error(`[API DB ERROR DETAILS] Mensaje de error:`, error);
      throw error;
    }
  }

  async getAll() {
    const result = await this.query(`SELECT * FROM ${this.table}`);
    return result.rows;
  }

  async getById(id, client) {
    const result = await this.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id],
      client
    );
    return result.rows[0];
  }

  async create(data, client) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const columns = keys.join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const sql = `
      INSERT INTO ${this.table} (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await this.query(sql, values, client);
    return result.rows[0];
  }

  async update(id, data, client) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");

    const sql = `
      UPDATE ${this.table}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    const result = await this.query(sql, [...values, id], client);
    return result.rows[0];
  }

  async delete(id, client) {
    const result = await this.query(
      `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`,
      [id], client
    );
    return result.rows[0];
  }
}
