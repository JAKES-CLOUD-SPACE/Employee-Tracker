import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
await connectToDb();

// Function to view all employees
const viewEmployees = async () => {
  const result = await pool.query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name 
      AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
      AS manager FROM employee AS employees
      LEFT JOIN role AS roles ON employees.role_id = roles.id
      LEFT JOIN department AS department ON roles.department_id = department.id
      LEFT JOIN employee AS manager ON employees.manager_id = manager.id`);
  console.table(result.rows);

  start();
};

// Function to add an employee
const addEmployee = async () => {
  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const employees = await pool.query('SELECT * FROM employee');
  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:'
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role for this employee:',
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the manager for this employee:',
      choices: [...managerChoices, { name: 'None', value: null }]
    }
  ]);

  await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, roleId, managerId]);
  console.log(`Employee "${firstName} ${lastName}" added successfully!`);

  start();
};

// Function to update an employee role
const updateEmployeeRole = async () => {
  const employees = await pool.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const { employeeId, roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to update:',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the new role for this employee:',
      choices: roleChoices
    }
  ]);

  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
  console.log('Employee role updated successfully!');
  start();
};

// Function to view all roles
const viewRoles = async () => {
  const result = await pool.query(`
      SELECT role.id, role.title, role.salary, department.name 
      AS department FROM role
      LEFT JOIN department ON role.department_id = department.id
    `);
  console.table(result.rows);

  start();
};

// Function to add a role
const addRole = async () => {
  const departments = await pool.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id
  }));

  const { roleName, salary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: 'Enter the name of the new role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for this role:'
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for this role:',
      choices: departmentChoices
    }
  ]);

  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
    [roleName, salary, departmentId]);
  console.log(`Role "${roleName}" added successfully!`);

  start();
};

// Function to view all departments
const viewDepartments = async () => {
  const result = await pool.query('SELECT * FROM department');
  console.table(result.rows);

  start();
};

// Function to add a department
const addDepartment = async () => {
  const { departmentName } = await inquirer.prompt({
    type: 'input',
    name: 'departmentName',
    message: 'Enter the name of the new department:'
  });
  await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
  console.log(`Department "${departmentName}" added successfully!`);

  start();
};



// Mapping user actions to corresponding functions
const actions = {
  'View all departments': viewDepartments,
  'View all roles': viewRoles,
  'View all employees': viewEmployees,
  'Add a department': addDepartment,
  'Add a role': addRole,
  'Add an employee': addEmployee,
  'Update an employee role': updateEmployeeRole,
  'Exit': () => {
    pool.end();
    console.log('Goodbye!');
  }
};


// Function to display the menu and handle user input
const start = async () => {
  const { action }: { action: keyof typeof actions } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: Object.keys(actions)
  });



  // Call the function mapped to the user's choice
  actions[action]();
};

// Start the application
start();