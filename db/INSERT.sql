-- Script to insert sample data into Brello database
-- Run this AFTER running CREATE.sql

USE Brello;
GO

-- =============================================
-- 1. USERS & MEMBERS
-- =============================================
DECLARE @UserIdNum INT;
DECLARE @User1Id VARCHAR(20); -- John Doe (Admin)
DECLARE @User2Id VARCHAR(20); -- Jane Smith (Member)
DECLARE @User3Id VARCHAR(20); -- Monitor User
DECLARE @User4Id VARCHAR(20); -- Inactive User

-- User 1: John Doe
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('john_doe', 'John', 'Doe', '1990-01-01', 'https://example.com/avatar1.png');
SET @UserIdNum = SCOPE_IDENTITY();
SELECT @User1Id = user_id FROM [User] WHERE user_id_num = @UserIdNum;

INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User1Id, 'john@example.com', '$2b$10$DummyHashForJohnDoe1234567890', 'active');

-- User 2: Jane Smith
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('jane_smith', 'Jane', 'Smith', '1992-05-15', NULL);
SET @UserIdNum = SCOPE_IDENTITY();
SELECT @User2Id = user_id FROM [User] WHERE user_id_num = @UserIdNum;

INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User2Id, 'jane@example.com', '$2b$10$DummyHashForJaneSmith1234567890', 'active');

-- User 3: Monitor User
INSERT INTO [User] (username, first_name, last_name, birth_date)
VALUES ('monitor_bot', 'System', 'Monitor', '2020-01-01');
SET @UserIdNum = SCOPE_IDENTITY();
SELECT @User3Id = user_id FROM [User] WHERE user_id_num = @UserIdNum;

INSERT INTO Monitor (monitor_id, token)
VALUES (@User3Id, 'MONITOR_TOKEN_XYZ_123');

-- User 4: Inactive User
INSERT INTO [User] (username, first_name, last_name, birth_date)
VALUES ('inactive_user', 'Lazy', 'User', '1995-08-20');
SET @UserIdNum = SCOPE_IDENTITY();
SELECT @User4Id = user_id FROM [User] WHERE user_id_num = @UserIdNum;

INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User4Id, 'lazy@example.com', '$2b$10$DummyHashForLazyUser1234567890', 'suspended');

PRINT 'Users created: ' + @User1Id + ', ' + @User2Id + ', ' + @User3Id + ', ' + @User4Id;

-- Contact Info for User 1
DECLARE @ContactIdNum INT;
DECLARE @ContactId VARCHAR(20);
INSERT INTO Contact (user_id, contact_email) VALUES (@User1Id, 'john.contact@gmail.com');
SET @ContactIdNum = SCOPE_IDENTITY();
SELECT @ContactId = contact_id FROM Contact WHERE contact_id_num = @ContactIdNum;

INSERT INTO Phones (contact_id, area_code, phone_number) VALUES (@ContactId, '+1', '555-0101');
INSERT INTO Phones (contact_id, area_code, phone_number) VALUES (@ContactId, '+1', '555-0102');

-- Notification Options for User 1
INSERT INTO Noti_options (user_id, noti_option) VALUES (@User1Id, 'Email');
INSERT INTO Noti_options (user_id, noti_option) VALUES (@User1Id, 'Push');

-- =============================================
-- 2. WORKSPACES & TEAMS
-- =============================================
DECLARE @WorkspaceIdNum INT;
DECLARE @Workspace1Id VARCHAR(20); -- Engineering (Private)
DECLARE @Workspace2Id VARCHAR(20); -- Marketing (Public)

-- Workspace 1
INSERT INTO Workspace (name, description, visibility, billing_plan)
VALUES ('Engineering Team', 'Workspace for the engineering department', 'private', 'Free');
SET @WorkspaceIdNum = SCOPE_IDENTITY();
SELECT @Workspace1Id = workspace_id FROM Workspace WHERE workspace_id_num = @WorkspaceIdNum;

INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace1Id, @User1Id, 'Admin');
INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace1Id, @User2Id, 'Member');

-- Workspace 2
INSERT INTO Workspace (name, description, visibility, billing_plan)
VALUES ('Marketing Team', 'Public marketing materials', 'public', 'Pro');
SET @WorkspaceIdNum = SCOPE_IDENTITY();
SELECT @Workspace2Id = workspace_id FROM Workspace WHERE workspace_id_num = @WorkspaceIdNum;

INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace2Id, @User1Id, 'Member');

-- Workspace Domains
INSERT INTO Workspace_Domains (workspace_id, domain_name) VALUES (@Workspace1Id, 'engineering.brello.com');

-- Teams
DECLARE @TeamIdNum INT;
DECLARE @TeamId VARCHAR(20);
INSERT INTO Team (workspace_id, manager_id, name, description)
VALUES (@Workspace1Id, @User1Id, 'Backend Devs', 'Core backend team');
SET @TeamIdNum = SCOPE_IDENTITY();
SELECT @TeamId = team_id FROM Team WHERE team_id_num = @TeamIdNum;

INSERT INTO Team_Member (team_id, member_id) VALUES (@TeamId, @User1Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@TeamId, @User2Id);

PRINT 'Workspaces created: ' + @Workspace1Id + ', ' + @Workspace2Id;

-- =============================================
-- 3. BOARDS
-- =============================================
DECLARE @BoardIdNum INT;
DECLARE @Board1Id VARCHAR(20); -- Project Alpha (Workspace)
DECLARE @Board2Id VARCHAR(20); -- Ideas (Public)

-- Board 1
INSERT INTO Board (workspace_id, name, description, visibility, background_color)
VALUES (@Workspace1Id, 'Project Alpha', 'Main project board', 'workspace', '#0079bf');
SET @BoardIdNum = SCOPE_IDENTITY();
SELECT @Board1Id = board_id FROM Board WHERE board_id_num = @BoardIdNum;

INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board1Id, @User1Id, 'Admin');
INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board1Id, @User2Id, 'Member');

-- Board 2
INSERT INTO Board (workspace_id, name, description, visibility, background_color)
VALUES (@Workspace1Id, 'Ideas', 'Brainstorming', 'public', '#ff9f1a');
SET @BoardIdNum = SCOPE_IDENTITY();
SELECT @Board2Id = board_id FROM Board WHERE board_id_num = @BoardIdNum;

INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board2Id, @User1Id, 'Admin');

PRINT 'Boards created: ' + @Board1Id + ', ' + @Board2Id;

-- =============================================
-- 4. LISTS & CARDS
-- =============================================
DECLARE @ListIdNum INT;
DECLARE @ListToDoId VARCHAR(20);
DECLARE @ListDoingId VARCHAR(20);
DECLARE @ListDoneId VARCHAR(20);

-- Lists for Board 1
INSERT INTO List (board_id, name, position) VALUES (@Board1Id, 'To Do', 0);
SET @ListIdNum = SCOPE_IDENTITY();
SELECT @ListToDoId = list_id FROM List WHERE list_id_num = @ListIdNum;

INSERT INTO List (board_id, name, position) VALUES (@Board1Id, 'Doing', 1);
SET @ListIdNum = SCOPE_IDENTITY();
SELECT @ListDoingId = list_id FROM List WHERE list_id_num = @ListIdNum;

INSERT INTO List (board_id, name, position) VALUES (@Board1Id, 'Done', 2);
SET @ListIdNum = SCOPE_IDENTITY();
SELECT @ListDoneId = list_id FROM List WHERE list_id_num = @ListIdNum;

-- Cards
DECLARE @CardIdNum INT;
DECLARE @Card1Id VARCHAR(20);
DECLARE @Card2Id VARCHAR(20);
DECLARE @Card3Id VARCHAR(20);

