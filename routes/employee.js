const express = require("express"),
    router = express.Router(),
    bcryptjs = require('bcryptjs'), 
    SALT_ROUNDS = 10,
    EmployeeModel = require("../models/employee");
    db = require("../models/conn.js");

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

router.get('/login', (req, res) => {
    console.log('login');
})

router.post('/login', async (req,res) => {

    let email = req.body.email
    let password = req.body.password

    let employee = await db.oneOrNone('SELECT id ,email, password FROM employee WHERE email = $1', [email])
      if(employee) { //check for user's password

    bcryptjs.compare(password,employee.password,function(error,result){
        if(result) {

        // put username and userId in the session
            if(req.session) {
                req.session.employee = {employeeId: employee.id, email: employee.email}
            }

        } else {
            res.render('login',{message: "Invalid username or password!"})
        }
    })

        }   else { // user does not exist
        res.render('login',{message: "Invalid username or password!"})
        }
    })

router.get('/register', (req,res) => {
    console.log('register');
})

router.post('/register', async (req,res) => {

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const phone = req.body.phone
    const email = req.body.email
    const experience = req.body.experience
    const dateStarted = req.body.dateStarted
    const course_id = req.body.course_id
    
    let employee = await db.oneOrNone('SELECT id FROM employee WHERE email = $1',[email])

        if(employee) {
        res.render('register',{message: "employee email already exists!"})
        } else {
          // insert user into the users table

        bcryptjs.hash(password,SALT_ROUNDS,function(error, hash){

            if(error == null) {
                db.none('INSERT INTO employee(firstname, lastname ,password, phone,email, experience, datestarted, course_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[firstName,lastName,hash,phone,email,experience,dateStarted,course_id])
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
    const { firstName, lastName, phone, email, password, experience, dateStarted, course_id } = req.body;
    const response = await EmployeeModel.updateEmployee(employeeId, firstName, lastName, phone, email, password, experience, dateStarted, course_id);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update employee id ${employeeId}`).status(409);
    } 
});

module.exports = router;