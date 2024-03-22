interface notification {
    notification: string
}

interface subscriberObj {
    userId: number,
    carId: number,
    object: notifier,
    happened: boolean
}

class notifier {
    private notificationObj: notification = {
        notification: ""
    };
    public notify(message: string): notification {
        this.notificationObj.notification = message;
        return this.notificationObj
    }
}

abstract class eventListener {
    public abstract subscribe(carId: number, userID: number): void;
    public abstract unsubscribe(element: subscriberObj): void;
    public abstract update(user: number, vehicle: number): notification[];
    public abstract markHappened(user: number, vehicle: number): void;
}

class bookRequestEventListener extends eventListener {
    private static subscribers: subscriberObj[] = [];
    public subscribe(carId: number, userID: number): void {
        bookRequestEventListener.subscribers.push({
            userId: userID,
            carId: carId,
            object: new notifier(),
            happened: false
        })
    }
    private find(userId: number, carId: number = -1): subscriberObj[] {
        var resultArr : subscriberObj[]= [];
        for (var i = 0; i < bookRequestEventListener.subscribers.length; i++){
            if (bookRequestEventListener.subscribers[i].userId == userId){
                if (carId != -1){
                    if (bookRequestEventListener.subscribers[i].carId == carId){
                        resultArr.push(bookRequestEventListener.subscribers[i]);
                    }
                }
                else {
                    resultArr.push(bookRequestEventListener.subscribers[i]);
                }
            }
        }
        return resultArr;
    }
    public unsubscribe(element: subscriberObj): void {
        var index;
        index = bookRequestEventListener.subscribers.indexOf(element);
        bookRequestEventListener.subscribers.splice(index, 1);
    }
    public update(user: number): notification[] {
        var notificationArr: notification[] = [];
        this.find(user).forEach((obj) => {
            if (obj.happened) {
                notificationArr.push(obj.object.notify(`A booking request for ${obj.carId} was submitted`));
                this.unsubscribe(obj);
            }
        })
        return notificationArr;
    }
    public markHappened(user: number, vehicle: number): void {
        var event = this.find(user, vehicle);
        for (var i = 0; i < event.length; i++) {
            event[i].happened = true;
        }
    }
}

class confirmRequestEventListener extends eventListener {
    private static subscribers: subscriberObj[] = [];
    public subscribe(carId: number, userID: number): void {
        confirmRequestEventListener.subscribers.push({
            userId: userID,
            carId: carId,
            object: new notifier(),
            happened: false
        })
    }
    private find(userId: number, carId: number = -1): subscriberObj[] {
        var resultArr : subscriberObj[]= [];
        for (var i = 0; i < confirmRequestEventListener.subscribers.length; i++){
            if (confirmRequestEventListener.subscribers[i].userId == userId){
                if (carId != -1){
                    if (confirmRequestEventListener.subscribers[i].carId == carId){
                        resultArr.push(confirmRequestEventListener.subscribers[i]);
                    }
                }
                else{
                    resultArr.push(confirmRequestEventListener.subscribers[i]);
                }
            }
        }
        return resultArr;
    }
    public unsubscribe(element: subscriberObj): void {
        var index;
        index = confirmRequestEventListener.subscribers.indexOf(element);
        confirmRequestEventListener.subscribers.splice(index, 1);
    }
    public update(user: number): notification[] {
        var notificationArr: notification[] = [];
        this.find(user).forEach((obj) => {
            if (obj.happened) {
                notificationArr.push(obj.object.notify(`Booking request for ${obj.carId} was approved`));
                this.unsubscribe(obj);
            }
        })
        return notificationArr;
    }
    public markHappened(user: number, vehicle: number): void {
        var event = this.find(user, vehicle);
        for (var i = 0; i < event.length; i++) {
            event[i].happened = true;
        }
    }
}

class reviewPostEventListener extends eventListener {
    private static subscribers: subscriberObj[] = [];
    public subscribe(carId: number, userID: number): void {
        reviewPostEventListener.subscribers.push({
            userId: userID,
            carId: carId,
            object: new notifier(),
            happened: false
        })
    }
    private find(userId: number, carId: number = -1): subscriberObj[] {
        var resultArr : subscriberObj[]= [];
        for (var i = 0; i < reviewPostEventListener.subscribers.length; i++){
            if (reviewPostEventListener.subscribers[i].userId == userId){
                if (carId != -1){
                    if (reviewPostEventListener.subscribers[i].carId == carId){
                        resultArr.push(reviewPostEventListener.subscribers[i]);
                    }
                }
                else{
                    resultArr.push(reviewPostEventListener.subscribers[i]);
                }
            }
        }
        return resultArr;
    }
    public unsubscribe(element: subscriberObj): void {
        var index;
        index = reviewPostEventListener.subscribers.indexOf(element);
        reviewPostEventListener.subscribers.splice(index, 1);
    }
    public update(user: number): notification[] {
        var notificationArr: notification[] = [];
        this.find(user).forEach((obj) => {
            if (obj.happened) {
                notificationArr.push(obj.object.notify(`A review was posted for vehicle ID:${obj.carId}`));
                this.unsubscribe(obj);
            }
        })
        return notificationArr;
    }
    public markHappened(user: number, vehicle: number): void {
        var event = this.find(user, vehicle);
        for (var i = 0; i < event.length; i++) {
            event[i].happened = true;
        }
    }
}

export { notification, bookRequestEventListener, confirmRequestEventListener, reviewPostEventListener }