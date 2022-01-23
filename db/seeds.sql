USE employee_db;

INSERT INTO department (name)
VALUES 
('Information Systems and Technology'),
('Finance'),
('Legal'),
('Human Resources'),
('Security'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 100000, 1),
('Accountant', 80000, 2),
('Paralegal', 70000, 3),
('Manager', 110000, 4),
('Engineer', 90000, 5),
('Sales Rep', 50000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Thomas "Neo"', 'Anderson', 1, 170),
('Lelouch', 'Lamperouge', 2, 201),
('Sarah', 'Mackensie', 3, 339),
('Roboute', 'Guilliman', 4, 456),
('Miles', 'OBrien', 5, 508),
('Juna', 'Douma', 6, 634);