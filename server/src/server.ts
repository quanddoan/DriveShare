import express, { Express, Request, Response } from 'express'
import sqlite3 from 'sqlite3'
import session from 'express-session'
import { userRecord, userAuthenticator } from './authenticator';
import { layer1, recoveryAnswers } from "./passwordRecovery";

const app: Express = express();
const db = new sqlite3.Database('database.db');
const PORT = 3000;
declare module "express-session" {
    interface SessionData {
        user : userRecord
    }
}

app.use(express.json());
app.use(session({
    secret: "keyboard-cat",
    cookie: {}
}))

interface carInfo {
    ID: number;
    brand: string;
    type: string;
    year: number;
    renter: number;
    lister: number;
}


app.get('/', (req, res) => {
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
});

app.post('/login', (req, res) => {

    const userName = req.body.user_name;
    const password = req.body.password;
    db.get("SELECT ID, user_name, password, first_name, last_name, balance FROM Users WHERE user_name = ?", [userName], (err: Error | null, row: userRecord) => {
        if (err) {
            res.status(500).send(JSON.stringify({
                "message": "Error retrieving data from database",
            }))
            console.log(err.message);
            return;
        }
        if (row) {
            let newObject = userAuthenticator.createObject(row);
            if (newObject.authenticate(userName, password)) {
                var currentUser : userRecord = {
                    ID: row.ID,
                    user_name: row.user_name,
                    password: "",
                    first_name: row.first_name,
                    last_name: row.last_name,
                    balance : row.balance
                };
                req.session.user = currentUser;
                res.status(200).send(JSON.stringify(currentUser))
            }
            else{
                res.status(404).send(JSON.stringify({
                    "message": "Wrong username of password"
                }))
            }
        }
        else {
            res.status(404).send(JSON.stringify({
                "message": "Wrong username of password"
            }))
        }
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).send(JSON.stringify({
            "message": "Logout successfully"
        }))
    });
})

interface userId {
    ID: number
}

app.post('/register', async (req, res) => {
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
            }
        })

    }
})

interface carPrice {
    price: number
}
interface carRenter {
    renter: string
}
app.put('/rent', (req, res) => {
    if (!(req.session.user)) {
        res.status(400).send(JSON.stringify({
            "message": "Function only available after logging in"
        }))
    }
    else {
        const carId = req.body.carId;
        const currentUser = req.session.user;
        db.get(`SELECT renter FROM Cars WHERE ID = ?`, [carId], function (err, row: carRenter) {
            if (row.renter != null) {
                res.status(400).send(JSON.stringify({
                    "message": "Car is already rented"
                }))
                return;
            }
            db.run(`UPDATE Cars SET renter = ? WHERE ID = ?`, [currentUser.ID, carId], function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({
                        "message": "Error modifying database record"
                    }))
                    console.log(err.message);
                    return;
                }
                db.get(`SELECT price FROM Cars WHERE ID = ?`, [carId], function (err, row: carPrice) {
                    if (err) {
                        res.status(500).send(JSON.stringify({
                            "message": "Error retrieving data from database"
                        }))
                        console.log(err.message);
                        return;
                    }
                    db.run(`UPDATE Users SET balance = balance + ? WHERE ID = ?`, [row.price, currentUser.ID], function (err) {
                        if (err) {
                            res.status(500).send(JSON.stringify({
                                "message": "Error adding balance to user record"
                            }))
                            console.log(err.message);
                            return;
                        }
                        db.run(`INSERT INTO Log VALUES (NULL, 'rent', ?, ?)`, [currentUser.ID, carId], function (err) {
                            if (err) {
                                res.status(500).send(JSON.stringify({
                                    "message": "Error creating log entry"
                                }))
                                console.log(err.message);
                                return;
                            }
                            res.status(200).send(JSON.stringify({
                                "message": "Rent successfully"
                            }))
                        })
                    })
                })
            })
        })
    }
})

app.put('/forgotpassword', (req, res) => {
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
})

app.post('/forgotpassword', (req, res) => {
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
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})