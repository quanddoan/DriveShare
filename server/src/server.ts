import express, { Express, Request, Response } from 'express'
import sqlite3 from 'sqlite3'
import { userRecord, userAuthenticator } from './authenticator';

const app: Express = express();
const db = new sqlite3.Database('database.db');
const PORT = 3000;

app.use(express.json());

interface carInfo {
    ID: number;
    brand: string;
    type: string;
    year: number;
    renter: number;
    lister: number;
}

var array: carInfo[] = [];
var currentUser: userRecord | null;
let loggedIn = false;

app.get('/', (req, res) => {
    array = [];
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
    db.get("SELECT ID, user_name, password, first_name, last_name FROM Users WHERE user_name = ?", [userName], (err: Error | null, row: userRecord) => {
        if (err) {
            res.status(500).send(JSON.stringify({
                "message": "Error retrieving data from database",
                "error": `${err.message}`
            }))
            return;
        }
        if (row) {
            let newObject = userAuthenticator.createObject(row);
            if (newObject.authenticate(userName, password)) {
                currentUser = row;
                loggedIn = true;
                res.status(200).send(JSON.stringify({
                    "message": `Welcome ${row.first_name}`
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

app.post('/register', async (req, res) => {
    const userName = req.body.user_name;
    var count : number = await new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) FROM Users WHERE user_name = ?", [userName], (err : Error | null, row : number) => {
            if (err){
                reject(err);
                res.status(500).send(JSON.stringify({
                    "message" : "Error retrieving data from database",
                    "error" : `${err.message}`
                }))
                return;
            }
            resolve(row);
        })
    })
    if (count > 0){
        res.status(400).send(JSON.stringify({
            "message" : "Username already existed"
        }))
    }
    else{
        const password = req.body.password;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const question1 = req.body.question1;
        const answer1 = req.body.answer1;
        const answer2 = req.body.answer2;
        const answer3 = req.body.answer3;
        const question2 = req.body.question2;
        const question3 = req.body.question3;

        db.run("INSERT INTO Users (user_name, password, first_name, last_name, secure_question1, secure_question2, secure_question3, answer1, answer2, answer3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [userName, password, firstName, lastName, question1, question2, question3, answer1, answer2, answer3], function (err) {
            if (err){
                res.status(500).send(JSON.stringify({
                    "message" : "Error adding data into database",
                    "error" : `${err.message}`
                }))
                console.log(err.message);
            }
            else{
                res.status(200).send(JSON.stringify({
                    "message" : "Registration successful"
                }))
            }
        })
        
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})