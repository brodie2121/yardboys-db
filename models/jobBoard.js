const db = require('./conn.js');

class JobBoard{
    constructor(id, date, jobType_id, employee_id, comments) {
        this.id = id;
        this.date = date;
        this.jobType_id = jobType_id;
        this.employee_id = employee_id;
        this.comments = comments;
    }

    //getall
    static async getAll() {
        try {
            const response = await db.any(`select * from jobboard;`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async getJobById(jobboard_id) {
        try {
            const response = await db.one(`select * from jobboard where id = ${jobboard_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    //delete job
    static async deleteJob(jobboard_id) {
        try {
            const response = await db.result(`delete from jobboard where id = ${jobboard_id}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }


    //get jobs by date
    static async getByDate(date) {
        try {
            const response = await db.result(`select * from jobboard order by date where date = ${date}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    //add jobs
    static async addNewJobBoard(date, jobType_id, employee_id, comments) {
        const query = `insert into jobboard
        (date, jobType_id, employee, comments)
    Values ('${date}', '${jobType_id}', '${employee_id}', '${comments}')`;
        try {
            let response = await db.result(query);
            return response;
        } catch (err) {
            console.log('Error', err.message);
            return err;
        }
    }
 
    static async updateJobBoard( date, jobType, employee, comments, jobboardId ) {
        const query = `
            UPDATE jobboard 
            SET 
                date = '${date}', 
                jobtype = ${jobType}, 
                employee = ${employee}, 
                comments = '${comments}'
            WHERE 
                id = ${jobboardId}`;
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

module.exports = JobBoard;