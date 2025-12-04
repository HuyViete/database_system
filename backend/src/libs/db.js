import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình kết nối
const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_SERVER, 
    database: process.env.MSSQL_DATABASE,
    options: {
        encrypt: true, // true cho Azure, false cho local dev (thường là vậy)
        trustServerCertificate: true // Quan trọng cho local dev để bỏ qua lỗi SSL
    }
};

// 1. Khởi tạo đối tượng Pool (nhưng chưa kết nối ngay)
// Việc này giúp bạn có thể export biến 'pool' ra để dùng ở nơi khác
export const pool = new sql.ConnectionPool(config);

export const connectDB = async () => {
    try {
        // 2. Thực hiện kết nối
        await pool.connect();
        console.log("Đã kết nối MS SQL Server thành công!");

        // Test thử query
        // Lưu ý: Trong mssql, nên dùng .request() trước .query()
        const result = await pool.request().query('SELECT 1 as number');
        // console.dir(result.recordset);
        
    } catch (err) {
        console.error("Lỗi kết nối MS SQL: ", err);
        process.exit(1); // Dừng app nếu không kết nối được DB
    }
};