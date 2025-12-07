-- Script to insert sample data into Brello database
-- Run this AFTER running CREATE.sql

USE Brello;
GO

-- 1. Insert Users and Members
DECLARE @UserIdNum INT;
DECLARE @User1Id VARCHAR(20);
DECLARE @User2Id VARCHAR(20);

-- User 1
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('john_doe', 'John', 'Doe', '1990-01-01', NULL);

SET @UserIdNum = SCOPE_IDENTITY();
SELECT @User1Id = user_id FROM [User] WHERE user_id_num = @UserIdNum;

INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User1Id, 'john@example.com', '$2b$10$DummyHashForJohnDoe1234567890', 'active');

-- User 2
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('jane_smith', 'Jane', 'Smith', '1992-05-15', NULL);

SET @UserIdNum = SCOPE_IDENTITY();
SELECT @User2Id = user_id FROM [User] WHERE user_id_num = @UserIdNum;

INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User2Id, 'jane@example.com', '$2b$10$DummyHashForJaneSmith1234567890', 'active');

PRINT 'Users created: ' + @User1Id + ', ' + @User2Id;

-- 2. Insert Workspace
DECLARE @WorkspaceIdNum INT;
DECLARE @WorkspaceId VARCHAR(20);

INSERT INTO Workspace (name, description, visibility, billing_plan)
VALUES ('Engineering Team', 'Workspace for the engineering department', 'private', 'Free');

SET @WorkspaceIdNum = SCOPE_IDENTITY();
SELECT @WorkspaceId = workspace_id FROM Workspace WHERE workspace_id_num = @WorkspaceIdNum;

PRINT 'Workspace created: ' + @WorkspaceId;

-- Add Members to Workspace
INSERT INTO Workspace_Member (workspace_id, member_id, role)
VALUES (@WorkspaceId, @User1Id, 'Admin');

INSERT INTO Workspace_Member (workspace_id, member_id, role)
VALUES (@WorkspaceId, @User2Id, 'Member');

-- 3. Insert Board
DECLARE @BoardIdNum INT;
DECLARE @BoardId VARCHAR(20);

INSERT INTO Board (workspace_id, name, description, visibility, background_color)
VALUES (@WorkspaceId, 'Project Alpha', 'Main project board', 'workspace', '#0079bf');

SET @BoardIdNum = SCOPE_IDENTITY();
SELECT @BoardId = board_id FROM Board WHERE board_id_num = @BoardIdNum;

PRINT 'Board created: ' + @BoardId;

-- Add Members to Board
INSERT INTO Board_Member (board_id, member_id, role)
VALUES (@BoardId, @User1Id, 'Admin');

INSERT INTO Board_Member (board_id, member_id, role)
VALUES (@BoardId, @User2Id, 'Member');

-- 4. Insert Lists
DECLARE @ListIdNum INT;
DECLARE @ListToDoId VARCHAR(20);
DECLARE @ListDoingId VARCHAR(20);
DECLARE @ListDoneId VARCHAR(20);

-- To Do
INSERT INTO List (board_id, name, position)
VALUES (@BoardId, 'To Do', 0);
SET @ListIdNum = SCOPE_IDENTITY();
SELECT @ListToDoId = list_id FROM List WHERE list_id_num = @ListIdNum;

-- Doing
INSERT INTO List (board_id, name, position)
VALUES (@BoardId, 'Doing', 1);
SET @ListIdNum = SCOPE_IDENTITY();
SELECT @ListDoingId = list_id FROM List WHERE list_id_num = @ListIdNum;

-- Done
INSERT INTO List (board_id, name, position)
VALUES (@BoardId, 'Done', 2);
SET @ListIdNum = SCOPE_IDENTITY();
SELECT @ListDoneId = list_id FROM List WHERE list_id_num = @ListIdNum;

PRINT 'Lists created: ' + @ListToDoId + ', ' + @ListDoingId + ', ' + @ListDoneId;

-- 5. Insert Cards
DECLARE @CardIdNum INT;
DECLARE @CardId VARCHAR(20);

-- Card 1 in To Do
INSERT INTO Card (list_id, name, description, position, priority_level)
VALUES (@ListToDoId, 'Setup Database', 'Create tables and relationships', 0, 'high');

SET @CardIdNum = SCOPE_IDENTITY();
SELECT @CardId = card_id FROM Card WHERE card_id_num = @CardIdNum;

PRINT 'Card created: ' + @CardId;

-- Assign Member to Card
INSERT INTO Card_Member (card_id, member_id)
VALUES (@CardId, @User1Id);

-- Card 2 in Doing
INSERT INTO Card (list_id, name, description, position, priority_level)
VALUES (@ListDoingId, 'Develop API', 'Implement REST endpoints', 0, 'medium');

SET @CardIdNum = SCOPE_IDENTITY();
SELECT @CardId = card_id FROM Card WHERE card_id_num = @CardIdNum;

PRINT 'Card created: ' + @CardId;

-- 6. Insert Comment
INSERT INTO Comment (card_id, user_id, content)
VALUES (@CardId, @User2Id, 'Looking good, keep it up!');

PRINT 'Sample data insertion complete.';
GO
