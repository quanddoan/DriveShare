abstract class Builder{
    public abstract setListerId(num : number) : void;
    public abstract setBrand(text: string) : void;
    public abstract setType(text: string) :void;
    public abstract setYear(num : number) : void;
    public abstract setPrice(num : number) : void;
    public abstract setMileage(num : number) : void;
    public abstract setVIN(text : string) :void;
    public abstract setCarId(num : number) : void;
}

class SQLBuilder extends Builder{
    private insertSql : string;
    private selectSql : string;
    private updateSql :string;
    private logSql : string;
    private listerId :string;
    private brand : string;
    private type :string;
    private year : string;
    private price :string;
    private mileage : string;
    private VIN : string;
    private carId :string;
    constructor(){
        super();
        this.selectSql = "SELECT ID FROM Cars WHERE ";
        this.insertSql = "INSERT INTO Cars(lister, brand, type, year, price, mileage, VIN) VALUES ";
        this.updateSql = "UPDATE Cars SET "
        this.logSql = "INSERT INTO Log (Activity, Actor, carId) VALUES "
        this.listerId = "";
        this.brand = "";
        this.type = "";
        this.year = "";
        this.price = "";
        this.mileage = "";
        this.VIN = "";
        this.carId = "";
    }
    public setCarId(num: number): void {
        this.carId = `${num}`;
    }
    public setVIN(text: string): void {
        this.VIN = `'${text}'`;    
    }
    public setListerId(num : number): void {
        this.listerId = `${num}`;
    }
    public setBrand(text: string): void {
        this.brand = `'${text}'`;
    }
    public setType(text: string): void {
        this.type = `'${text}'`;
    }
    public setYear(num: number): void {
        this.year = `${num}`;
    }
    public setMileage(num: number): void {
        this.mileage = `${num}`;
    }
    public setPrice(num: number): void {
        this.price = `${num}`;
    }
    public getResult() : string {
        this.insertSql = this.insertSql + `(${this.listerId}, ${this.brand}, ${this.type}, ${this.year}, ${this.price}, ${this.mileage}, ${this.VIN});`;
        return this.insertSql;
    }
    public getSelectSql() : string {
        this.selectSql = this.selectSql + `VIN = ${this.VIN}`;
        return this.selectSql;
    }
    public getUpdateSql() : string {
        this.updateSql = this.updateSql + `lister = ${this.listerId}, brand = ${this.brand}, type = ${this.type}, year = ${this.year}, price = ${this.price}, mileage = ${this.mileage}, VIN = ${this.VIN} WHERE ID = ${this.carId};`;
        return this.updateSql;
    }
    public getLogSql() : string{
        var activity = "listing";
        if (this.carId != ""){
            activity = "listing adjust";
        }
        this.logSql = this.logSql + `('${activity}', ${this.listerId}, (SELECT ID FROM Cars WHERE VIN = ${this.VIN}));`;
        return this.logSql;
    }
}

export {SQLBuilder}