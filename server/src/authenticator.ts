interface userRecord {
    ID: number,
    user_name: string,
    password: string,
    first_name: string,
    last_name: string,
    
}

class userAuthenticator {
    private static authenticator: userAuthenticator | null;
    private static loggedIn: Boolean = false;
    private constructor(record: userRecord) {
        userAuthenticator.authenticator = this;
        userAuthenticator.data = record;
    };
    private static data: userRecord;
    public static createObject(record: userRecord): userAuthenticator {
        if (userAuthenticator.authenticator == null) {
            return new userAuthenticator(record);
            
        }
        else {
            userAuthenticator.data = record;
            return userAuthenticator.authenticator;
            
        }
    }
    public static isLoggedIn() {
        return userAuthenticator.loggedIn;
    }
    public authenticate(userName: string, passwd: string) {

        if (userName == userAuthenticator.data.user_name && passwd == userAuthenticator.data.password) {
            
            return true;
        }
        else {
            return false;
        }
    }
    
    
}

export { userRecord, userAuthenticator }

