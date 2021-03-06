require('dotenv').config();
const express = require('express');
const passport = require("passport");
const app = express();
const path = require('path');
var logger = require('morgan')
const cors = require('cors')
const dbConnection = require('./config/db')
const PORT = process.env.PORT || 3000;
const authRouter = require('./routes/auth.router');
const jobsRouter= require('./routes/job.router')
const profileRouter = require('./routes/addition.router')

// autherization of  passport
const authentication = passport.authenticate('jwt',{ session:false})
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

dbConnection;

app.use(logger('dev'));
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:4200'],
    credentials:true
}));



/*********************** Passport Configration ************************************/


const passportInit = require('./passport-jwt/passport')
passportInit(passport)
app.use(passport.initialize())
//app.use(passport.session())

/*

 *  Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
 *  at the property: projects.angular.architect.build.options.outputPath
 * When you run `ng build`, the output will go to the ./public directory
 
 */

app.use(express.static(path.join(__dirname, 'public')));


// routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/new', profileRouter);

app.use('/api/v1/jobs' ,authentication ,jobsRouter )


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT} , http://localhost/${PORT}`);
})