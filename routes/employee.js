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
        employeeInstance = new Employee(null, null, null, email, password, null, null, null, null);
    const employeeData = await employeeInstance.getEmployeeByEmail();
    console.log("this is employee data: ", employeeData);

    const isValid = bcryptjs.compareSync(password, employeeData.password);
    console.log("this is user data after compare sync: ", employeeData);
    if (!!isValid) {
        req.session.is_logged_in = true;
        req.session.firstName = employeeData.firstname;
        req.session.lastName = employeeData.lastname;
        req.session.phone = employeeData.phone;
        req.session.employee_id = employeeData.employee_id;
        employeeData["login"] = true;
        console.log("CORRECT PW!");
        res.json(employeeData);
        res.sendStatus(200);
    } else {
        console.log("WRONG PW!");
        res.sendStatus(401);
    }
});

    router.post("/register", async (req, res) => {
        console.log("this is req body", req.body);
        const { firstName, lastName, phone, email, password, experience, dateStarted, adminStatus, course_id } = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        const employeeInstance = new Employee(
            null,
            firstName,
            lastName,
            phone,
            email,
            hash,
            experience,
            dateStarted,
            adminStatus,
            course_id,

        );
        employeeInstance.save().then(response => {
            req.session.firstName = response.firstname;
            req.session.lastName = response.lastname;
            req.session.phone = response.phone;
            req.session.email = response.email;
            req.session.experience = response.experience;
            req.session.dateStarted = response.datestarted;
            req.session.adminStatus = response.adminstatus;
            req.session.course_id = response.course_id;
            res.sendStatus(200);
        });
    });

router.put("/employees/update/:employee_id?", async (req, res) => {
    const employeeId = req.params.employee_id;
    console.log(req.body);
    const { firstName, lastName, phone, email, password, experience, dateStarted, course_id } = req.body;
    const response = await EmployeeModel.updateEmployee(employeeId, firstName, lastName, phone, email, password, experience, dateStarted, adminStatus, course_id);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update employee id ${employeeId}`).status(409);
    } 
});

module.exports = router;