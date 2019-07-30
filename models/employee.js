const db = require('./conn.js');
const bcrypt = require('bcryptjs');

class Employee {
    constructor(id, FirstName, lastName, password, phone, email, experience, dateStarted, adminStatus, course_id) {
        this.id = id;
        this.firstName = FirstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.experience = experience;
        this.dateStarted = dateStarted;
        this.adminStatus = adminStatus;
        this.course_id = course_id;
    }

    static async getAll() {
        try {
            const response = await db.any(`select * from employee;`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    async save() {
        try {
            const response = await db.one(
                `insert into employee
                    (firstname, lastname, phone, email, password, experience, datestarted, adminstatus, course_id)
                values
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                returning id
                `, [this.firstName, this.lastName, this.phone, this.email, this.password, this.experience, this.dateStarted, this.course_id]);
            console.log('employee was created with id:', response.id);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    async checkIfCreated() {
        try {
            const response = await db.one(`SELECT email FROM employee WHERE email =$1`, [this.email]);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getById(employee_id) {
        try {
            const response = await db.one(`select * from employee where id = ${employee_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async deleteEmployee(employee_id) {
        try {
            const response = await db.result(`delete from employee where id = ${employee_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    async getUserInfo() {
        try {
            const userData = await db.one(`
            select id, firstname, lastname, phone, email, password, experience, datestarted, adminstatus, course_id
                from users
            where id = $1`, 
            [this.id]);
            return userData;
        } catch (err) {
            return err.message;
        }
    }

    async getEmployeeByEmail() {
        try {
            const employeeData = await db.one(
            `
                select id, firstname, lastname, phone, password, experience, datestarted, adminstatus, course_id
                    from employee
                where email = $1`,
            [this.email]
        );
        return employeeData;
    } catch (err) {
        return err.message;
        }
    }

    static async checkEmployee(email) {
        try {
            const response = db.result(`
                SELECT *
                FROM employee 
                WHERE email = $1
            `, [email]);
            return response;
        } catch (err) {
            return err.message;
        }
    }


    

    static async updateEmployee(employeeId, firstName, lastName, phone, email, password, experience, dateStarted, course_id) {
        const query = `
            UPDATE employee 
            SET 
                firstname = '${firstName}', 
                lastname = '${lastName}', 
                phone = '${phone}', 
                email = '${email}', 
                password = '${password}',
                experience = '${experience}', 
                datestarted = '${dateStarted}',
                adminstatus = '${adminStatus}',
                course_id = '${course_id}'

            WHERE 
                id = '${employeeId}'`;
        console.log(query);
        try {
            const response = await db.result(query);
            console.log("response", response);
            return response;
        } catch (err) {
            return err.message;
        }
    }
}

module.exports = Employee;