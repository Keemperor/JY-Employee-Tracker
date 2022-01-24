const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password:  'Tau-40K-1701',
  database: 'employee_db'
});

connection.connect(function(err) {
  if (err) throw err
  console.log("Connected as Id" + connection.threadId)
  options();
});

function options() {
  inquirer
      .prompt({
          name: 'action',
          type: 'list',
          message: 'Welcome to our employee database! Please choose an option',
          choices: [
                  'View all employees',
                  'View all departments',
                  'View all roles',
                  'Add an employee',
                  'Add a department',
                  'Add a role',
                  'Update employee role',
                  'Delete an employee',
                  'EXIT'
                  ]
          }).then(function (answer) {
              switch (answer.action) {
                  case 'View all employees':
                      viewEmployees();
                      break;
                  case 'View all departments':
                      viewDepartments();
                      break;
                  case 'View all roles':
                      viewRoles();
                      break;
                  case 'Add an employee':
                      addEmployee();
                      break;
                  case 'Add a department':
                      addDepartment();
                      break;
                  case 'Add a role':
                      addRole();
                      break;
                  case 'Update employee role':
                      updateRole();
                      break;
                  case 'Delete an employee':
                      deleteEmployee();
                      break;
                  case 'EXIT': 
                      exitApp();
                      break;
                  default:
                      break;
              }
      })
};

function viewEmployees() {
  var query = 'SELECT * FROM employee';
  connection.query(query, function(err, res) {
      if (err) throw err;
      console.log(res.length + ' employees found!');
      console.table('All Employees:', res); 
      options();
  })
};

function viewDepartments() {
  var query = 'SELECT * FROM department';
  connection.query(query, function(err, res) {
      if(err)throw err;
      console.table('All Departments:', res);
      options();
  })
};

function viewRoles() {
  var query = 'SELECT * FROM role';
  connection.query(query, function(err, res){
      if (err) throw err;
      console.table('All Roles:', res);
      options();
  })
};