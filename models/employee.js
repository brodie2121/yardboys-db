const db = require('./conn.js');

class Employee {
    constructor(id, FirstName, lastName, phone, email, experience, dateStarted, course_id) {
        this.id = id;
        this.firstName = FirstName;
        this.lastName = lastName; 
        this.phone = phone;
        this.email = email;
        this.experience = experience;
        this.dateStarted = dateStarted;
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

    static async addEmployee(firstName, lastName, phone, email, experience, dateStarted, course_id) {
        const query = `insert into employee
        (firstName, lastName, phone, email, experience, dateStarted, course_id)
    Values ('${firstName}', '${lastName}', '${phone}', '${email}', '${experience}', '${dateStarted}', '${course_id}')`;
        try {
            let response = await db.result(query);
            return response;
        } catch (err) {
            console.log('Error', err.message);
            return err;
        }
    }

    static async updateEmployee(employeeId, firstName, lastName, phone, email, experience, dateStarted, course_id) {
        const query = `
            UPDATE employee 
            SET 
                firstname = '${firstName}', 
                lastname = '${lastName}', 
                phone = '${phone}', 
                email = '${email}', 
                experience = '${experience}', 
                datestarted = '${dateStarted}',
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