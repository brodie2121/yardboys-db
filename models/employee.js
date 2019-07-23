const db = require('./conn.js');

class Employee {
    constructor(id, FirstName, lastName, password, phone, email, experience, dateStarted, course_id) {
        this.id = id;
        this.firstName = FirstName;
        this.lastName = lastName; 
        this.password = password;
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

    async save() {
        try {
            const response = await db.one(
                `insert into employee
                    (firstname, lastname, password, phone, email, experience, datestarted, adminstatus, course_id)
                values
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                returning id
                `, [this.firstName, this.lastName, this.password, this.phone, this.email, this.experience, this.dateStarted, this.course_id]);
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
            select id, firstname, lastname, password, phone, email, experience, datestarted, adminstatus, course_id
                from users
            where id = $1`, 
            [this.id]);
            return userData;
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

    static async addEmployee(hashPW) {
        try {
            const response = await db.result(`
                INSERT INTO employee
                    (FirstName, lastName, password, phone, email, experience, dateStarted, course_id)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $6, $7, $8)`,
                [this.firstName, this.lastName, hashPW, this.phone, this.email, this.experience, this.dateStarted, this.course_id]);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async updateEmployee(employeeId, firstName, password, lastName, phone, email, experience, dateStarted, course_id) {
        const query = `
            UPDATE employee 
            SET 
                firstname = '${firstName}', 
                lastname = '${lastName}', 
                password = '${password},
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