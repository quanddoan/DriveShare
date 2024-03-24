import express, { Express, Request, Response } from 'express'
import session from 'express-session'
import sqlite3 from 'sqlite3';
import { userRecord, userAuthenticator } from './authenticator';
import { layer1, recoveryAnswers } from "./passwordRecovery";
import { SQLBuilder } from './carBuilder';
import { proxyPayment, realPayment } from './paymentProxy';
import { notification, eventListener } from './notificationObserver';

const app: Express = express();
const db = new sqlite3.Database('database.db');
const PORT = 3000;
declare module "express-session" {
    interface SessionData {
        user: userRecord
    }
}

app.use(express.json());
app.use(session({
    secret: "keyboard-cat",
    cookie: {}
}))

//Structs used to retrieve data from database in specific formats
interface carInfo {
    ID: number;
    lister: number;
    brand: string;
    type: string;
    year: number;
    renter: number;
    price: number;
    mileage: number;
    VIN: string;
}

interface userId {
    ID: number
}

interface carID {
    ID: number
}

interface carActor {
    renter: number,
    lister: number
}

interface getBalance {
    balance: number
}

interface getLister {
    lister: number
}

interface getRequest {
    carID: number,
    userID: number
}

//Server logic
//Get all listed cars
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        var array: carInfo[] = [];
        db.all("SELECT * FROM Cars", [], (err, rows: carInfo[]) => {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database"
                }))
                return;
            }

            rows.forEach((row) => {
                array.push(row)
            })
            res.status(200).send(JSON.stringify(array))
        });
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
});

