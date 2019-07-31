const express = require("express"),
    router = express.Router(),
    bcryptjs = require('bcryptjs'),
    Employee = require("../models/employee");
    db = require("../models/conn.js");

/* GET home page. */
router.get("/", (req, res, next) => {
    res.send("Welcome to my api").status(200);
});

router.get("logout", async (req, res) => {
    console.log("logging out");
    req.session.destroy();
});

//get all employees
router.get("/all", async (req, res, next) => {
    const allEmployees = await EmployeeModel.getAll();
    res.json(allEmployees).status(200);
});

router.get("/employees/:employee_id?", async (req, res) => {
    const employeeId = req.params.employee_id;
    const theEmployee = await EmployeeModel.getById(employeeId);
    res.json(theEmployee).status(200);
});

router.get("/delete/:employee_id?", async (req, res, next) => {
    const employeeId = req.params.employee_id;
    const response = await EmployeeModel.deleteEmployee(employeeId);
    console.log("response", response)
    if (response.command === "DELETE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not delete employeeId: ${employeeId}`).status(409);
    }
});

router.post("/login", async (req, res) => {
    console.log("this is req body", req.body);
    const { email, password } = req.body,
        employeeInstance = new Employee(null, null, null, null, email, password, null, null, null, null);
    const employeeData = await employeeInstance.getEmployeeByEmail();
    console.log("this is employee data: ", employeeData);

    const isValid = bcryptjs.compareSync(password, employeeData.password);
    console.log("this is employee data after compare sync: ", employeeData);
    if (!!isValid) {
        req.session.is_logged_in = true;
        req.session.firstname = employeeData.firstname;
        req.session.lastname = employeeData.lastname;
        req.session.phone = employeeData.phone;
        req.session.employee_id = employeeData.employee_id;
        employeeData["login"] = true;
        console.log("CORRECT PW!");
        // res.json(employeeData);
        res.sendStatus(200);
    } else {
        console.log("WRONG PW!");
        res.sendStatus(401);
    }
});

    router.post("/register", async (req, res) => {
        console.log("this is req body", req.body);
        const { firstname, lastname, phone, email, experience, datestarted, adminstatus, course_id, password } = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        const employeeInstance = new Employee(
            null,
            firstname,
            lastname,
            phone,
            email,
            experience,
            datestarted,
            adminstatus,
            course_id,
            hash,

        );
        employeeInstance.save().then(response => {
            req.session.firstname = response.firstname;
            req.session.lastname = response.lastname;
            req.session.phone = response.phone;
            req.session.email = response.email;
            req.session.experience = response.experience;
            req.session.datestarted = response.datestarted;
            req.session.adminstatus = response.adminstatus;
            req.session.course_id = response.course_id;
            res.sendStatus(200);
        });
    });

router.put("/employees/update/:employee_id?", async (req, res) => {
    const employeeId = req.params.employee_id;
    console.log(req.body);
    const { firstName, lastName, phone, email, experience, dateStarted, course_id, password } = req.body;
    const response = await EmployeeModel.updateEmployee(employeeId, firstname, lastname, phone, email, experience, datestarted, adminstatus, course_id, password);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update employee id ${employeeId}`).status(409);
    } 
});

module.exports = router;