const express = require('express');
    path = require('path');
    cookieParser = require('cookie-parser');
    logger = require('morgan');
    cors = require('cors');

const indexRouter = require('./routes/index');
    usersRouter = require('./routes/users');
    JobBoardRouter = require('./routes/JobBoard');
    employeeRouter = require('./routes/employee');
    sprayChartRouter = require('./routes/sprayChart');
    JobTypeRouter = require('./routes/jobType');
    YourCourseRouter = require('./routes/yourCourse');

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/jobboard', JobBoardRouter);
app.use('/employee', employeeRouter);
app.use('/spraychart', sprayChartRouter);
app.use('/jobtype', JobTypeRouter);
app.use('/yourcourse', YourCourseRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
