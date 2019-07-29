const express = require('express');
const router = express.Router();

const JobBoardModel = require ('../models/jobBoard');

router.get('/home', (req, res, next) => {
    res.send("Welcome to my API").status(200);
});

//read all
router.get("/all", async (req, res, next) => {
    const allJobs = await JobBoardModel.getAll();
    res.json(allJobs).status(200);
});

//get jobs by date
router.get('/jobs/${date}', async (req, res, next) => {
    const dateId = req.params.posting_date;
    const date = await JobBoardModel.getJobByDate(dateId);
    res.json(date).status(200);
});


router.get("/jobs/:jobboard_id?", async (req, res, next) => {
    console.log('req.params', req.params);
    const jobboardId = req.params.jobboard_id;
    const theJob = await JobBoardModel.getJobById(jobboardId);
    res.json(theJob).status(200);
});

//delete job
router.get("/delete/:jobboard_id?", async (req, res, next) => {
    const jobboardId = req.params.jobboard_id;
    const response = await JobBoardModel.deleteJob(jobboardId);
    console.log("response", response)
    if (response.command === "DELETE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not delete jobboardId: ${jobboardId}`).status(409);
    }
});

//create new jobboard
router.post("/post/add", async (req,res) => {
    const { date, jobType_id, employee_id, comments } = req.body;
    const response = await JobBoardModel.addNewJobBoard(date, jobType_id, employee_id, comments);
    (response.command === "INSERT" && response.rowCount >= 1) ? res.sendStatus(200) : res.send(`Could not add new jobboard ${jobboard_id}`).status(409);
});

//update jobboard
router.put("/jobs/update/:jobboard_id?", async (req, res) => {
    const jobboardId = req.params.jobboard_id;
    console.log(req.body);
    const { date, jobType, employee, comments } = req.body;
    const response = await JobBoardModel.updateJobBoard(date, jobType, employee, comments, jobboardId);
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update jobboardId ${jobboardId}`).status(409);
    } 
});

module.exports = router;