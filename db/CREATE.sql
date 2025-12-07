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

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* =============================================
   1. USER & AUTHENTICATION SYSTEM
   ============================================= */

-- Bảng gốc User (Superclass)
CREATE TABLE [User] (
    user_id_num INT IDENTITY(1,1),
    user_id AS CAST('USR' + RIGHT('0000' + CAST(user_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    birth_date DATE,
    avatar_url VARCHAR(255),
    time_created DATETIME2 DEFAULT GETDATE(),
    age AS (DATEDIFF(YEAR, birth_date, GETDATE()))
);
GO

-- Bảng Contact
CREATE TABLE Contact (
    contact_id_num INT IDENTITY(1,1),
    contact_id AS CAST('CNT' + RIGHT('0000' + CAST(contact_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Phones
CREATE TABLE Phones (
    phone_id_num INT IDENTITY(1,1),
    phone_id AS CAST('PHN' + RIGHT('0000' + CAST(phone_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    contact_id VARCHAR(20) NOT NULL,
    area_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (contact_id) REFERENCES Contact(contact_id) ON DELETE CASCADE
);
GO

-- Bảng Notification Options
CREATE TABLE Noti_options (
    user_id VARCHAR(20) NOT NULL,
    noti_option VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, noti_option),
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Member (Subclass của User)
CREATE TABLE Member (
    member_id VARCHAR(20) PRIMARY KEY, -- Matches User.user_id
    login_email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME2,
    status VARCHAR(20) NOT NULL CHECK (status IN ('invited', 'active', 'suspended')),
    FOREIGN KEY (member_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Monitor (Subclass của User)
CREATE TABLE Monitor (
    monitor_id VARCHAR(20) PRIMARY KEY, -- Matches User.user_id
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (monitor_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

-- Bảng Sessions
CREATE TABLE Sessions (
    session_id_num INT IDENTITY(1,1),
    session_id AS CAST('SES' + RIGHT('0000' + CAST(session_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    user_agent NVARCHAR(255),
    ip_address VARCHAR(45),
    expires_at DATETIME2 NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    is_revoked BIT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

/* =============================================
   2. WORKSPACE & ORGANIZATION
   ============================================= */

CREATE TABLE Workspace (
    workspace_id_num INT IDENTITY(1,1),
    workspace_id AS CAST('WSP' + RIGHT('0000' + CAST(workspace_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('public', 'private')),
    billing_plan VARCHAR(50) DEFAULT 'Free',
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    CHECK (time_created <= time_updated)
);
GO

CREATE TABLE Workspace_Member (
    workspace_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    joined_date DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (workspace_id, member_id),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE Workspace_Domains (
    domain_id_num INT IDENTITY(1,1),
    domain_id AS CAST('WSD' + RIGHT('0000' + CAST(domain_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    workspace_id VARCHAR(20) NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

CREATE TABLE Team (
    team_id_num INT IDENTITY(1,1),
    team_id AS CAST('TEM' + RIGHT('0000' + CAST(team_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    workspace_id VARCHAR(20) NOT NULL,
    manager_id VARCHAR(20),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES Member(member_id),
    CHECK (time_created <= time_updated)
);
GO

CREATE TABLE Team_Member (
    team_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (team_id, member_id),
    FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

/* =============================================
   3. BOARD SYSTEM
   ============================================= */

CREATE TABLE Board (
    board_id_num INT IDENTITY(1,1),
    board_id AS CAST('BRD' + RIGHT('0000' + CAST(board_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    workspace_id VARCHAR(20) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    visibility VARCHAR(20) CHECK (visibility IN ('workspace', 'private', 'public')),
    background_color VARCHAR(20),
    background_img VARCHAR(255),
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    CHECK (time_created <= time_updated)
);
GO

CREATE TABLE Board_Member (
    board_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    role VARCHAR(50), 
    PRIMARY KEY (board_id, member_id),
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE List (
    list_id_num INT IDENTITY(1,1),
    list_id AS CAST('LST' + RIGHT('0000' + CAST(list_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    board_id VARCHAR(20) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    position INT NOT NULL CHECK (position >= 0),
    time_created DATETIME2 DEFAULT GETDATE(),
    time_updated DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE,
    CONSTRAINT UQ_List_Position UNIQUE (board_id, position),
    CHECK (time_created <= time_updated)
);
GO

CREATE TABLE Card (
    card_id_num INT IDENTITY(1,1),
    card_id AS CAST('CRD' + RIGHT('0000' + CAST(card_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    list_id VARCHAR(20) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    position INT NOT NULL CHECK (position >= 0),
    priority_level VARCHAR(20) CHECK (priority_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    start_date DATETIME2,
    due_date DATETIME2,
    time_completed DATETIME2,
    time_created DATETIME2 DEFAULT GETDATE(),
    CHECK (time_created <= time_completed OR time_completed IS NULL),
    is_overdue AS (CASE WHEN due_date IS NOT NULL AND time_completed IS NULL AND due_date < GETDATE() THEN 1 ELSE 0 END),
    FOREIGN KEY (list_id) REFERENCES List(list_id) ON DELETE CASCADE,
    CONSTRAINT UQ_Card_Position UNIQUE (list_id, position)
);
GO

CREATE TABLE Card_Member (
    card_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (card_id, member_id),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

/* =============================================
   4. CARD DETAILS
   ============================================= */

CREATE TABLE Label (
    label_id_num INT IDENTITY(1,1),
    label_id AS CAST('LBL' + RIGHT('0000' + CAST(label_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    board_id VARCHAR(20) NOT NULL,
    name NVARCHAR(50),
    color VARCHAR(20) NOT NULL,
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE
);
GO

CREATE TABLE Card_Label (
    card_id VARCHAR(20) NOT NULL,
    label_id VARCHAR(20) NOT NULL,
    time_applied DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (card_id, label_id),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES Label(label_id)
);
GO

CREATE TABLE Checklist (
    checklist_id_num INT IDENTITY(1,1),
    checklist_id AS CAST('CHK' + RIGHT('0000' + CAST(checklist_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE
);
GO

CREATE TABLE ChecklistItem (
    item_id_num INT IDENTITY(1,1),
    item_id AS CAST('CHI' + RIGHT('0000' + CAST(item_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    checklist_id VARCHAR(20) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    is_completed BIT DEFAULT 0,
    position INT NOT NULL DEFAULT 0,
    FOREIGN KEY (checklist_id) REFERENCES Checklist(checklist_id) ON DELETE CASCADE
);
GO

CREATE TABLE Comment (
    comment_id_num INT IDENTITY(1,1),
    comment_id AS CAST('CMT' + RIGHT('0000' + CAST(comment_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    text NVARCHAR(MAX) NOT NULL,
    time_created DATETIME2 DEFAULT GETDATE(),
    is_edited BIT DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE Attachment (
    attachment_id_num INT IDENTITY(1,1),
    attachment_id AS CAST('ATT' + RIGHT('0000' + CAST(attachment_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_url VARCHAR(MAX) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    time_uploaded DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

/* =============================================
   5. ADVANCED FEATURES
   ============================================= */

CREATE TABLE CustomFieldDef (
    cfd_id_num INT IDENTITY(1,1),
    cfd_id AS CAST('CFD' + RIGHT('0000' + CAST(cfd_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    workspace_id VARCHAR(20) NOT NULL,
    field_name NVARCHAR(100) NOT NULL,
    field_type VARCHAR(20) NOT NULL CHECK (field_type IN ('Checkbox', 'Date', 'Number', 'Text', 'Dropdown')),
    default_value NVARCHAR(MAX),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

CREATE TABLE CustomFieldValue (
    value_id_num INT IDENTITY(1,1),
    value_id AS CAST('CFV' + RIGHT('0000' + CAST(value_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    cfd_id VARCHAR(20) NOT NULL,
    value NVARCHAR(MAX),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (cfd_id) REFERENCES CustomFieldDef(cfd_id)
);
GO

CREATE TABLE Activity (
    activity_id_num INT IDENTITY(1,1),
    activity_id AS CAST('ACT' + RIGHT('0000' + CAST(activity_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    detail NVARCHAR(MAX),
    time_created DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (card_id) REFERENCES Card(card_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
GO

CREATE TABLE AutomationRule (
    rule_id_num INT IDENTITY(1,1),
    rule_id AS CAST('AUT' + RIGHT('0000' + CAST(rule_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    workspace_id VARCHAR(20) NOT NULL,
    name NVARCHAR(100),
    trigger_condition NVARCHAR(MAX) NOT NULL,
    action_execution NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE
);
GO

CREATE TABLE [Log] (
    log_id_num INT IDENTITY(1,1),
    log_id AS CAST('LOG' + RIGHT('0000' + CAST(log_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    workspace_id VARCHAR(20) NOT NULL,
    actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('member', 'system', 'automation')),
    member_id VARCHAR(20) NULL,
    rule_id VARCHAR(20) NULL,
    action_summary NVARCHAR(255) NOT NULL,
    entity_affected NVARCHAR(100),
    time_created DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (rule_id) REFERENCES AutomationRule(rule_id)
);
GO

CREATE TABLE Notification (
    noti_id_num INT IDENTITY(1,1),
    noti_id AS CAST('NOT' + RIGHT('0000' + CAST(noti_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    receiver_id VARCHAR(20) NOT NULL,
    title NVARCHAR(255),
    message NVARCHAR(MAX),
    is_read BIT DEFAULT 0,
    time_delivered DATETIME2 DEFAULT GETDATE(),
    time_read DATETIME2,
    FOREIGN KEY (receiver_id) REFERENCES [User](user_id) ON DELETE CASCADE
);
GO

CREATE TABLE Invitation (
    invitation_id_num INT IDENTITY(1,1),
    invitation_id AS CAST('INV' + RIGHT('0000' + CAST(invitation_id_num AS VARCHAR(10)), 4) AS VARCHAR(20)) PERSISTED PRIMARY KEY,
    inviter_id VARCHAR(20) NOT NULL,
    email_target VARCHAR(255) NOT NULL,
    workspace_id VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    token VARCHAR(255) NOT NULL,
    time_created DATETIME2 DEFAULT GETDATE(),
    time_expired DATETIME2 DEFAULT DATEADD(day, 7, GETDATE()),
    FOREIGN KEY (inviter_id) REFERENCES Member(member_id),
    FOREIGN KEY (workspace_id) REFERENCES Workspace(workspace_id) ON DELETE CASCADE,
    CHECK (time_created <= time_expired)
);
GO
GO



-- Trigger: Set time_expired to 7 days from now on insert or update
CREATE TRIGGER Invitation_SetTimeExpired
ON Invitation
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE Invitation
    SET time_expired = DATEADD(day, 7, GETDATE())
    FROM Invitation i
    JOIN inserted ins ON i.invitation_id = ins.invitation_id;
END
GO


-- Trigger: Activate member if status is inactive after update
CREATE TRIGGER Member_Activate
ON Member
AFTER UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE status = 'inactive')
    BEGIN
        UPDATE m
        SET m.status = 'active'
        FROM Member m
        JOIN inserted i ON m.member_id = i.member_id
        WHERE i.status = 'inactive';
    END
END
GO


-- Procedure: Get members by status
CREATE PROCEDURE GetMembersByStatus
    @status VARCHAR(20),
    @member_count INT OUTPUT
AS
BEGIN
    SELECT m.member_id, m.login_email, m.status
    FROM Member m
    WHERE m.status = @status
    ORDER BY m.login_email;

    SELECT @member_count = COUNT(*)
    FROM Member m
    WHERE m.status = @status;
END
GO


-- Procedure: Get Member Count for Workspace having more than a specified number of members
CREATE PROCEDURE GetWorkspaceMemberCount
    @min_count INT
AS
BEGIN
    SELECT w.workspace_id, w.name, COUNT(wm.member_id) AS member_count
    FROM Workspace w
    JOIN Workspace_Member wm ON w.workspace_id = wm.workspace_id
    GROUP BY w.workspace_id, w.name
    HAVING COUNT(wm.member_id) > @min_count
    ORDER BY member_count DESC;
END
GO


-- Procedure: Get all members in a workspace
CREATE PROCEDURE GetAllMembersInWorkspace
    @workspace_id VARCHAR(20)
AS
BEGIN
    SELECT m.member_id, m.login_email, m.status
    FROM Member m
    JOIN Workspace_Member wm ON m.member_id = wm.member_id
    WHERE wm.workspace_id = @workspace_id
    ORDER BY m.login_email;
END
GO


-- Function: Calculate percent of completed checklist items in a workspace
CREATE FUNCTION GetWorkspaceCompletionPercent
(
    @workspace_id VARCHAR(20)
)
RETURNS FLOAT
AS
BEGIN
    DECLARE @total INT, @completed INT;

    SELECT @total = COUNT(ci.item_id)
    FROM ChecklistItem ci
    JOIN Checklist cl ON ci.checklist_id = cl.checklist_id
    WHERE cl.card_id IN (
        SELECT c.card_id
        FROM Card c
        JOIN List l ON c.list_id = l.list_id
        JOIN Board b ON l.board_id = b.board_id
        WHERE b.workspace_id = @workspace_id
    );

    SELECT @completed = COUNT(ci.item_id)
    FROM ChecklistItem ci
    JOIN Checklist cl ON ci.checklist_id = cl.checklist_id
    WHERE cl.card_id IN (
        SELECT c.card_id
        FROM Card c
        JOIN List l ON c.list_id = l.list_id
        JOIN Board b ON l.board_id = b.board_id
        WHERE b.workspace_id = @workspace_id
    )
    AND ci.is_completed = 1;

    IF @total = 0
        RETURN 0.0;
    RETURN (CAST(@completed AS FLOAT) / @total) * 100.0;
END
GO


-- Function: Get overdue cards count in a workspace
CREATE FUNCTION GetOverdueCardCountInWorkspace
(
    @workspace_id VARCHAR(20)
)
RETURNS INT
AS
BEGIN
    DECLARE @count INT;
    SELECT @count = COUNT(*)
    FROM Card c
    JOIN List l ON c.list_id = l.list_id
    WHERE l.board_id IN (SELECT board_id FROM Board WHERE workspace_id = @workspace_id)
      AND c.is_overdue = 1;
    RETURN @count;
END
GO
