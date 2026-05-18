// repositories/BaseRepository.js
import { pool } from "../db.js";

export default class BaseRepository {

  constructor(table) {
    this.table = table;
  }

  async query(sql, params, client) {
    const executor = client || pool;
    return executor.query(sql, params);
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

    // Si el valor es un Array, PostgreSQL necesita el cast explícito al tipo del enum.
    // pg no sabe a qué tipo de enum castear un JS array, así que lo mandamos como
    // texto con formato literal de array y dejamos que Postgres lo resuelva.
    const placeholders = keys.map((key, i) => {
      if (Array.isArray(values[i])) {
        // Construye literal de array: {'chatgpt','claude',...}
        // y lo castea al tipo de columna implícitamente via input de texto
        return `$${i + 1}`;
      }
      return `$${i + 1}`;
    }).join(", ");

    // Convertir arrays JS a formato literal de array de PostgreSQL
    const pgValues = values.map(v =>
      Array.isArray(v) ? `{${v.join(",")}}` : v
    );

    const sql = `
      INSERT INTO ${this.table} (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result = await this.query(sql, pgValues, client);
    return result.rows[0];
  }

  async update(id, data, client) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");

    const pgValues = values.map(v =>
      Array.isArray(v) ? `{${v.join(",")}}` : v
    );

    const sql = `
      UPDATE ${this.table}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

<<<<<<< HEAD
    const result = await this.query(sql, [...pgValues, id]);
=======
    const result = await this.query(sql, [...values, id], client);
>>>>>>> luca
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