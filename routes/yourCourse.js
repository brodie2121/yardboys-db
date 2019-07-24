const express = require('express');
const router = express.Router();

const YourCourseModel = require ('../models/yourCourse');

router.get('/home', (req, res, next) => {
    res.send("Welcome to my API").status(200);
});

router.get("/courses/:yourcourse_id?", async (req, res, next) => {
    const yourcourseId = req.params.job_id;
    const yourCourse = await YourCourseModel.getById(yourcourseId);
    res.json(yourCourse).status(200);
});

module.exports = router;