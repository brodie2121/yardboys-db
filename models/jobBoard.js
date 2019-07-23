const db = require('./conn.js');

class JobBoard{
    constructor(id, date, jobType, employee_id, comments) {
        this.id = id;
        this.date = date;
        this.jobType = jobType;
        this.employee = employee_id;
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
    static async getJobBoardByDate(date) {
        try {
            const response = await db.one(`select * from jobboard order by date where date = ${date}`);
            return response;
        } catch (err) {
            return err.message;
        }
    }

    //add jobs
    static async addNewJobBoard(date, jobType, employee_id, comments) {
        const query = `insert into jobboard
        (date, jobType, employee, comments)
    Values ('${date}', '${jobType}', '${employee_id}', '${comments}')`;
        try {
            let response = await db.result(query);
            return response;
        } catch (err) {
            console.log('Error', err.message);
            return err;
        }
    }

    static async updateJobBoard(jobboardId, date, jobType, employee_id, comments) {
        const query = `
            UPDATE jobboard 
            SET 
                date = '${date}', 
                jobtype = '${jobType}', 
                employee_id = '${employee_id}', 
                comments = '${comments}', 
            WHERE 
                id = '${jobboardId}'`;
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