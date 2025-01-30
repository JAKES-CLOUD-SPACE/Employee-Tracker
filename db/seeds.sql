-- Insert different departments into deparments table
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Human Resources');
INSERT INTO department (name) VALUES ('Marketing');

-- Insert various roles into role table
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 70000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Specialist', 60000, 3);

-- Insert employee values into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Smith', 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Charlie', 'Brown', 3, 1);
