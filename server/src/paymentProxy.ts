import sqlite3 from 'sqlite3'

abstract class rentalPayment {
    public abstract processPayment(from : number, amount : number) : boolean;
}

//Actual payment
class realPayment extends rentalPayment {
    private db : sqlite3.Database;
    constructor(obj : sqlite3.Database) {
        super();
        this.db = obj;
    }
    public processPayment(from: number, amount: number): boolean {
        this.db.run(`UPDATE Users SET balance = balance - ? WHERE ID = ?`, [amount, from], function (err) {
            if (err){
                console.log(err.message);
                return false;
            }
        })   
        return true; 
    }
}

//Proxy payment
class proxyPayment extends rentalPayment {
    private object : rentalPayment;
    constructor(paymentObj : rentalPayment) {
        super();
        this.object = paymentObj;
    }
    public processPayment(from: number, amount: number): boolean {
        var result = this.object.processPayment(from, amount);
        return result;    
    }
}

export { proxyPayment, realPayment }