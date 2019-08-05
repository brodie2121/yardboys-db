const db = require('./conn.js');

class Employee {
    constructor(id, fullname, phone, email, experience, datestarted, adminstatus, course_id, password) {
        this.id = id;
        this.fullname = fullname;
        this.phone = phone;
        this.email = email;
        this.experience = experience;
        this.datestarted = datestarted;
        this.adminstatus = adminstatus;
        this.course_id = course_id;
        this.password = password;
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
                    (fullname, phone, email, experience, datestarted, adminstatus, course_id, password)
                values
                    ($1, $2, $3, $4, $5, $6, $7, $8)
                returning id
                `, [this.fullname, this.phone, this.email, this.experience, this.datestarted, this.adminstatus, this.course_id, this.password]);
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
            select id, fullname, phone, email, experience, datestarted, adminstatus, course_id, password
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
                select id, fullname, phone, experience, datestarted, adminstatus, course_id, password
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

    static async updateEmployee(employeeId, fullname, phone, email,  experience, datestarted, course_id) {
        const query = `
            UPDATE employee 
            SET 
                fullname = '${fullname}', 
                phone = '${phone}', 
                email = '${email}', 
                experience = '${experience}', 
                datestarted = ${datestarted},
                adminstatus = '${adminstatus}',
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