const express = require('express');
const router = express.Router();

const YourCourseModel = require ('../models/yourCourse');

router.get('/home', (req, res, next) => {
    res.send("Welcome to my API").status(200);
});

router.get("/all", async (req, res, next) => {
    const allCourses = await YourCourseModel.getAll();
    res.json(allCourses).status(200);
});

router.get("/courses/:course_id?", async (req, res, next) => {
    const courseId = req.params.course_id;
    const yourcourse = await YourCourseModel.getById(courseId);
    res.json(yourcourse).status(200);
});

router.put("/course/update/:yourcourse_id?", async (req, res) => {
    const yourcourseId = req.params.yourcourse_id;
    console.log(req.body);
    const { clubName, admin, employees, city, state } = req.body;
    const response = await YourCourseModel.updateCourse( yourcourseId, clubName, admin, employees, city, state );
    console.log("response is", response)
    if (response.command === "UPDATE" && response.rowCount >= 1) {
        res.sendStatus(200);
    } else {
        res.send(`Could not update yourcourse id ${yourcourseId}`).status(409);
    } 
});

module.exports = router;