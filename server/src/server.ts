import express, { Express, Request, Response } from 'express'
import session from 'express-session'
import sqlite3 from 'sqlite3';
import { userRecord, userAuthenticator } from './authenticator';
import { layer1, recoveryAnswers } from "./passwordRecovery";
import { SQLBuilder } from './carBuilder';
import { proxyPayment, realPayment } from './paymentProxy';
import { request } from 'http';
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

interface carPrice {
    price: number
}

interface carRenter {
    renter: string
}

interface getBalance {
    balance: number
}

interface getLister{
    lister : number
}

interface getRequest {
    carID: number,
    userID: number
}

app.get('/', (req, res) => {
    try {
        var array: carInfo[] = [];
        res.setHeader('Content-Type', 'application/json');
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
    }
});

app.post('/login', (req, res) => {
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
            let newObject = userAuthenticator.createObject(rows);
            if (newObject.authenticate(userName, password)) {
                var currentUser: userRecord;
                rows.forEach((row) => {
                    if (row.user_name == userName) {
                        currentUser = row;
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
    }
})

app.get('/logout', (req, res) => {
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
    }
})

app.post('/register', async (req, res) => {
    try {
        if (req.body.user_name == undefined) {
            res.status(400).send(JSON.stringify({
                "message": "Bad request"
            }))
            return;
        }
        const userName = req.body.user_name;
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
    }
})

app.put('/rent', (req, res) => {
    try {
        if (!(req.session.user)) {
            res.status(400).send(JSON.stringify({
                "message": "Function only available after logging in"
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
            db.get(`SELECT renter FROM Cars WHERE ID = ?`, [carId], function (err, row: carRenter) {
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
                db.run(`INSERT INTO Requests (userID, carID) VALUES (?, ?)`, [currentUser.ID, carId], function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Error adding booking request"
                        }))
                        console.log(err.message);
                        return;
                    }
                    db.run(`INSERT INTO Log VALUES (NULL, 'book request', ?, ?, ?, ?)`, [currentUser.ID, carId, startDate, endDate], function (err) {
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
                    })
                })
            })
        }
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
    }
})

app.put('/confirm', (req, res) => {
    try {
        if (!req.session.user) {
            res.status(400).send(JSON.stringify({
                "message": "Function only available after logging in"
            }))
            return;
        }

        if (req.body.requestID == undefined) {
            res.status(400).send(JSON.stringify({
                "message": "Bad request"
            }))
            return;
        }

        const requestID = req.body.requestID;
        db.get(`SELECT carID, userID FROM Requests WHERE requestID = ?;`, [requestID], function (err, row: getRequest) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database"
                }))
                console.log(err.message);
                return;
            }

            if (row == undefined){
                res.status(400).send(JSON.stringify({
                    "message": "Request not found"
                }))
                return;
            }

            let actor = row.userID;
            let vehicle = row.carID;
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
                        "message": "Only lister can confirm booking request"
                    }))
                    return;
                }

                db.run(`UPDATE Cars SET renter = ? WHERE ID = ?`, [actor, vehicle], function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Error retrieving data from database"
                        }))
                        console.log(err.message);
                        return;
                    }

                    db.run(`UPDATE Users SET balance = balance + (SELECT Price FROM Cars WHERE Cars.ID = ?) WHERE Users.ID = ?`, [vehicle, actor], function (err) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error retrieving data from database"
                            }))
                            console.log(err.message);
                            return;
                        }

                        db.run(`INSERT INTO Log (Activity, Actor, carID) VALUES ('confirm', ?, ?)`, [req.session.user?.ID, vehicle], function (err) {
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
                                res.status(200).send(JSON.stringify({
                                    "message" : "Booking approved"
                                }))
                            })
                        })
                    })

                })
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
    }
})

app.put('/forgotpassword', (req, res) => {
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
    }
})

app.post('/forgotpassword', (req, res) => {
    try {
        const userAnswer: recoveryAnswers = {
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3
        }
        db.get(`SELECT answer1, answer2, answer3 FROM Users WHERE user_name = ?`, [req.body.user_name], function (err, row: recoveryAnswers) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error retreiving data from database"
                }))
                console.log(err.message);
                return;
            }
            var authenticateAnswers = new layer1(row);
            var allCorrect = authenticateAnswers.checkAnswer(userAnswer);
            if (!allCorrect) {
                res.status(400).send(JSON.stringify({
                    "message": "One or more answers are wrong"
                }));
            }
            else {
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
    }
})

app.post('/list', async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(400).send(JSON.stringify({
                "message": "Registered user only"
            }))
            return;
        }
        var builderObj = new SQLBuilder();
        builderObj.setListerId(req.session.user.ID);
        builderObj.setBrand(req.body.brand);
        builderObj.setType(req.body.type);
        builderObj.setYear(req.body.year);
        builderObj.setPrice(req.body.price);
        builderObj.setMileage(req.body.mileage);
        builderObj.setVIN(req.body.VIN);

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

                sql = builderObj.getLogSql();
                db.run(sql, function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Adding log record failed"
                        }))
                        console.log(err.message);
                        return;
                    }

                    res.status(200).send(JSON.stringify({
                        "message": "Listing successful"
                    }))
                })
            })
        })
    }
    catch (e) {
        res.status(500).send(JSON.stringify({
            "message": "Server error"
        }))
    }
})

app.put('/payment', (req, res) => {
    try {
        if (!req.session.user) {
            res.status(400).send(JSON.stringify({
                "message": "Function only available after loggin in"
            }))
            return;
        }

        if (req.body.amount < 0) {
            res.status(400).send(JSON.stringify({
                "message": "Amount can not be less than 0"
            }))
            return;
        }

        var amountPaid = req.body.amount;
        const userID = req.session.user.ID;
        db.get(`SELECT balance FROM Users WHERE ID = ?`, [userID], function (err, row: getBalance) {
            if (err) {
                res.status(400).send(JSON.stringify({
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

            var paymentSystem = new realPayment(db);
            var paymentProxy = new proxyPayment(paymentSystem);
            var successfulPay = paymentProxy.processPayment(userID, amountPaid);
            if (!successfulPay) {
                res.status(500).send(JSON.stringify({
                    "message": "Payment failed"
                }))
                return;
            }

            db.get(`SELECT balance FROM Users WHERE ID = ?`, [userID], function (err, row: getBalance) {
                if (err) {
                    res.status(400).send(JSON.stringify({
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
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})