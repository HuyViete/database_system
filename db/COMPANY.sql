-- ----------
-- PHẦN 1: TẠO CÁC BẢNG (KHÔNG CÓ KHÓA NGOẠI)
-- ----------
GO

-- Tạo bảng EMPLOYEE (Nhân viên)
CREATE TABLE EMPLOYEE (
    Fname VARCHAR(50) NOT NULL,
    Minit CHAR(1),
    Lname VARCHAR(50) NOT NULL,
    Ssn CHAR(9) NOT NULL,
    Bdate DATE,
    Address VARCHAR(255),
    Sex CHAR(1),
    Salary DECIMAL(10, 2),
    Super_ssn CHAR(9),
    Dno INT
);
ALTER TABLE EMPLOYEE
ADD CONSTRAINT pk_employee PRIMARY KEY (Ssn);
GO

-- Tạo bảng DEPARTMENT (Phòng ban)
CREATE TABLE DEPARTMENT (
    Dname VARCHAR(100) NOT NULL,
    Dnumber INT NOT NULL,
    Mgr_ssn CHAR(9),
    Mgr_start_date DATE
);
ALTER TABLE DEPARTMENT
ADD CONSTRAINT pk_department PRIMARY KEY (Dnumber),
CONSTRAINT unq_dept_name UNIQUE (Dname);
GO

-- Tạo bảng DEPT_LOCATIONS (Vị trí phòng ban)
CREATE TABLE DEPT_LOCATIONS (
    Dnumber INT NOT NULL,
    Dlocation VARCHAR(100) NOT NULL
);
ALTER TABLE DEPT_LOCATIONS
ADD CONSTRAINT pk_dept_locations PRIMARY KEY (Dnumber, Dlocation);
GO

-- Tạo bảng PROJECT (Dự án)
CREATE TABLE PROJECT (
    Pname VARCHAR(100) NOT NULL,
    Pnumber INT NOT NULL,
    Plocation VARCHAR(100),
    Dnum INT
);
ALTER TABLE PROJECT
ADD CONSTRAINT pk_project PRIMARY KEY (Pnumber),
CONSTRAINT unq_proj_name UNIQUE (Pname);
GO

-- Tạo bảng WORKS_ON (Làm việc cho dự án)
CREATE TABLE WORKS_ON (
    Essn CHAR(9) NOT NULL,
    Pno INT NOT NULL,
    Hours DECIMAL(4, 1)
);
ALTER TABLE WORKS_ON
ADD CONSTRAINT pk_works_on PRIMARY KEY (Essn, Pno);
GO

-- Tạo bảng DEPENDENT (Người phụ thuộc)
CREATE TABLE DEPENDENT (
    Essn CHAR(9) NOT NULL,
    Dependent_name VARCHAR(100) NOT NULL,
    Sex CHAR(1),
    Bdate DATE,
    Relationship VARCHAR(50)
);
ALTER TABLE DEPENDENT
ADD CONSTRAINT pk_dependent PRIMARY KEY (Essn, Dependent_name);
GO


-- ----------
-- PHẦN 2: THÊM CÁC RÀNG BUỘC KHÓA NGOẠI (FOREIGN KEYS)
-- ----------

-- Thêm các khóa ngoại cho bảng EMPLOYEE
ALTER TABLE EMPLOYEE
    ADD CONSTRAINT fk_emp_supervisor
    FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)
    ON DELETE NO ACTION ON UPDATE NO ACTION; -- Mặc định an toàn
    
ALTER TABLE EMPLOYEE
    ADD CONSTRAINT fk_emp_dept
    FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber)
    ON DELETE SET NULL ON UPDATE CASCADE;
GO

-- Thêm khóa ngoại cho bảng DEPARTMENT
ALTER TABLE DEPARTMENT
    ADD CONSTRAINT fk_dept_mgr
    FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn)
    ON DELETE NO ACTION ON UPDATE NO ACTION; -- Không thể xóa 1 nhân viên nếu họ đang là quản lý
GO

-- Thêm khóa ngoại cho bảng DEPT_LOCATIONS
ALTER TABLE DEPT_LOCATIONS
    ADD CONSTRAINT fk_deptloc_dept
    FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber)
    ON DELETE CASCADE ON UPDATE CASCADE; -- Nếu xóa phòng ban, xóa luôn location
GO

-- Thêm khóa ngoại cho bảng PROJECT
ALTER TABLE PROJECT
    ADD CONSTRAINT fk_proj_dept
    FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber)
    ON DELETE SET NULL ON UPDATE CASCADE; -- Nếu xóa phòng ban, dự án vẫn còn nhưng không thuộc phòng nào
GO

-- Thêm khóa ngoại cho bảng WORKS_ON
ALTER TABLE WORKS_ON
    ADD CONSTRAINT fk_workson_emp
    FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn)
    ON DELETE CASCADE ON UPDATE CASCADE; -- Nếu xóa nhân viên, xóa luôn các giờ làm việc
GO

-- ****** ĐÂY LÀ PHẦN ĐÃ SỬA LỖI ******
-- Chúng ta thay đổi 'ON DELETE CASCADE' thành 'ON DELETE NO ACTION'
-- để tránh xung đột với 'fk_workson_emp'
ALTER TABLE WORKS_ON
    ADD CONSTRAINT fk_workson_proj
    FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber)
    ON DELETE NO ACTION ON UPDATE NO ACTION; -- Sửa ở đây
GO
-- ****** KẾT THÚC PHẦN SỬA LỖI ******

-- Thêm khóa ngoại cho bảng DEPENDENT
ALTER TABLE DEPENDENT
    ADD CONSTRAINT fk_dep_emp
    FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn)
    ON DELETE CASCADE ON UPDATE CASCADE; -- Nếu xóa nhân viên, xóa luôn người phụ thuộc
GO