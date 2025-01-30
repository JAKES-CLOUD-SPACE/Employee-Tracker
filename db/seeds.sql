-- Insert different departments into deparments table
INSERT INTO department (name)
VALUES ('Engineering'),
('Human Resources'),
('Marketing');

-- Insert various roles into role table
INSERT INTO role (title, salary, department_id) 
VALUES ('Software Engineer', 80000, 1),
('HR Manager', 70000, 2),
('Marketing Specialist', 60000, 3);

-- Insert employee values into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
('Alice', 'Johnson', 1, NULL),
('Bob', 'Smith', 2, NULL),
('Charlie', 'Brown', 3, 1);
