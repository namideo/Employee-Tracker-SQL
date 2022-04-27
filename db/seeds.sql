INSERT INTO department (id, department_name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (01, "Sales Manager", 80000, 1),
       (02, "Salesperson", 40000, 1),
       (03, "Lead Engineer", 150000, 2),
       (04, "Engineer", 120000, 2),
       (05, "Account Manager", 130000, 3),
       (06, "Accountant", 100000, 3),
       (07, "Legal Team Lead", 180000, 4),
       (08, "Lawyer", 140000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager, manager_id)
VALUES (001, "Daenerys", "Targaryen", 01, null, 0001),
       (002, "Sansa", "Stark", 02, "Daenerys Targaryen", null),
       (003, "Jon", "Snow", 03, null, 0002),
       (004, "Theon", "Greyjoy", 04, "Jon Snow", null),
       (005, "Cersei", "Lannister", 05, null, 0003),
       (006, "Petyr", "Baelish", 06, "Cersei Lannister", null),
       (007, "Tyrion", "Lannister", 07, null, 0004),
       (008, "Jorah", "Mormont", 08, "Tyrion Lannister", null);
