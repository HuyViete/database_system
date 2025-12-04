import { pool } from "../libs/db.js"

export async function getUserByUsername(username) {
  const [rows] = await pool.query(`
    SELECT *
    from Users
    WHERE username = ?
    `, [username])
  return rows[0]
}

export async function createUser(username, password, email, firstName, lastName, exp, role) {
  await pool.query(`
    INSERT INTO Users (username, password, email, firstname, lastname, exp_year, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [username, password, email, firstName, lastName, exp, role])
}

export async function getUserById(userId) {
  const [rows] = await pool.query(`SELECT * FROM Users WHERE user_id = ?`, [userId])
  return rows[0]
}

export async function updateUserWarehouse(userId, warehouseId) {
  await pool.query(`UPDATE Users SET warehouse_id = ? WHERE user_id = ?`, [warehouseId, userId])
}
