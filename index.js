//module
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
require('dotenv').config();

//config express
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

//middleware passport jwt
const passportJWT = require('./lib/passport-jwt');
app.use(passportJWT.initialize());

//router
const router = require('./router');
app.use(router);

//error handling middleware (internal server error)
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: "Fail",
        errors: err.message
    });
});

//error handling middleware (404 handler)
app.use((req, res, next) => {
    res.status(404).json({
        errors: "API Not Found"
    });
});

//server running
app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});