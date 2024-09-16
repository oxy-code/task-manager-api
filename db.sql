CREATE DATABASE task_manager;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(20) CHECK (status IN ('To Do', 'In Progress', 'Done')),
    deadline DATE
);
