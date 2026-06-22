-- Create EventSphere Databases
-- Run this script in your MySQL instance to create the necessary databases for the microservices.
-- Make sure the user running the microservices has access to these databases.

CREATE DATABASE IF NOT EXISTS eventsphere_auth_db;
CREATE DATABASE IF NOT EXISTS eventsphere_user_db;
CREATE DATABASE IF NOT EXISTS eventsphere_event_db;
CREATE DATABASE IF NOT EXISTS eventsphere_ticket_db;

-- Optional: Create a dedicated user for these databases
-- CREATE USER IF NOT EXISTS 'eventsphere_user'@'localhost' IDENTIFIED BY 'password';
-- GRANT ALL PRIVILEGES ON eventsphere_auth_db.* TO 'eventsphere_user'@'localhost';
-- GRANT ALL PRIVILEGES ON eventsphere_user_db.* TO 'eventsphere_user'@'localhost';
-- GRANT ALL PRIVILEGES ON eventsphere_event_db.* TO 'eventsphere_user'@'localhost';
-- GRANT ALL PRIVILEGES ON eventsphere_ticket_db.* TO 'eventsphere_user'@'localhost';
-- FLUSH PRIVILEGES;

SHOW DATABASES LIKE 'eventsphere_%';
