const db = require('./conn.js');

class YourCourse {
    constructor(id, clubName, admin, employees, city, state) {
        this.id = id;
        this.clubname = clubName;
        this.admin = admin;
        this.employees = employees;
        this.city = city;
        this.state = state;
    }

    static async getById(yourcourse_id) {
        try {
            const response = await db.one(`select * from yourcourse where id = ${yourcourse_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }
}

module.exports = YourCourse;