//User login
app.post('/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const userName = req.body.user_name;
        const password = req.body.password;
        db.all("SELECT ID, user_name, password, first_name, last_name, balance FROM Users", [], function (err, rows: userRecord[]) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database",
                }))
                console.log(err.message);
                return;
            }
            //Use userAuthenticator singleton class to authenticate user
            let newObject = userAuthenticator.createObject(rows);
            if (newObject.authenticate(userName, password)) {
                var currentUser: userRecord;
                rows.forEach((row) => {
                    if (row.user_name == userName) {
                        currentUser = row;
                        //Create session user data
                        req.session.user = currentUser;
                        res.status(200).send(JSON.stringify(currentUser));
                        return;
                    }
                })
                return;
            }
            else {
                res.status(404).send(JSON.stringify({
                    "message": "Wrong username of password"
                }))
            }
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Destroy session when user log out
app.get('/logout', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        req.session.destroy(() => {
            res.status(200).send(JSON.stringify({
                "message": "Logout successfully"
            }))
        });
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//User registration
app.post('/register', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (req.body.user_name == undefined) {
            res.status(400).send(JSON.stringify({
                "message": "Bad request"
            }))
            return;
        }
        const userName = req.body.user_name;
        //Check if username is unique
        var count: userId = await new Promise((resolve, reject) => {
            db.get("SELECT ID FROM Users WHERE user_name = ?", [userName], (err: Error | null, row: userId) => {
                if (err) {
                    reject(err);
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving data from database",
                    }))
                    console.log(err.message);
                    return;
                }
                resolve(row);
            })
        })
        //If username already existed, forbid registering
        if (count != undefined) {
            res.status(400).send(JSON.stringify({
                "message": "Username already existed"
            }))
        }
        else {
            if (req.body.password == undefined || req.body.first_name == undefined
                || req.body.last_name == undefined || req.body.question1 == undefined
                || req.body.question2 == undefined || req.body.question3 == undefined
                || req.body.answer1 == undefined || req.body.answer2 == undefined ||
                req.body.answer3 == undefined) {
                res.status(400).send(JSON.stringify({
                    "message": "Bad request"
                }))
                return;
            }

            const password = req.body.password;
            const firstName = req.body.first_name;
            const lastName = req.body.last_name;
            const question1 = req.body.question1;
            const answer1 = req.body.answer1;
            const answer2 = req.body.answer2;
            const answer3 = req.body.answer3;
            const question2 = req.body.question2;
            const question3 = req.body.question3;

            db.run("INSERT INTO Users (user_name, password, first_name, last_name, question1, question2, question3, answer1, answer2, answer3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [userName, password, firstName, lastName, question1, question2, question3, answer1, answer2, answer3], function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error adding data into database",
                    }))
                    console.log(err.message);
                    return;
                }
                else {
                    res.status(200).send(JSON.stringify({
                        "message": "Registration successful"
                    }))
                    //Update user records in userAuthenticator class
                    db.all("SELECT ID, user_name, password, first_name, last_name, balance FROM Users", [], function (err, rows: userRecord[]) {
                        userAuthenticator.createObject(rows);
                    })
                }
            })

        }
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Booking request
app.put('/rent', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        //Check if user is logged in
        if (!(req.session.user)) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }))
        }
        else {
            if (req.body.carId == undefined || req.body.start_date == undefined
                || req.body.end_date == undefined) {
                res.status(400).send(JSON.stringify({
                    "message": "Bad request"
                }))
                return;
            }

            const carId = req.body.carId;
            const currentUser = req.session.user;
            const startDate = req.body.start_date;
            const endDate = req.body.end_date;
            //Check if car is already rented
            db.get(`SELECT renter, lister FROM Cars WHERE ID = ?`, [carId], function (err, row: carActor) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving data from database"
                    }))
                    return;
                }

                if (row.renter != null) {
                    res.status(400).send(JSON.stringify({
                        "message": "Car is already rented"
                    }))
                    return;
                }
                var carOwner = row.lister;
                //Create new booking request record in database
                db.run(`INSERT INTO Requests (userID, carID, start_date, end_date) VALUES (?, ?, ?, ?)`, [currentUser.ID, carId, startDate, endDate], function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Error adding booking request"
                        }))
                        console.log(err.message);
                        return;
                    }
                    //Create new log entry
                    db.run(`INSERT INTO Log VALUES (NULL, 'book request', ?, ?)`, [currentUser.ID, carId], function (err) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error creating log entry"
                            }))
                            console.log(err.message);
                            return;
                        }
                        res.status(200).send(JSON.stringify({
                            "message": "Booking request successful"
                        }))
                        //Notify observer of event
                        var eventSubscribe = new eventListener();
                        eventSubscribe.markHappened(carOwner, carId, "book");
                        eventSubscribe.subscribe(carId, currentUser.ID, "approve");
                        eventSubscribe.subscribe(carId, currentUser.ID, "deny");
                        eventSubscribe.subscribe(carId, currentUser.ID, "review");
                    })
                })
            })
        }
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Approve request
app.put('/confirm', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        //Check if user is logged in
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }))
            return;
        }

        if (req.body.requestID == undefined || req.body.action == undefined) {
            res.status(400).send(JSON.stringify({
                "message": "Bad request"
            }))
            return;
        }

        const requestID = req.body.requestID;
        const action = req.body.action;
        //Find request
        db.get(`SELECT carID, userID FROM Requests WHERE requestID = ?;`, [requestID], function (err, row: getRequest) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database"
                }))
                console.log(err.message);
                return;
            }

            if (row == undefined) {
                res.status(400).send(JSON.stringify({
                    "message": "Request not found"
                }))
                return;
            }

            let requester = row.userID;
            let vehicle = row.carID;
            //Check if current user and lister are the same
            db.get(`SELECT lister FROM Cars WHERE ID = ?`, [vehicle], function (err, row: getLister) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving data from database"
                    }))
                    console.log(err.message);
                    return;
                }
                if (req.session.user?.ID != row.lister) {
                    res.status(400).send(JSON.stringify({
                        "message": "Only lister can take action on booking request"
                    }))
                    return;
                }

                if (action == "appove") {
                    //Update car record to reflect new renter
                    db.run(`UPDATE Cars SET renter = ? WHERE ID = ?`, [requester, vehicle], function (err) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error retrieving data from database"
                            }))
                            console.log(err.message);
                            return;
                        }
                        //Debit renter balance
                        db.run(`UPDATE Users SET balance = balance + (SELECT Price FROM Cars WHERE Cars.ID = ?) WHERE Users.ID = ?`, [vehicle, requester], function (err) {
                            if (err) {
                                res.status(500).send(JSON.stringify({
                                    "message": "Error retrieving data from database"
                                }))
                                console.log(err.message);
                                return;
                            }
                            //Create new log entry
                            db.run(`INSERT INTO Log (Activity, Actor, carID) VALUES ('approve request', ?, ?)`, [req.session.user?.ID, vehicle], function (err) {
                                if (err) {
                                    res.status(500).send(JSON.stringify({
                                        "message": "Error retrieving data from database"
                                    }))
                                    console.log(err.message);
                                    return;
                                }
                                //Remove approved request from database
                                db.run(`DELETE FROM Requests WHERE requestID = ?`, [requestID], function (err) {
                                    if (err) {
                                        res.status(500).send(JSON.stringify({
                                            "message": "Error retrieving data from database"
                                        }))
                                        console.log(err.message);
                                        return;
                                    }
                                    res.status(200).send(JSON.stringify({
                                        "message": "Booking approved"
                                    }))
                                    //Notify observer of the confirmation
                                    var eventNotify = new eventListener();
                                    eventNotify.markHappened(requester, vehicle, "approve");
                                })
                            })
                        })

                    })
                }
                else if (action == "deny"){
                    db.run(`INSERT INTO Log (Activity, Actor, carID) VALUES ('deny request', ?, ?)`, [req.session.user.ID, vehicle], function (err) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error retrieving data from database"
                            }))
                            console.log(err.message);
                            return;
                        }

                        db.run(`DELETE FROM Requests WHERE requestID = ?`, [requestID], function (err) {
                            if (err) {
                                res.status(500).send(JSON.stringify({
                                    "message": "Error retrieving data from database"
                                }))
                                console.log(err.message);
                                return;
                            }

                            var eventNotify = new eventListener();
                            eventNotify.markHappened(requester, vehicle, "deny");

                            res.status(200).send(JSON.stringify({
                                "message" : "Request has been denied"
                            }))
                        })
                    })
                }
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Retrieve security questions
app.put('/forgotpassword', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        db.get(`SELECT question1, question2, question3 FROM Users WHERE user_name = ?`, [req.body.user_name], function (err, row) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retreiving data from database"
                }))
                console.log(err.message);
                return;
            }
            res.status(200).send(JSON.stringify(row))
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Password recovery
app.post('/forgotpassword', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const userAnswer: recoveryAnswers = {
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3
        }
        //Retrieve correct answers
        db.get(`SELECT answer1, answer2, answer3 FROM Users WHERE user_name = ?`, [req.body.user_name], function (err, row: recoveryAnswers) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retreiving data from database"
                }))
                console.log(err.message);
                return;
            }
            //Pass the correct answers to Chain of Responsibilities
            var authenticateAnswers = new layer1(row);
            //Validate user answers
            var allCorrect = authenticateAnswers.checkAnswer(userAnswer);
            if (!allCorrect) {
                res.status(400).send(JSON.stringify({
                    "message": "One or more answers are wrong"
                }));
            }
            else {
                //Change password in user record
                db.run(`UPDATE Users SET password = ? WHERE user_name = ?`, [req.body.password, req.body.user_name], function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Error retreiving data from database"
                        }))
                        console.log(err.message);
                        return;
                    }
                    else {
                        res.status(200).send(JSON.stringify({
                            "message": "Password changed successfully"
                        }))
                    }
                })
            }
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//List car for rent
app.post('/list', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthrorized access"
            }))
            return;
        }
        //Initiate builder class and pass parameters
        var builderObj = new SQLBuilder();
        var user = req.session.user.ID;
        builderObj.setListerId(user);
        builderObj.setBrand(req.body.brand);
        builderObj.setType(req.body.type);
        builderObj.setYear(req.body.year);
        builderObj.setPrice(req.body.price);
        builderObj.setMileage(req.body.mileage);
        builderObj.setVIN(req.body.VIN);

        //Check if car is already listed and the request is not an adjustment
        var sql = builderObj.getSelectSql();
        db.get(sql, function (err, row) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Server error"
                }))
                console.log(err.message);
                return;
            }

            if (row && req.body.carId == -1) {
                res.status(400).send(JSON.stringify({
                    "message": "Car is already listed"
                }))
                return;
            }

            //Get SQL to insert new car record/amend existing record
            sql = builderObj.getResult();
            if (row && req.body.carId != -1) {
                builderObj.setCarId(req.body.carId);
                sql = builderObj.getUpdateSql();
            }

            db.run(sql, function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Listing failed error"
                    }))
                    console.log(err.message);
                    return;
                }
                //Create new log entry
                sql = builderObj.getLogSql();
                db.run(sql, function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Adding log record failed"
                        }))
                        console.log(err.message);
                        return;
                    }
                    //Notify observer of event
                    db.get(`SELECT ID FROM Cars WHERE VIN = ?`, [req.body.VIN], function (err, row: carID) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error retreiving data from database"
                            }))
                            console.log(err.message);
                            return;
                        }

                        //Subscribe lister to booking request observer and review observer
                        var carID = row.ID;
                        var eventSubscribe = new eventListener();
                        eventSubscribe.subscribe(carID, user, "book");
                        eventSubscribe.subscribe(carID, user, "review");

                        res.status(200).send(JSON.stringify({
                            "message": "Listing successful"
                        }))
                    })
                })
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

