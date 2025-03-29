-- This file represents the schema for the database
-- Use this with your Neon PostgreSQL database

-- First, let's ensure the tables exist (if they don't already)
CREATE TABLE IF NOT EXISTS Primary_Program (
    id SERIAL PRIMARY KEY,
    ranking VARCHAR(10),
    score INT,
    participant_number BIGINT,
    group_name VARCHAR(100),
    participant_name VARCHAR(255),
    selected BOOLEAN DEFAULT FALSE,
    selection_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Secondary_Program (
    id SERIAL PRIMARY KEY,
    ranking VARCHAR(10),
    score INT,
    participant_number BIGINT,
    group_name VARCHAR(100),
    participant_name VARCHAR(255),
    selected BOOLEAN DEFAULT FALSE,
    selection_date TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS secondary_program_selection_idx ON Secondary_Program(selected, ranking);
CREATE INDEX IF NOT EXISTS primary_program_selection_idx ON Primary_Program(selected, ranking);
