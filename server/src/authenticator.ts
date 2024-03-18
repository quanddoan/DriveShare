interface userRecord {
    ID: number,
    user_name: string,
    password: string,
    first_name: string,
    last_name: string,
    balance: number
}

class userAuthenticator {
    private static authenticator: userAuthenticator;
    private constructor() {
        this.data = {
            ID : -1,
            user_name : "",
            last_name : "",
            first_name : "",
            password : "",
            balance : -1
        }
    };
    private data: userRecord;
    public static createObject(record: userRecord): userAuthenticator {
        if (!userAuthenticator.authenticator) {
            userAuthenticator.authenticator = new userAuthenticator();
        }
        userAuthenticator.authenticator.data = record;
        return userAuthenticator.authenticator;
    }
    public authenticate(userName: string, passwd: string) {

        if (userName == userAuthenticator.authenticator.data.user_name && passwd == userAuthenticator.authenticator.data.password) {
            return true;
        }
        else {
            return false;
        }
    }
}

export { userRecord, userAuthenticator }

