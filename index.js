const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const viewQuestions = async () => {
          inquirer.prompt([
            {
            type: 'list',
            name: 'options',
            message: 'Select an option',
            choices: ['View all departments', 
                      'View all roles', 
                      'View all employees', 
                      'Add a department', 
                      'Add a role', 
                      'Add an employee', 
                      'Update employee'
                      ]
            }
          ]).then(response => {
            switch (response.options) {
              case 'View all departments':
                getDepartments();
                break;

              case 'Add a department':
                addDepartment();
                break;

              case 'View all roles':
                getRoles();
                break;

              case 'Add a role':
                addRole();
                break;

              case 'View all employees':
                getEmployees();
                break;

              case 'Add an employee':
                addEmployee();
                break;

              case 'Update employee':
                updateEmployee();
                break;

              case 'Remove':
                removeData();
                break;
            }
          })
          }
        

        const getDepartments = () => {
          const dept = `SELECT department.id, department.department_name FROM department;`
          db.promise().query(dept).then(([rows]) => {
            console.table(rows);
          }).then (() => {
            viewQuestions();
          });
          }

        const getRoles = () => {
          const role = `SELECT role.id, role.title, role.salary, department.department_name AS department FROM role
          LEFT JOIN department ON (department.id = role.department_id);`
          db.promise().query(role).then(([rows]) => {
            console.table(rows);
          }).then (() => {
            viewQuestions();
          });
        }

        const getEmployees = () => {
          const emp = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, employee.manager FROM employee
          INNER JOIN role ON (role.id = employee.role_id)
          INNER JOIN department ON (department.id = role.department_id)
          ORDER BY employee.id;`
          db.promise().query(emp).then(([rows]) => {
            console.table(rows);
          }).then (() => {
            viewQuestions();
          });
        }

        const addDepartment = () => {
          inquirer.prompt([
            {
              type: "input",
              name: "departmentName",
              message: "Add department name."
            }
          ])
          .then(response => {
          const newDept = `INSERT INTO department (department_name)
          VALUES (?)`;
          let department_name = response.departmentName;
          db.promise().query(newDept, department_name);
            console.log(`${response.departmentName} was added to database.\n`);
          }).then (() => {
            viewQuestions();
          });
        }

        const addRole = () => {
          const dept = `SELECT department.id AS value, department.department_name AS name FROM department;`
          db.promise().query(dept).then(([rows]) => {
            inquirer.prompt([
              {
                type: "input",
                name: "roleName",
                message: "Add role description."
              },
              {
                type: "input",
                name: "salary",
                message: "Input salary."
              },
              {
                type: "list",
                name: "department",
                message: "Which department would you like to put this role into?",
                choices: rows
                }
              ])
              .then(response => {
                console.log(response)
              const newRole = `INSERT INTO role (title, salary, department_id)
              VALUES (?, ?, ?)`;
              db.promise().query(newRole, [response.roleName, response.salary, response.department]);
              }).then (() => {
                viewQuestions();
              });
          });
         }

          const addEmployee = () => {
            const role = `SELECT role.id AS value, role.title AS name FROM role;`
            db.promise().query(role).then(([roleChoices]) => {
            
            const manager = `SELECT employee.manager_id AS value, employee.manager AS name FROM employee;`
            db.promise().query(manager).then(([managerChoices]) => {
            
            inquirer.prompt([
              {
                type: "input",
                name: "firstName",
                message: "Enter employee's first name."
              },
              {
                type: "input",
                name: "lastName",
                message: "Enter employee's last name."
              },
              {
                type: "list",
                name: "empRole",
                message: "Select an employee role.",
                choices: roleChoices
              },
              {
                type: "list",
                name: "empManager",
                message: "Who is the employee's manager?",
                choices: managerChoices
              }
            ])
            .then(response => {
              console.log(response)
            const newEmp = `INSERT INTO employee (first_name, last_name, role_id, manager)
            VALUES (?, ?, ?, ?)`;
            db.promise().query(newEmp, [response.firstName, response.lastName, response.empRole, response.empManager]);
            }).then (() => {
              viewQuestions();
            })
          })
        })
      }

          const updateEmployee = () => {
            const emp = `SELECT employee.id AS value, employee.first_name, employee.last_name AS name FROM employee;`
            db.promise().query(emp).then(([empChoices]) => {

            const role = `SELECT role.id AS value, role.title AS name FROM role;`
            db.promise().query(role).then(([roleChoices]) => {

             inquirer.prompt([
              {
                type: "list",
                name: "empSelect",
                message: "Select employee.",
                choices: empChoices
              },
              {
                type: "list",
                name: "updateRole",
                message: "Select new role",
                choices: roleChoices
              }
            ])
            .then(response => {
              console.log(response)
            const newEmp = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.promise().query(newEmp, [response.updateRole, response.empSelect]);
            }).then (() => {
              viewQuestions();
           })
          })
        })
      }    
    

    function init() {
      viewQuestions();
    }

    init();