-- Card 1: High Priority
INSERT INTO Card (list_id, name, description, position, priority_level, due_date)
VALUES (@ListToDoId, 'Setup Database', 'Create tables', 0, 'high', DATEADD(day, 2, GETDATE()));
SET @CardIdNum = SCOPE_IDENTITY();
SELECT @Card1Id = card_id FROM Card WHERE card_id_num = @CardIdNum;
INSERT INTO Card_Member (card_id, member_id) VALUES (@Card1Id, @User1Id);

-- Card 2: Medium Priority
INSERT INTO Card (list_id, name, description, position, priority_level)
VALUES (@ListDoingId, 'Develop API', 'REST endpoints', 0, 'medium');
SET @CardIdNum = SCOPE_IDENTITY();
SELECT @Card2Id = card_id FROM Card WHERE card_id_num = @CardIdNum;

-- Card 3: Overdue
INSERT INTO Card (list_id, name, description, position, priority_level, due_date)
VALUES (@ListToDoId, 'Legacy Migration', 'Should have been done', 1, 'critical', DATEADD(day, -5, GETDATE()));
SET @CardIdNum = SCOPE_IDENTITY();
SELECT @Card3Id = card_id FROM Card WHERE card_id_num = @CardIdNum;

PRINT 'Cards created: ' + @Card1Id + ', ' + @Card2Id + ', ' + @Card3Id;

-- =============================================
-- 5. CARD DETAILS (Labels, Checklists, Comments)
-- =============================================

-- Labels
DECLARE @LabelIdNum INT;
DECLARE @LabelBugId VARCHAR(20);
INSERT INTO Label (board_id, name, color) VALUES (@Board1Id, 'Bug', 'red');
SET @LabelIdNum = SCOPE_IDENTITY();
SELECT @LabelBugId = label_id FROM Label WHERE label_id_num = @LabelIdNum;

INSERT INTO Card_Label (card_id, label_id) VALUES (@Card1Id, @LabelBugId);

-- Checklists
DECLARE @ChecklistIdNum INT;
DECLARE @ChecklistId VARCHAR(20);
INSERT INTO Checklist (card_id, name) VALUES (@Card1Id, 'Requirements');
SET @ChecklistIdNum = SCOPE_IDENTITY();
SELECT @ChecklistId = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistIdNum;

INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistId, 'Design Schema', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistId, 'Write SQL', 0);

-- Comments
INSERT INTO Comment (card_id, member_id, text) VALUES (@Card1Id, @User2Id, 'Looking good!');
INSERT INTO Comment (card_id, member_id, text) VALUES (@Card3Id, @User1Id, 'This is late!');

-- Attachments
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type)
VALUES (@Card1Id, @User1Id, 'schema.png', 'https://example.com/schema.png', 'image/png');

-- =============================================
-- 6. ADVANCED FEATURES
-- =============================================

-- Custom Fields
DECLARE @CfdIdNum INT;
DECLARE @CfdId VARCHAR(20);
INSERT INTO CustomFieldDef (workspace_id, field_name, field_type)
VALUES (@Workspace1Id, 'Estimated Hours', 'Number');
SET @CfdIdNum = SCOPE_IDENTITY();
SELECT @CfdId = cfd_id FROM CustomFieldDef WHERE cfd_id_num = @CfdIdNum;

INSERT INTO CustomFieldValue (card_id, cfd_id, value) VALUES (@Card1Id, @CfdId, '5');

-- Automation Rules
INSERT INTO AutomationRule (workspace_id, name, trigger_condition, action_execution)
VALUES (@Workspace1Id, 'Auto-Move', 'When card completed', 'Move to Done list');

-- Notifications
INSERT INTO Notification (receiver_id, title, message)
VALUES (@User1Id, 'Welcome', 'Welcome to Brello!');

-- Invitations
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token)
VALUES (@User1Id, 'newuser@example.com', @Workspace1Id, 'INVITE_TOKEN_123');

PRINT 'Full sample data insertion complete.';
GO
