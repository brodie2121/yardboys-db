const express = require("express"),
    router = express.Router(),
    bcrypt = require('bcryptjs'), 
    SALT_ROUNDS = 10,
    EmployeeModel = require("../models/employee");

/* GET home page. */
router.get("/", (req, res, next) => {
    res.send("Welcome to my api").status(200);
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

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    const checkEmail = await EmployeeModel.checkEmployee(email);


    if (checkEmail.rowCount === 1) {
        let employee = checkEmail.rows[0];
        const comparePassword = await bcrypt.compare(password, employee.password);

        if (!!comparePassword) {
            theEmployee["login"] = true;
            delete employee.password;
            res.json(employee);
        } else {
            res.json({
            // incorrect Password
                login: false,
                errorCode: 2
            });
        }
    } else {
        res.json({
        // not existant 
        login: false,
        errorCode: 1
    });
    }
});

router.post('/register', async (req,res) => {

    const firstName = req.body.firstName
    const  password = req.body.password
    
    const employee = await db.oneOrNone('SELECT employeeid FROM employee WHERE email = $1',[email])

        if(employee) {
        res.render('register',{message: "User name already exists!"})
        } else {
          // insert user into the users table

        bcryptjs.hash(password,SALT_ROUNDS,function(error, hash){

            if(error == null) {
                db.none('INSERT INTO users(username,password) VALUES($1,$2)',[username,hash])
                .then(() => {
                    res.send('SUCCESS')
                    })
                }
            })
        }
    })  

router.put("/employees/update/:employee_id?", async (req, res) => {
    const employeeId = req.params.employee_id;
    console.log(req.body);
    const { firstName, lastName, password, phone, email, experience, dateStarted, course_id } = req.body;
    const response = await EmployeeModel.updateEmployee(employeeId, firstName, lastName, password, phone, email,  experience, dateStarted, course_id);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update employee id ${employeeId}`).status(409);
    } 
});

module.exports = router;