app.put('/delist', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.session.user) {
        res.status(401).send(JSON.stringify({
            "message": "Unauthrorized access"
        }))
        return;
    }

    try {
        var carId = req.body.carId;
        var userID = req.session.user.ID;

        db.get(`SELECT lister FROM Cars WHERE ID = ?`, [carId], function (err, row: getLister) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retreiving data from database"
                }))
                console.log(err.message);
                return;
            }

            if (row.lister != userID) {
                res.status(401).send(JSON.stringify({
                    "message": "Only car owner can delist"
                }))
                return;
            }

            db.run(`DELETE FROM Cars WHERE ID = ?`, [carId], function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retreiving data from database"
                    }))
                    console.log(err.message);
                    return;
                }

                res.status(200).send(JSON.stringify({
                    "message": "Delist successfully"
                }))
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Balance payment
app.put('/payment', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }))
            return;
        }
        //Check that payment is valid
        if (req.body.amount < 0) {
            res.status(400).send(JSON.stringify({
                "message": "Amount can not be less than 0"
            }))
            return;
        }

        //Check if amount paid is valid
        var amountPaid = req.body.amount;
        const userID = req.session.user.ID;
        db.get(`SELECT balance FROM Users WHERE ID = ?`, [userID], function (err, row: getBalance) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database"
                }))
                console.log(err.message);
                return;
            }

            if (row.balance < amountPaid) {
                res.status(400).send(JSON.stringify({
                    "message": "Amount is more than outstanding balance"
                }))
                return;
            }

            //Initiate proxy and payment system
            var paymentSystem = new realPayment(db);
            var paymentProxy = new proxyPayment(paymentSystem);
            var successfulPay = paymentProxy.processPayment(userID, amountPaid);
            if (!successfulPay) {
                res.status(500).send(JSON.stringify({
                    "message": "Payment failed"
                }))
                return;
            }

            //Return new balance
            db.get(`SELECT balance FROM Users WHERE ID = ?`, [userID], function (err, row: getBalance) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving data from database"
                    }))
                    console.log(err.message);
                    return;
                }

                res.status(200).send(JSON.stringify({
                    "message": `Payment successful. New balance: ${row.balance}`
                }))
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Get notification for current user
app.get('/notification', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }))
            return;
        }

        //Get all notifications and bundle into an array
        var userId = req.session.user.ID;
        var eventNotify = new eventListener();

        var totalNotifications: notification[] = [];
        totalNotifications = eventNotify.update(userId);

        res.status(200).send(JSON.stringify(totalNotifications));
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Get unapproved requests for current user
app.get('/request', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }))
            return;
        }

        var currentUserID = req.session.user.ID;
        //Find requests
        db.all(`SELECT requestID, carID, start_date, end_date, first_name, last_name, user_name FROM (Requests, Users) WHERE Users.ID = userID AND carID IN (SELECT ID FROM Cars WHERE lister = ?);`, [currentUserID], function (err, rows) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database"
                }))
                console.log(err.message);
                return;
            }

            var requestDetails: Array<any> = [];
            rows.forEach((row) => {
                requestDetails.push(row);
            })
            res.status(200).send(JSON.stringify(requestDetails));
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Post review for a vehicle
app.post('/review', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }));
            return;
        }

        const { Rating, Review, CarID } = req.body;
        const ActorID = req.session.user.ID;

        //Create new review record
        db.run(
            "INSERT INTO Reviews (ActorID, Rating, Reviews, CarID) VALUES (?, ?, ?, ?);",
            [ActorID, Rating, Review, CarID],
            function (err: Error | null) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error adding review to database",
                    }));
                    console.log(err.message);
                } else {
                    //Notify observer that event happened
                    db.get(`SELECT renter, lister FROM Cars WHERE ID = ?`, [CarID], function (err, row: carActor) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error retrieving data from database",
                            }));
                            console.log(err.message);
                            return;
                        }

                        var eventSubscribe = new eventListener();
                        eventSubscribe.markHappened(row.lister, CarID, "review");
                        eventSubscribe.markHappened(row.renter, CarID, "review");
                        //Create new log entry
                        db.run(`INSERT INTO Log (Activity, Actor, carID) VALUES ('Review posted', ?, ?)`, [ActorID, CarID], function (err) {
                            if (err) {
                                res.status(500).send(JSON.stringify({
                                    "message": "Error adding review to database",
                                }));
                                console.log(err.message);
                                return;
                            }

                            res.status(200).send(JSON.stringify({
                                "message": "Review posted"
                            }))
                        })
                    })
                }
            }
        );
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Get reviews
app.put('/review', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.session.user) {
        res.status(401).send(JSON.stringify({
            "message": "Unauthorized access"
        }));
        return;
    }
    try {
        var vechileID = req.body.carID;

        if (vechileID == undefined) {
            res.status(400).send(JSON.stringify({
                "message": "Bad request"
            }))
            return;
        }
        //Retrieve reviews
        db.all(`SELECT Reviews.ID, CarID, first_name, last_name, Rating, Reviews FROM (Reviews, Users) WHERE CarID = ? AND ActorID = Users.ID`, [vechileID], function (err, rows: Array<any>) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database"
                }))
                console.log(err.message);
                return;
            }
            res.status(200).send(JSON.stringify(rows));
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e);
    }
})

