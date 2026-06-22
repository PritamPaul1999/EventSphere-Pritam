-- EventSphere Reset Script
-- Run this in MySQL to wipe all data and start IDs from 1

DROP DATABASE IF EXISTS eventsphere_auth_db;
DROP DATABASE IF EXISTS eventsphere_user_db;
DROP DATABASE IF EXISTS eventsphere_event_db;
DROP DATABASE IF EXISTS eventsphere_ticket_db;

CREATE DATABASE eventsphere_auth_db;
CREATE DATABASE eventsphere_user_db;
CREATE DATABASE eventsphere_event_db;
CREATE DATABASE eventsphere_ticket_db;

SHOW DATABASES LIKE 'eventsphere_%';
