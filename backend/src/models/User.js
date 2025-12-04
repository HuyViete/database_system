import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getUserByUsername(username) {
  const result = await pool.request()
    .input('username', mssql.VarChar, username)
    .query(`SELECT * FROM [User] WHERE username = @username`)
  return result.recordset[0]
}

// createUser is handled in authController with transaction
// export async function createUser(...) { ... }

export async function getUserById(userId) {
  const result = await pool.request()
    .input('userId', mssql.UniqueIdentifier, userId)
    .query(`SELECT * FROM [User] WHERE user_id = @userId`)
  return result.recordset[0]
}

// updateUserWarehouse is not applicable to current schema
// export async function updateUserWarehouse(...) { ... }

