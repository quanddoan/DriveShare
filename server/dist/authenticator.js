"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthenticator = void 0;
class userAuthenticator {
    constructor(record) {
        userAuthenticator.authenticator = this;
        userAuthenticator.data = record;
    }
    ;
    static createObject(record) {
        if (userAuthenticator.authenticator == null) {
            return new userAuthenticator(record);
        }
        else {
            userAuthenticator.data = record;
            return userAuthenticator.authenticator;
        }
    }
    static isLoggedIn() {
        return userAuthenticator.loggedIn;
    }
    authenticate(userName, passwd) {
        if (userName == userAuthenticator.data.user_name && passwd == userAuthenticator.data.password) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.userAuthenticator = userAuthenticator;
userAuthenticator.loggedIn = false;
