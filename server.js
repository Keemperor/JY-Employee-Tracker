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
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Welcome to our employee database! Please choose an option',
    choices: [
      'View all employees',
      'View all departments',
      'View all employees by department',
      'View all roles',
      'View budget',
      'Add an employee',
      'Add a department',
      'Add a role',
      'Update employee role',
      'Update manager',
      'Delete an employee',
      'Delete a department',
      'Delete a role',
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
          case 'View all employees by department':
            employeeDepartment ();
            break;
          case 'View budget':
            viewBudget ();
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
            updateEmployee();
            break;
          case 'Update manager':
            updateManager();
            break;
          case 'Delete an employee':
            deleteEmployee();
            break;
          case 'Delete a department':
            deleteDepartment ();
            break;
          case 'Delete a role':
            deleteRole ();
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

function addEmployee() {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) throw err;
    inquirer.prompt([
              {
                  name: 'first_name',
                  type: 'input', 
                  message: "What is the employee's fist name? ",
              },
              {
                  name: 'last_name',
                  type: 'input', 
                  message: "What is the employee's last name? "
              },
              {
                  name: 'manager_id',
                  type: 'input', 
                  message: "What is the employee's manager's ID? "
              },
              {
                  name: 'role', 
                  type: 'list',
                  choices: function() {
                  var roleArray = [];
                  for (let i = 0; i < res.length; i++) {
                      roleArray.push(res[i].title);
                  }
                  return roleArray;
                  },
                  message: "What is this employee's role? "
              }
              ]).then(function (answer) {
                  let role_id;
                  for (let a = 0; a < res.length; a++) {
                      if (res[a].title == answer.role) {
                          role_id = res[a].id;
                          console.log(role_id)
                      }                  
                  }  
                  connection.query(
                  'INSERT INTO employee SET ?',
                  {
                      first_name: answer.first_name,
                      last_name: answer.last_name,
                      manager_id: answer.manager_id,
                      role_id: role_id,
                  },
                  function (err) {
                      if (err) throw err;
                      console.log('Your employee has been added!');
                      options();
                  })
              })
      })
};

function addDepartment() {
  inquirer.prompt([
          {
              name: 'newDepartment', 
              type: 'input', 
              message: 'Which department would you like to add?'
          }
          ]).then(function (answer) {
              connection.query(
                  'INSERT INTO department SET ?',
                  {
                      name: answer.newDepartment
                  });
              var query = 'SELECT * FROM department';
              connection.query(query, function(err, res) {
              if(err)throw err;
              console.log('Your department has been added!');
              console.table('All Departments:', res);
              options();
              })
          })
};

function addRole() {
  connection.query('SELECT * FROM department', function(err, res) {
      if (err) throw err;
        inquirer.prompt([
          {
              name: 'new_role',
              type: 'input', 
              message: "What new role would you like to add?"
          },
          {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this role? (Enter a number)'
          },
          {
              name: 'Department',
              type: 'list',
              choices: function() {
                  var deptArry = [];
                  for (let i = 0; i < res.length; i++) {
                  deptArry.push(res[i].name);
                  }
                  return deptArry;
              },
          }
      ]).then(function (answer) {
          let department_id;
          for (let a = 0; a < res.length; a++) {
              if (res[a].name == answer.Department) {
                  department_id = res[a].id;
              }
          }
          connection.query(
              'INSERT INTO role SET ?',
              {
                  title: answer.new_role,
                  salary: answer.salary,
                  department_id: department_id
              },
              function (err, res) {
                  if(err)throw err;
                  console.log('Your new role has been added!');
                  console.table('All Roles:', res);
                  options();
              })
      })
  })
};

function updateEmployee () {
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        connection.query(roleSql, (err, data) => {
          if (err) throw err; 

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 

                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(sql, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee has been updated!");
              
                viewEmployees();
          });
        });
      });
    });
  });
};

function updateManager () {
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

          connection.query(managerSql, (err, data) => {
            if (err) throw err; 

          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager); 
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 
                    
                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated!");
                  
                    viewEmployees();
          });
        });
      });
    });
  });
};

function employeeDepartment () {
  console.log('Showing employee by departments...\n');
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    options();
  });          
};

function deleteDepartment () {
  const deptSql = `SELECT * FROM department`; 

  connection.query(deptSql, (err, data) => {
    if (err) throw err; 

    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "What department do you want to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

        viewDepartments();
      });
    });
  });
};

function deleteRole () {
  const roleSql = `SELECT * FROM role`; 

  connection.query(roleSql, (err, data) => {
    if (err) throw err; 

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "What role do you want to delete?",
        choices: role
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          viewRoles();
      });
    });
  });
};

function deleteEmployee() {
  const employeeSql = `SELECT * FROM employee`;

  connection.query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to delete?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;

        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log("Successfully Deleted!");
        
          viewEmployees();
    });
  });
 });
};

function viewBudget () {
  console.log('Showing budget by department...\n');

  const sql = `SELECT department_id AS id, 
                      department.name AS department,
                      SUM(salary) AS budget
               FROM  role  
               JOIN department ON role.department_id = department.id GROUP BY  department_id`;
  
  connection.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);

    options(); 
  });            
};

function exitApp() {
    connection.end();
};