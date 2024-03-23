interface userRecord {
    ID: number,
    user_name: string,
    password: string,
    first_name: string,
    last_name: string,
    balance: number
}

//Singleton Authenticator
class userAuthenticator {
    private static authenticator: userAuthenticator;
    private constructor() {
        this.data = []
    };
    private data: userRecord[];
    //Pass user records when creating objects
    public static createObject(record: userRecord[]): userAuthenticator {
        if (!userAuthenticator.authenticator) {
            userAuthenticator.authenticator = new userAuthenticator();
        }
        userAuthenticator.authenticator.data = record;
        return userAuthenticator.authenticator;
    }
    //Returns true if record is found and matched
    public authenticate(userName: string, passwd: string) {
        var result = false;
        this.data.forEach((record) => {
            if (record.user_name == userName){
                if (record.password == passwd){
                    result = true;
                    return;
                }
            }
        })
        return result;
    }
}

export { userRecord, userAuthenticator }

