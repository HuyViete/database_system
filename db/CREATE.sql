-- Tạo Database
USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'Brello')
    DROP DATABASE Brello;
GO

CREATE DATABASE Brello;
GO

USE Brello;
GO

/* =============================================
   1. USER & AUTHENTICATION SYSTEM
   ============================================= */

-- Bảng gốc User (Superclass)
CREATE TABLE [User] (
    user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    birth_date DATE,
    avatar_url VARCHAR(255), -- HTTPS URL constraint enforced by app logic
    time_created DATETIME2 DEFAULT GETDATE(),
    -- Computed column for Age
    age AS (DATEDIFF(YEAR, birth_date, GETDATE()))
);
GO

-- Bảng Contact (Tách ra theo thiết kế, quan hệ 1-1 với User)
CREATE TABLE Contact (
    contact_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL UNIQUE, -- 1 User có 1 Contact
    contact_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Phones (Multivalued attribute của Contact)
CREATE TABLE Phones (
    phone_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contact_id UNIQUEIDENTIFIER NOT NULL,
    area_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (contact_id) REFERENCES Contact(contact_id) ON DELETE CASCADE
);
GO

-- Bảng Notification Options
CREATE TABLE Noti_options (
    user_id UNIQUEIDENTIFIER NOT NULL,
    noti_option VARCHAR(50) NOT NULL, -- Ví dụ: 'Email', 'Push', 'SMS'
    PRIMARY KEY (user_id, noti_option),
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Member (Subclass của User)
CREATE TABLE Member (
    member_id UNIQUEIDENTIFIER PRIMARY KEY, -- Share PK with User
    login_email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME2,
    status VARCHAR(20) NOT NULL CHECK (status IN ('invited', 'active', 'suspended')),
    FOREIGN KEY (member_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Monitor (Subclass của User - View Only)
CREATE TABLE Monitor (
    monitor_id UNIQUEIDENTIFIER PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (monitor_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Sessions (Quản lý phiên đăng nhập)
CREATE TABLE Sessions (
    session_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    refresh_token VARCHAR(500) NOT NULL, -- Token dài
    user_agent NVARCHAR(255), -- Thông tin thiết bị/trình duyệt
    ip_address VARCHAR(45), -- IPv4 hoặc IPv6
    expires_at DATETIME2 NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    is_revoked BIT DEFAULT 0, -- Đánh dấu token đã bị hủy
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

/* =============================================
   2. WORKSPACE & ORGANIZATION
   ============================================= */

CREATE TABLE Workspace (
    workspace_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('public', 'private')),
    billing_plan VARCHAR(50) DEFAULT 'Free',
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    -- Constraint: time_created < time_updated
    CHECK (time_created <= time_updated)
);
GO

-- Quan hệ N-N: User là thành viên của Workspace
CREATE TABLE Workspace_Member (
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    joined_date DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (workspace_id, member_id),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id) -- No Cascade here to preserve User history
);
GO

-- Domains cho Workspace (Authorized email domains)
CREATE TABLE Workspace_Domains (
    domain_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

-- Teams (Nhóm trong Workspace)
CREATE TABLE Team (
    team_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    manager_id UNIQUEIDENTIFIER, -- Manager của team
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE Team_Member (
    team_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (team_id, member_id),
    FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

/* =============================================
   3. BOARD SYSTEM (Board -> List -> Card)
   ============================================= */

CREATE TABLE Board (
    board_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    visibility VARCHAR(20) CHECK (visibility IN ('workspace', 'private', 'public')),
    background_color VARCHAR(20),
    background_img VARCHAR(255),
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

-- Thành viên của Board (Quyền truy cập cụ thể)
CREATE TABLE Board_Member (
    board_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL,
    role VARCHAR(50), 
    PRIMARY KEY (board_id, member_id),
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE List (
    list_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    board_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(100) NOT NULL,
    position INT NOT NULL CHECK (position >= 0), -- Positive
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE,
    -- Unique position within a board
    CONSTRAINT UQ_List_Position UNIQUE (board_id, position)
);
GO

CREATE TABLE Card (
    card_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    list_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    position INT NOT NULL CHECK (position >= 0),
    priority_level VARCHAR(20) CHECK (priority_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    start_date DATETIME2,
    due_date DATETIME2,
    time_completed DATETIME2,
    time_created DATETIME2 DEFAULT GETDATE(),
    
    -- Derived attribute: is_overdue
    -- Logic: Quá hạn nếu có due_date, chưa hoàn thành, và due_date nhỏ hơn hiện tại
    is_overdue AS (CASE WHEN due_date IS NOT NULL AND time_completed IS NULL AND due_date < GETDATE() THEN 1 ELSE 0 END),

    FOREIGN KEY (list_id) REFERENCES List(list_id) ON DELETE CASCADE,
    -- Unique position within a list
    CONSTRAINT UQ_Card_Position UNIQUE (list_id, position)
);
GO

-- Phân công Member vào Card
CREATE TABLE Card_Member (
    card_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (card_id, member_id),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

/* =============================================
   4. CARD DETAILS (Label, Checklist, Comment, Attachments)
   ============================================= */

CREATE TABLE Label (
    label_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    board_id UNIQUEIDENTIFIER NOT NULL, -- Label thường gắn với Board để tái sử dụng
    name NVARCHAR(50),
    color VARCHAR(20) NOT NULL,
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE
);
GO

CREATE TABLE Card_Label (
    card_id UNIQUEIDENTIFIER NOT NULL,
    label_id UNIQUEIDENTIFIER NOT NULL,
    time_applied DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (card_id, label_id),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES Label(label_id) -- No cascade delete label if card deleted
);
GO

CREATE TABLE Checklist (
    checklist_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    card_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(100) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE
);
GO

CREATE TABLE ChecklistItem (
    item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    checklist_id UNIQUEIDENTIFIER NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    is_completed BIT DEFAULT 0,
    position INT NOT NULL DEFAULT 0,
    FOREIGN KEY (checklist_id) REFERENCES Checklist(checklist_id) ON DELETE CASCADE
);
GO

CREATE TABLE Comment (
    comment_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    card_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL,
    text NVARCHAR(MAX) NOT NULL,
    time_created DATETIME2 DEFAULT GETDATE(),
    is_edited BIT DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE Attachment (
    attachment_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    card_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL, -- Người upload
    file_name NVARCHAR(255) NOT NULL,
    file_url VARCHAR(MAX) NOT NULL,
    file_size BIGINT, -- Bytes
    file_type VARCHAR(50), -- MIME type
    time_uploaded DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

/* =============================================
   5. ADVANCED FEATURES (Custom Fields, Automation, Logs)
   ============================================= */

CREATE TABLE CustomFieldDef (
    cfd_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    field_name NVARCHAR(100) NOT NULL,
    field_type VARCHAR(20) NOT NULL CHECK (field_type IN ('Checkbox', 'Date', 'Number', 'Text', 'Dropdown')),
    default_value NVARCHAR(MAX),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

CREATE TABLE CustomFieldValue (
    value_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    card_id UNIQUEIDENTIFIER NOT NULL,
    cfd_id UNIQUEIDENTIFIER NOT NULL,
    value NVARCHAR(MAX),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (cfd_id) REFERENCES CustomFieldDef(cfd_id) -- No cascade
);
GO

-- Activity Log (Kết hợp Member_Activity và Activity vào một để tối ưu)
CREATE TABLE Activity (
    activity_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    card_id UNIQUEIDENTIFIER NOT NULL,
    member_id UNIQUEIDENTIFIER NOT NULL, -- Actor
    action_type VARCHAR(50) NOT NULL, -- e.g., 'moved_card', 'commented'
    detail NVARCHAR(MAX),
    time_created DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE AutomationRule (
    rule_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(100),
    trigger_condition NVARCHAR(MAX) NOT NULL,
    action_execution NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

-- Log hệ thống (Audit Trail)
CREATE TABLE [Log] (
    log_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('member', 'system', 'automation')),
    
    -- Nullable FKs to handle Polymorphism
    member_id UNIQUEIDENTIFIER NULL,
    rule_id UNIQUEIDENTIFIER NULL,
    
    action_summary NVARCHAR(255) NOT NULL,
    entity_affected NVARCHAR(100),
    time_created DATETIME2 DEFAULT GETDATE(),

    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (rule_id) REFERENCES AutomationRule(rule_id)
);
GO

CREATE TABLE Notification (
    noti_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    receiver_id UNIQUEIDENTIFIER NOT NULL, -- User nhận
    title NVARCHAR(255),
    message NVARCHAR(MAX),
    is_read BIT DEFAULT 0,
    time_delivered DATETIME2 DEFAULT GETDATE(),
    time_read DATETIME2,
    FOREIGN KEY (receiver_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

CREATE TABLE Invitation (
    invitation_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    inviter_id UNIQUEIDENTIFIER NOT NULL,
    email_target VARCHAR(255) NOT NULL,
    workspace_id UNIQUEIDENTIFIER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    token VARCHAR(255) NOT NULL,
    time_created DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (inviter_id) REFERENCES Member(member_id),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO