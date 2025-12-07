-- Script to insert sample data into Brello database
-- Run this AFTER running CREATE.sql

USE Brello;

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
-- =============================================
-- 7. ADDITIONAL SAMPLE DATA
-- =============================================

-- Add a fifth user
DECLARE @User5IdNum INT;
DECLARE @User5Id VARCHAR(20);
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('emma_jones', 'Emma', 'Jones', '1988-03-12', 'https://example.com/avatar5.png');
SET @User5IdNum = SCOPE_IDENTITY();
SELECT @User5Id = user_id FROM [User] WHERE user_id_num = @User5IdNum;
INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User5Id, 'emma@example.com', '$2b$10$DummyHashForEmmaJones1234567890', 'active');

-- Add Emma to Engineering workspace
INSERT INTO Workspace_Member (workspace_id, member_id, role)
VALUES (@Workspace1Id, @User5Id, 'Member');

-- Add Emma to Backend Devs team
INSERT INTO Team_Member (team_id, member_id)
VALUES (@TeamId, @User5Id);

-- Add Emma to Project Alpha board
INSERT INTO Board_Member (board_id, member_id, role)
VALUES (@Board1Id, @User5Id, 'Member');

-- Add a new list to Board 2
DECLARE @ListIdeasIdNum INT;
DECLARE @ListIdeasId VARCHAR(20);
INSERT INTO List (board_id, name, position)
VALUES (@Board2Id, 'Ideas', 0);
SET @ListIdeasIdNum = SCOPE_IDENTITY();
SELECT @ListIdeasId = list_id FROM List WHERE list_id_num = @ListIdeasIdNum;

-- Add a card to the new list
DECLARE @CardIdeasIdNum INT;
DECLARE @CardIdeasId VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level)
VALUES (@ListIdeasId, 'New Feature', 'Propose a new feature', 0, 'medium');
SET @CardIdeasIdNum = SCOPE_IDENTITY();
SELECT @CardIdeasId = card_id FROM Card WHERE card_id_num = @CardIdeasIdNum;

-- Assign Emma to the new card
INSERT INTO Card_Member (card_id, member_id)
VALUES (@CardIdeasId, @User5Id);

-- Add a label to Board 2
DECLARE @LabelFeatureIdNum INT;
DECLARE @LabelFeatureId VARCHAR(20);
INSERT INTO Label (board_id, name, color)
VALUES (@Board2Id, 'Feature', 'blue');
SET @LabelFeatureIdNum = SCOPE_IDENTITY();
SELECT @LabelFeatureId = label_id FROM Label WHERE label_id_num = @LabelFeatureIdNum;
INSERT INTO Card_Label (card_id, label_id)
VALUES (@CardIdeasId, @LabelFeatureId);

-- Add a checklist to the new card
DECLARE @ChecklistIdeasIdNum INT;
DECLARE @ChecklistIdeasId VARCHAR(20);
INSERT INTO Checklist (card_id, name)
VALUES (@CardIdeasId, 'Feature Steps');
SET @ChecklistIdeasIdNum = SCOPE_IDENTITY();
SELECT @ChecklistIdeasId = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistIdeasIdNum;
INSERT INTO ChecklistItem (checklist_id, description, is_completed)
VALUES (@ChecklistIdeasId, 'Draft proposal', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed)
VALUES (@ChecklistIdeasId, 'Review with team', 0);

-- Add comments to the new card
INSERT INTO Comment (card_id, member_id, text)
VALUES (@CardIdeasId, @User5Id, 'I think this feature will be great!');
INSERT INTO Comment (card_id, member_id, text)
VALUES (@CardIdeasId, @User1Id, 'Let''s discuss in the next meeting.');

-- Add an attachment to the new card
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type)
VALUES (@CardIdeasId, @User5Id, 'feature_spec.pdf', 'https://example.com/feature_spec.pdf', 'application/pdf');

-- Add a custom field value to the new card
INSERT INTO CustomFieldValue (card_id, cfd_id, value)
VALUES (@CardIdeasId, @CfdId, '8');

-- Add a notification for Emma
INSERT INTO Notification (receiver_id, title, message)
VALUES (@User5Id, 'Welcome', 'Welcome to Brello, Emma!');

-- Add an invitation for Emma to Marketing workspace
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token)
VALUES (@User1Id, 'emma.jones@example.com', @Workspace2Id, 'INVITE_TOKEN_456');

PRINT 'Additional sample data insertion complete.';
-- =============================================
-- 8. EVEN MORE SAMPLE DATA
-- =============================================

-- Add a sixth user
DECLARE @User6IdNum INT;
DECLARE @User6Id VARCHAR(20);
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('lucas_chen', 'Lucas', 'Chen', '1993-11-05', 'https://example.com/avatar6.png');
SET @User6IdNum = SCOPE_IDENTITY();
SELECT @User6Id = user_id FROM [User] WHERE user_id_num = @User6IdNum;
INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User6Id, 'lucas@example.com', '$2b$10$DummyHashForLucasChen1234567890', 'active');

-- Add Lucas to Engineering workspace and Backend Devs team
INSERT INTO Workspace_Member (workspace_id, member_id, role)
VALUES (@Workspace1Id, @User6Id, 'Member');
INSERT INTO Team_Member (team_id, member_id)
VALUES (@TeamId, @User6Id);
INSERT INTO Board_Member (board_id, member_id, role)
VALUES (@Board1Id, @User6Id, 'Member');

-- Add a new workspace
DECLARE @Workspace3IdNum INT;
DECLARE @Workspace3Id VARCHAR(20);
INSERT INTO Workspace (name, description, visibility, billing_plan)
VALUES ('Design Team', 'Workspace for designers', 'private', 'Pro');
SET @Workspace3IdNum = SCOPE_IDENTITY();
SELECT @Workspace3Id = workspace_id FROM Workspace WHERE workspace_id_num = @Workspace3IdNum;
INSERT INTO Workspace_Member (workspace_id, member_id, role)
VALUES (@Workspace3Id, @User5Id, 'Admin');
INSERT INTO Workspace_Member (workspace_id, member_id, role)
VALUES (@Workspace3Id, @User6Id, 'Member');

-- Add a new board to Design Team
DECLARE @Board3IdNum INT;
DECLARE @Board3Id VARCHAR(20);
INSERT INTO Board (workspace_id, name, description, visibility, background_color)
VALUES (@Workspace3Id, 'UI Overhaul', 'Redesign the app UI', 'private', '#00c2e0');
SET @Board3IdNum = SCOPE_IDENTITY();
SELECT @Board3Id = board_id FROM Board WHERE board_id_num = @Board3IdNum;
INSERT INTO Board_Member (board_id, member_id, role)
VALUES (@Board3Id, @User5Id, 'Admin');
INSERT INTO Board_Member (board_id, member_id, role)
VALUES (@Board3Id, @User6Id, 'Member');

-- Add lists to the new board
DECLARE @ListDesignIdNum INT;
DECLARE @ListDesignId VARCHAR(20);
INSERT INTO List (board_id, name, position)
VALUES (@Board3Id, 'Design', 0);
SET @ListDesignIdNum = SCOPE_IDENTITY();
SELECT @ListDesignId = list_id FROM List WHERE list_id_num = @ListDesignIdNum;
DECLARE @ListReviewDesignIdNum INT;
DECLARE @ListReviewDesignId VARCHAR(20);
INSERT INTO List (board_id, name, position)
VALUES (@Board3Id, 'Review', 1);
SET @ListReviewDesignIdNum = SCOPE_IDENTITY();
SELECT @ListReviewDesignId = list_id FROM List WHERE list_id_num = @ListReviewDesignIdNum;

-- Add cards to the new lists
DECLARE @CardDesignIdNum INT;
DECLARE @CardDesignId VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level)
VALUES (@ListDesignId, 'Create Wireframes', 'Initial wireframe sketches', 0, 'high');
SET @CardDesignIdNum = SCOPE_IDENTITY();
SELECT @CardDesignId = card_id FROM Card WHERE card_id_num = @CardDesignIdNum;
INSERT INTO Card_Member (card_id, member_id)
VALUES (@CardDesignId, @User5Id);

DECLARE @CardReviewDesignIdNum INT;
DECLARE @CardReviewDesignId VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level)
VALUES (@ListReviewDesignId, 'Review Wireframes', 'Team review of wireframes', 0, 'medium');
SET @CardReviewDesignIdNum = SCOPE_IDENTITY();
SELECT @CardReviewDesignId = card_id FROM Card WHERE card_id_num = @CardReviewDesignIdNum;
INSERT INTO Card_Member (card_id, member_id)
VALUES (@CardReviewDesignId, @User6Id);

-- Add comments to the new cards
INSERT INTO Comment (card_id, member_id, text)
VALUES (@CardDesignId, @User5Id, 'Wireframes ready for review.');
INSERT INTO Comment (card_id, member_id, text)
VALUES (@CardReviewDesignId, @User6Id, 'Reviewed and looks good.');

-- Add attachments to the new cards
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type)
VALUES (@CardDesignId, @User5Id, 'wireframes.pdf', 'https://example.com/wireframes.pdf', 'application/pdf');
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type)
VALUES (@CardReviewDesignId, @User6Id, 'review_notes.txt', 'https://example.com/review_notes.txt', 'text/plain');

-- Add a label to the new board
DECLARE @LabelDesignIdNum INT;
DECLARE @LabelDesignId VARCHAR(20);
INSERT INTO Label (board_id, name, color)
VALUES (@Board3Id, 'Design', 'purple');
SET @LabelDesignIdNum = SCOPE_IDENTITY();
SELECT @LabelDesignId = label_id FROM Label WHERE label_id_num = @LabelDesignIdNum;
INSERT INTO Card_Label (card_id, label_id)
VALUES (@CardDesignId, @LabelDesignId);

-- Add a checklist to the new card
DECLARE @ChecklistDesignIdNum INT;
DECLARE @ChecklistDesignId VARCHAR(20);
INSERT INTO Checklist (card_id, name)
VALUES (@CardDesignId, 'Wireframe Steps');
SET @ChecklistDesignIdNum = SCOPE_IDENTITY();
SELECT @ChecklistDesignId = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistDesignIdNum;
INSERT INTO ChecklistItem (checklist_id, description, is_completed)
VALUES (@ChecklistDesignId, 'Sketch main screens', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed)
VALUES (@ChecklistDesignId, 'Get feedback', 0);

-- Add a custom field value to the new card
INSERT INTO CustomFieldValue (card_id, cfd_id, value)
VALUES (@CardDesignId, @CfdId, '12');

-- Add a notification for Lucas
INSERT INTO Notification (receiver_id, title, message)
VALUES (@User6Id, 'Welcome', 'Welcome to Brello, Lucas!');

-- Add an invitation for Lucas to Design Team workspace
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token)
VALUES (@User5Id, 'lucas.chen@example.com', @Workspace3Id, 'INVITE_TOKEN_789');

PRINT 'Even more sample data insertion complete.';
-- =============================================
-- 9. FILL ALL TABLES TO AT LEAST 4 ROWS
-- =============================================

-- Add more users
DECLARE @User7IdNum INT;
DECLARE @User7Id VARCHAR(20);
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('sophia_lee', 'Sophia', 'Lee', '1991-07-14', 'https://example.com/avatar7.png');
SET @User7IdNum = SCOPE_IDENTITY();
SELECT @User7Id = user_id FROM [User] WHERE user_id_num = @User7IdNum;
INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User7Id, 'sophia@example.com', '$2b$10$DummyHashForSophiaLee1234567890', 'active');

DECLARE @User8IdNum INT;
DECLARE @User8Id VARCHAR(20);
INSERT INTO [User] (username, first_name, last_name, birth_date, avatar_url)
VALUES ('michael_nguyen', 'Michael', 'Nguyen', '1987-09-30', 'https://example.com/avatar8.png');
SET @User8IdNum = SCOPE_IDENTITY();
SELECT @User8Id = user_id FROM [User] WHERE user_id_num = @User8IdNum;
INSERT INTO Member (member_id, login_email, password_hash, status)
VALUES (@User8Id, 'michael@example.com', '$2b$10$DummyHashForMichaelNguyen1234567890', 'active');

-- Add more contacts and phones
DECLARE @ContactSophiaIdNum INT;
DECLARE @ContactSophiaId VARCHAR(20);
INSERT INTO Contact (user_id, contact_email) VALUES (@User7Id, 'sophia.contact@gmail.com');
SET @ContactSophiaIdNum = SCOPE_IDENTITY();
SELECT @ContactSophiaId = contact_id FROM Contact WHERE contact_id_num = @ContactSophiaIdNum;
INSERT INTO Phones (contact_id, area_code, phone_number) VALUES (@ContactSophiaId, '+1', '555-0103');
INSERT INTO Phones (contact_id, area_code, phone_number) VALUES (@ContactSophiaId, '+1', '555-0104');

DECLARE @ContactMichaelIdNum INT;
DECLARE @ContactMichaelId VARCHAR(20);
INSERT INTO Contact (user_id, contact_email) VALUES (@User8Id, 'michael.contact@gmail.com');
SET @ContactMichaelIdNum = SCOPE_IDENTITY();
SELECT @ContactMichaelId = contact_id FROM Contact WHERE contact_id_num = @ContactMichaelIdNum;
INSERT INTO Phones (contact_id, area_code, phone_number) VALUES (@ContactMichaelId, '+1', '555-0105');
INSERT INTO Phones (contact_id, area_code, phone_number) VALUES (@ContactMichaelId, '+1', '555-0106');

-- Notification options
INSERT INTO Noti_options (user_id, noti_option) VALUES (@User7Id, 'Email');
INSERT INTO Noti_options (user_id, noti_option) VALUES (@User7Id, 'Push');
INSERT INTO Noti_options (user_id, noti_option) VALUES (@User8Id, 'Email');
INSERT INTO Noti_options (user_id, noti_option) VALUES (@User8Id, 'Push');

-- Add more workspaces
DECLARE @Workspace4IdNum INT;
DECLARE @Workspace4Id VARCHAR(20);
INSERT INTO Workspace (name, description, visibility, billing_plan)
VALUES ('QA Team', 'Workspace for QA', 'private', 'Free');
SET @Workspace4IdNum = SCOPE_IDENTITY();
SELECT @Workspace4Id = workspace_id FROM Workspace WHERE workspace_id_num = @Workspace4IdNum;
INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace4Id, @User7Id, 'Admin');
INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace4Id, @User8Id, 'Member');
INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace4Id, @User1Id, 'Member');
INSERT INTO Workspace_Member (workspace_id, member_id, role) VALUES (@Workspace4Id, @User2Id, 'Member');

-- Add more workspace domains
INSERT INTO Workspace_Domains (workspace_id, domain_name) VALUES (@Workspace4Id, 'qa.brello.com');
INSERT INTO Workspace_Domains (workspace_id, domain_name) VALUES (@Workspace2Id, 'marketing.brello.com');
INSERT INTO Workspace_Domains (workspace_id, domain_name) VALUES (@Workspace3Id, 'design.brello.com');

-- Add more teams
DECLARE @Team2IdNum INT;
DECLARE @Team2Id VARCHAR(20);
INSERT INTO Team (workspace_id, manager_id, name, description)
VALUES (@Workspace2Id, @User2Id, 'Marketing Leads', 'Lead marketers');
SET @Team2IdNum = SCOPE_IDENTITY();
SELECT @Team2Id = team_id FROM Team WHERE team_id_num = @Team2IdNum;
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team2Id, @User2Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team2Id, @User7Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team2Id, @User8Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team2Id, @User1Id);

DECLARE @Team3IdNum INT;
DECLARE @Team3Id VARCHAR(20);
INSERT INTO Team (workspace_id, manager_id, name, description)
VALUES (@Workspace3Id, @User5Id, 'Designers', 'UI/UX designers');
SET @Team3IdNum = SCOPE_IDENTITY();
SELECT @Team3Id = team_id FROM Team WHERE team_id_num = @Team3IdNum;
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team3Id, @User5Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team3Id, @User6Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team3Id, @User7Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team3Id, @User8Id);

DECLARE @Team4IdNum INT;
DECLARE @Team4Id VARCHAR(20);
INSERT INTO Team (workspace_id, manager_id, name, description)
VALUES (@Workspace4Id, @User7Id, 'QA Engineers', 'Quality assurance engineers');
SET @Team4IdNum = SCOPE_IDENTITY();
SELECT @Team4Id = team_id FROM Team WHERE team_id_num = @Team4IdNum;
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team4Id, @User7Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team4Id, @User8Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team4Id, @User1Id);
INSERT INTO Team_Member (team_id, member_id) VALUES (@Team4Id, @User2Id);

-- Add more boards
DECLARE @Board4IdNum INT;
DECLARE @Board4Id VARCHAR(20);
INSERT INTO Board (workspace_id, name, description, visibility, background_color)
VALUES (@Workspace4Id, 'QA Board', 'QA tasks', 'private', '#e0e0e0');
SET @Board4IdNum = SCOPE_IDENTITY();
SELECT @Board4Id = board_id FROM Board WHERE board_id_num = @Board4IdNum;
INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board4Id, @User7Id, 'Admin');
INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board4Id, @User8Id, 'Member');
INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board4Id, @User1Id, 'Member');
INSERT INTO Board_Member (board_id, member_id, role) VALUES (@Board4Id, @User2Id, 'Member');

-- Add more lists
DECLARE @ListQAIdNum INT;
DECLARE @ListQAId VARCHAR(20);
INSERT INTO List (board_id, name, position) VALUES (@Board4Id, 'QA To Do', 0);
SET @ListQAIdNum = SCOPE_IDENTITY();
SELECT @ListQAId = list_id FROM List WHERE list_id_num = @ListQAIdNum;
DECLARE @ListQADoingIdNum INT;
DECLARE @ListQADoingId VARCHAR(20);
INSERT INTO List (board_id, name, position) VALUES (@Board4Id, 'QA Doing', 1);
SET @ListQADoingIdNum = SCOPE_IDENTITY();
SELECT @ListQADoingId = list_id FROM List WHERE list_id_num = @ListQADoingIdNum;
DECLARE @ListQADoneIdNum INT;
DECLARE @ListQADoneId VARCHAR(20);
INSERT INTO List (board_id, name, position) VALUES (@Board4Id, 'QA Done', 2);
SET @ListQADoneIdNum = SCOPE_IDENTITY();
SELECT @ListQADoneId = list_id FROM List WHERE list_id_num = @ListQADoneIdNum;
DECLARE @ListQABugsIdNum INT;
DECLARE @ListQABugsId VARCHAR(20);
INSERT INTO List (board_id, name, position) VALUES (@Board4Id, 'QA Bugs', 3);
SET @ListQABugsIdNum = SCOPE_IDENTITY();
SELECT @ListQABugsId = list_id FROM List WHERE list_id_num = @ListQABugsIdNum;

-- Add more cards
DECLARE @CardQA1IdNum INT;
DECLARE @CardQA1Id VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level) VALUES (@ListQAId, 'Write Test Cases', 'Write test cases for new features', 0, 'high');
SET @CardQA1IdNum = SCOPE_IDENTITY();
SELECT @CardQA1Id = card_id FROM Card WHERE card_id_num = @CardQA1IdNum;
DECLARE @CardQA2IdNum INT;
DECLARE @CardQA2Id VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level) VALUES (@ListQADoingId, 'Execute Tests', 'Run automated tests', 0, 'medium');
SET @CardQA2IdNum = SCOPE_IDENTITY();
SELECT @CardQA2Id = card_id FROM Card WHERE card_id_num = @CardQA2IdNum;
DECLARE @CardQA3IdNum INT;
DECLARE @CardQA3Id VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level) VALUES (@ListQADoneId, 'Report Results', 'Report test results', 0, 'low');
SET @CardQA3IdNum = SCOPE_IDENTITY();
SELECT @CardQA3Id = card_id FROM Card WHERE card_id_num = @CardQA3IdNum;
DECLARE @CardQA4IdNum INT;
DECLARE @CardQA4Id VARCHAR(20);
INSERT INTO Card (list_id, name, description, position, priority_level) VALUES (@ListQABugsId, 'Fix Bugs', 'Fix reported bugs', 0, 'critical');
SET @CardQA4IdNum = SCOPE_IDENTITY();
SELECT @CardQA4Id = card_id FROM Card WHERE card_id_num = @CardQA4IdNum;

-- Add more card members
INSERT INTO Card_Member (card_id, member_id) VALUES (@CardQA1Id, @User7Id);
INSERT INTO Card_Member (card_id, member_id) VALUES (@CardQA2Id, @User8Id);
INSERT INTO Card_Member (card_id, member_id) VALUES (@CardQA3Id, @User1Id);
INSERT INTO Card_Member (card_id, member_id) VALUES (@CardQA4Id, @User2Id);

-- Add more labels
DECLARE @LabelQAIdNum INT;
DECLARE @LabelQAId VARCHAR(20);
INSERT INTO Label (board_id, name, color) VALUES (@Board4Id, 'QA', 'green');
SET @LabelQAIdNum = SCOPE_IDENTITY();
SELECT @LabelQAId = label_id FROM Label WHERE label_id_num = @LabelQAIdNum;
DECLARE @LabelBugQAIdNum INT;
DECLARE @LabelBugQAId VARCHAR(20);
INSERT INTO Label (board_id, name, color) VALUES (@Board4Id, 'Bug', 'red');
SET @LabelBugQAIdNum = SCOPE_IDENTITY();
SELECT @LabelBugQAId = label_id FROM Label WHERE label_id_num = @LabelBugQAIdNum;
DECLARE @LabelTestQAIdNum INT;
DECLARE @LabelTestQAId VARCHAR(20);
INSERT INTO Label (board_id, name, color) VALUES (@Board4Id, 'Test', 'yellow');
SET @LabelTestQAIdNum = SCOPE_IDENTITY();
SELECT @LabelTestQAId = label_id FROM Label WHERE label_id_num = @LabelTestQAIdNum;
DECLARE @LabelCriticalQAIdNum INT;
DECLARE @LabelCriticalQAId VARCHAR(20);
INSERT INTO Label (board_id, name, color) VALUES (@Board4Id, 'Critical', 'black');
SET @LabelCriticalQAIdNum = SCOPE_IDENTITY();
SELECT @LabelCriticalQAId = label_id FROM Label WHERE label_id_num = @LabelCriticalQAIdNum;

-- Add more card labels
INSERT INTO Card_Label (card_id, label_id) VALUES (@CardQA1Id, @LabelQAId);
INSERT INTO Card_Label (card_id, label_id) VALUES (@CardQA2Id, @LabelTestQAId);
INSERT INTO Card_Label (card_id, label_id) VALUES (@CardQA3Id, @LabelBugQAId);
INSERT INTO Card_Label (card_id, label_id) VALUES (@CardQA4Id, @LabelCriticalQAId);

-- Add more checklists
DECLARE @ChecklistQA1IdNum INT;
DECLARE @ChecklistQA1Id VARCHAR(20);
INSERT INTO Checklist (card_id, name) VALUES (@CardQA1Id, 'Test Case Steps');
SET @ChecklistQA1IdNum = SCOPE_IDENTITY();
SELECT @ChecklistQA1Id = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistQA1IdNum;
DECLARE @ChecklistQA2IdNum INT;
DECLARE @ChecklistQA2Id VARCHAR(20);
INSERT INTO Checklist (card_id, name) VALUES (@CardQA2Id, 'Execution Steps');
SET @ChecklistQA2IdNum = SCOPE_IDENTITY();
SELECT @ChecklistQA2Id = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistQA2IdNum;
DECLARE @ChecklistQA3IdNum INT;
DECLARE @ChecklistQA3Id VARCHAR(20);
INSERT INTO Checklist (card_id, name) VALUES (@CardQA3Id, 'Reporting Steps');
SET @ChecklistQA3IdNum = SCOPE_IDENTITY();
SELECT @ChecklistQA3Id = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistQA3IdNum;
DECLARE @ChecklistQA4IdNum INT;
DECLARE @ChecklistQA4Id VARCHAR(20);
INSERT INTO Checklist (card_id, name) VALUES (@CardQA4Id, 'Bug Fix Steps');
SET @ChecklistQA4IdNum = SCOPE_IDENTITY();
SELECT @ChecklistQA4Id = checklist_id FROM Checklist WHERE checklist_id_num = @ChecklistQA4IdNum;

-- Add more checklist items
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA1Id, 'Write steps', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA1Id, 'Review steps', 0);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA2Id, 'Run tests', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA2Id, 'Log results', 0);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA3Id, 'Prepare report', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA3Id, 'Send report', 0);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA4Id, 'Identify bug', 1);
INSERT INTO ChecklistItem (checklist_id, description, is_completed) VALUES (@ChecklistQA4Id, 'Fix bug', 0);

-- Add more comments
INSERT INTO Comment (card_id, member_id, text) VALUES (@CardQA1Id, @User7Id, 'Test cases written.');
INSERT INTO Comment (card_id, member_id, text) VALUES (@CardQA2Id, @User8Id, 'Tests executed.');
INSERT INTO Comment (card_id, member_id, text) VALUES (@CardQA3Id, @User1Id, 'Results reported.');
INSERT INTO Comment (card_id, member_id, text) VALUES (@CardQA4Id, @User2Id, 'Bug fixed.');

-- Add more attachments
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type) VALUES (@CardQA1Id, @User7Id, 'test_cases.xlsx', 'https://example.com/test_cases.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type) VALUES (@CardQA2Id, @User8Id, 'test_results.txt', 'https://example.com/test_results.txt', 'text/plain');
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type) VALUES (@CardQA3Id, @User1Id, 'report.pdf', 'https://example.com/report.pdf', 'application/pdf');
INSERT INTO Attachment (card_id, member_id, file_name, file_url, file_type) VALUES (@CardQA4Id, @User2Id, 'bugfix.patch', 'https://example.com/bugfix.patch', 'text/x-diff');

-- Add more custom field values
INSERT INTO CustomFieldValue (card_id, cfd_id, value) VALUES (@CardQA1Id, @CfdId, '3');
INSERT INTO CustomFieldValue (card_id, cfd_id, value) VALUES (@CardQA2Id, @CfdId, '6');
INSERT INTO CustomFieldValue (card_id, cfd_id, value) VALUES (@CardQA3Id, @CfdId, '2');
INSERT INTO CustomFieldValue (card_id, cfd_id, value) VALUES (@CardQA4Id, @CfdId, '7');

-- Add more automation rules
INSERT INTO AutomationRule (workspace_id, name, trigger_condition, action_execution) VALUES (@Workspace2Id, 'Auto-Assign', 'When card created', 'Assign to team lead');
INSERT INTO AutomationRule (workspace_id, name, trigger_condition, action_execution) VALUES (@Workspace3Id, 'Auto-Design', 'When card moved to Design', 'Notify designers');
INSERT INTO AutomationRule (workspace_id, name, trigger_condition, action_execution) VALUES (@Workspace4Id, 'Auto-QA', 'When bug reported', 'Assign to QA team');

-- Add more notifications
INSERT INTO Notification (receiver_id, title, message) VALUES (@User7Id, 'Welcome', 'Welcome to Brello, Sophia!');
INSERT INTO Notification (receiver_id, title, message) VALUES (@User8Id, 'Welcome', 'Welcome to Brello, Michael!');
INSERT INTO Notification (receiver_id, title, message) VALUES (@User1Id, 'QA Assigned', 'You have been assigned to QA Board.');
INSERT INTO Notification (receiver_id, title, message) VALUES (@User2Id, 'QA Assigned', 'You have been assigned to QA Board.');

-- Add more invitations
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token) VALUES (@User7Id, 'qauser1@example.com', @Workspace4Id, 'INVITE_TOKEN_QA1');
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token) VALUES (@User8Id, 'qauser2@example.com', @Workspace4Id, 'INVITE_TOKEN_QA2');
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token) VALUES (@User1Id, 'qauser3@example.com', @Workspace4Id, 'INVITE_TOKEN_QA3');
INSERT INTO Invitation (inviter_id, email_target, workspace_id, token) VALUES (@User2Id, 'qauser4@example.com', @Workspace4Id, 'INVITE_TOKEN_QA4');
