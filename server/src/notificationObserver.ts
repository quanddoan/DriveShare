
interface notification {
    notification: string
}

interface subscriberObj {
    event: string,
    userId: number,
    carId: number,
    happened: boolean
}

//
function notify(message: string, carId: number): notification {
    var notificationObj: notification = {
        notification: ""
    }
    if (message == "book") {
        notificationObj.notification = `A booking request for vehicle #${carId} was submitted`;
    }
    else if (message == "confirm") {
        notificationObj.notification = `Booking request for vehicle #${carId} was approved`;
    }
    else if (message == "review") {
        notificationObj.notification = `A review for vehicle #${carId} was posted`;
    }
    else {
        notificationObj.notification = `Unrecognized event happened at vehicle #${carId}`;
    }
    return notificationObj;
}

//Abstract subscriber
class eventListener {
    private static listOfSubscribers: subscriberObj[] = [];
    public subscribe(carId: number, userID: number, event: string): void {
        eventListener.listOfSubscribers.push({
            event: event,
            userId: userID,
            carId: carId,
            happened: false
        })
    };
    private find(userId: number, carId: number = -1, event: string = ""): subscriberObj[] {
        var resultArr: subscriberObj[] = [];
        var match = false;
        for (var i = 0; i < eventListener.listOfSubscribers.length; i++) {
            match = false;
            if (eventListener.listOfSubscribers[i].userId == userId) {
                match = true;
                if (carId != -1 && eventListener.listOfSubscribers[i].carId != carId) {
                    match = false;
                }
                if (event != "" && eventListener.listOfSubscribers[i].event != event) {
                    match = false;
                }
            }
            if (match) {
                resultArr.push(eventListener.listOfSubscribers[i]);
            }
        }
        return resultArr;
    }
    public unsubscribe(element: subscriberObj): void {
        var index = eventListener.listOfSubscribers.indexOf(element);
        eventListener.listOfSubscribers.splice(index, 1);
    };
    public update(user: number): notification[] {
        var notificationArr: notification[] = [];
        this.find(user).forEach((obj) => {
            if (obj.happened) {
                notificationArr.push(notify(obj.event, obj.carId));
                this.unsubscribe(obj);
            }
        })
        return notificationArr;
    };
    public markHappened(user: number, vehicle: number, event: string): void {
        var occurence = this.find(user, vehicle, event);
        for (var i = 0; i < occurence.length; i++){
            occurence[i].happened = true;
        }
    };
}

export { notification, eventListener }