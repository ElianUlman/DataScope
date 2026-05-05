// repositories/BaseRepository.js
import {pool} from "../db.js";

export class BaseRepository {
  constructor(table) {
    this.table = table;
  }


  async query(sql, params) {
    return pool.query(sql, params);
  }

  async getAll() {
    const result = await this.query(`SELECT * FROM ${this.table}`);
    return result.rows;
  }

  async getById(id) {
    const result = await this.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const columns = keys.join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const sql = `
      INSERT INTO ${this.table} (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `; 
    //la query termina viendose estilo "... (name, email, password) values ($1, $2, $3) returning *"

    const result = await this.query(sql, values);//aca van los values, lo que hace que se asignen a los $
    return result.rows[0];
  }

  async update(id, data) {
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

    const result = await this.query(sql, [...values, id]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.query(
      `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}
