"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const authenticator_1 = require("./authenticator");
const app = (0, express_1.default)();
const db = new sqlite3_1.default.Database('database.db');
const PORT = 3000;
app.use(express_1.default.json());
var array = [];
var currentUser;
let loggedIn = false;
app.get('/', (req, res) => {
    array = [];
    res.setHeader('Content-Type', 'application/json');
    db.all("SELECT * FROM Cars", [], (err, rows) => {
        if (err) {
            res.status(500).send(JSON.stringify({
                "message": "Error retrieving data from database"
            }));
            return;
        }
        rows.forEach((row) => {
            array.push(row);
        });
        res.status(200).send(JSON.stringify(array));
    });
});
app.post('/login', (req, res) => {
    const userName = req.body.user_name;
    const password = req.body.password;
    db.get("SELECT ID, user_name, password, first_name, last_name FROM Users WHERE user_name = ?", [userName], (err, row) => {
        if (err) {
            res.status(500).send(JSON.stringify({
                "message": "Error retrieving data from database",
                "error": `${err.message}`
            }));
            return;
        }
        if (row) {
            let newObject = authenticator_1.userAuthenticator.createObject(row);
            if (newObject.authenticate(userName, password)) {
                currentUser = row;
                loggedIn = true;
                res.status(200).send(JSON.stringify({
                    "message": `Welcome ${row.first_name}`
                }));
            }
        }
        else {
            res.status(404).send(JSON.stringify({
                "message": "Wrong username of password"
            }));
        }
    });
});
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.user_name;
    var count = yield new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) FROM Users WHERE user_name = ?", [userName], (err, row) => {
            if (err) {
                reject(err);
                res.status(500).send(JSON.stringify({
                    "message": "Error retrieving data from database",
                    "error": `${err.message}`
                }));
                return;
            }
            resolve(row);
        });
    });
    if (count > 0) {
        res.status(400).send(JSON.stringify({
            "message": "Username already existed"
        }));
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
        db.run("INSERT INTO Users (user_name, password, first_name, last_name, secure_question1, secure_question2, secure_question3, answer1, answer2, answer3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [userName, password, firstName, lastName, question1, question2, question3, answer1, answer2, answer3], function (err) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    "message": "Error adding data into database",
                    "error": `${err.message}`
                }));
                console.log(err.message);
            }
            else {
                res.status(200).send(JSON.stringify({
                    "message": "Registration successful"
                }));
            }
        });
    }
}));
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
