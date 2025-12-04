import mssql from 'mssql'
import dotenv from 'dotenv'
dotenv.config();

// Cấu hình kết nối
const config = {
    user: process.env.MSSQL_USER, // Tương đương root
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_SERVER, 
    database: process.env.MSSQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export const connectDB = async () => {
    try {
        // Tạo kết nối (Connection Pool)
        let pool = await mssql.connect(config);
        console.log("Đã kết nối MS SQL Server thành công!");

        // Test thử query
        let result = await pool.request().query('SELECT 1 as number');
        console.dir(result.recordset);
        
        return pool;
    } catch (err) {
        console.log("Lỗi kết nối: ", err);
    }
}