//Get all log entries
app.get('/history', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.session.user) {
        res.status(401).send(JSON.stringify({
            "message": "Unauthorized access"
        }));
        return;
    }
    try {
        const ActorID = req.session.user.ID;
        //Retrieve log entries
        db.all(
            "SELECT * FROM Log WHERE Actor = ?;",
            [ActorID],
            (err: Error | null, rows: Array<any>) => {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving history from database",
                    }));
                    console.log(err.message);
                } else {
                    res.status(200).send(JSON.stringify(rows));
                }
            }
        );
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e)
    }
})

app.post('/mail', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }));
            return;
        }

        var sender = req.session.user.ID;
        var receiver = req.body.to;
        var message = req.body.message;

        db.get(`SELECT ID FROM Users WHERE user_name = ?`, [receiver], function (err, row: userId) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving history from database",
                }));
                console.log(err.message);
                return;
            }

            var receiverID = row.ID;
            var mailListener = new eventListener();
            mailListener.subscribe(sender, receiverID, "mail");

            db.run(`INSERT INTO Mail (sender, receiver, message) VALUES (?, ?, ?)`, [sender, receiverID, message], function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving history from database",
                    }));
                    console.log(err.message);
                    return;
                }

                mailListener.markHappened(receiverID, sender, "mail");

                res.status(200).send(JSON.stringify({
                    "message": "Mail sent"
                }))
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e)
    }
})

app.get('/mail', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (!req.session.user) {
            res.status(401).send(JSON.stringify({
                "message": "Unauthorized access"
            }));
            return;
        }

        var user = req.session.user.ID;
        db.all(`SELECT user_name, first_name, last_name, message FROM (Mail, Users) WHERE receiver = ? AND Users.ID = sender`, [user], function (err, rows) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving history from database",
                }));
                console.log(err.message);
                return;
            }

            db.run(`DELETE FROM Mail WHERE receiver = ?`, [user], function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error retrieving history from database",
                    }));
                    console.log(err.message);
                    return;
                }

                res.status(200).send(JSON.stringify(rows));
            })

        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
        console.log(e)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
