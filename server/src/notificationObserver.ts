
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
    else if (message == "approve") {
        notificationObj.notification = `Booking request for vehicle #${carId} was approved`;
    }
    else if (message == "deny"){
        notificationObj.notification = `Booking request for vehicle #${carId} was denied`;
    }
    else if (message == "review") {
        notificationObj.notification = `A review for vehicle #${carId} was posted`;
    }
    else if (message == "mail"){
        notificationObj.notification = `You have mail`;
    }
    else {
        notificationObj.notification = `Unrecognized event happened at vehicle #${carId}`;
    }
    return notificationObj;
}

abstract class Listener {
    public abstract subscribe(carId: number, userId: number, event:string) : void;
    public abstract unsubscribe (carId: number, userId: number, event:string) : void;
    public abstract update(user : number): void;
    public abstract markHappened (user: number, vehicle : number, event : string) : void;
}


//concrete subscriber
class eventListener extends Listener{
    private static listOfSubscribers: subscriberObj[] = [];
    public subscribe(carId: number, userID: number, event: string): void {
        var existingSubscriber = this.find(userID, carId, event);
        //Make sure that only one instance of the same notification is present
        if (existingSubscriber.length != 0){
            return;
        }
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
    private remove(element: subscriberObj): void {
        var index;
        var denyOrApprove = "";
        if (element.event == "approve"){
            denyOrApprove = "deny";
        }
        if (element.event == "deny"){
            denyOrApprove = "approve";
        }
        if (denyOrApprove != ""){
            var theOtherConfirmEvent = this.find(element.userId, element.carId, denyOrApprove);
            theOtherConfirmEvent.forEach((theEvent) => {
                index = eventListener.listOfSubscribers.indexOf(theEvent);
                eventListener.listOfSubscribers.splice(index, 1);
            })
        }
        index = eventListener.listOfSubscribers.indexOf(element);
        eventListener.listOfSubscribers.splice(index, 1);
    };
    public update(user: number): notification[] {
        var notificationArr: notification[] = [];
        this.find(user).forEach((obj) => {
            if (obj.happened) {
                notificationArr.push(notify(obj.event, obj.carId));
                if (obj.event == "deny" || obj.event == "approve"){
                    this.remove(obj);
                }
                else{
                    obj.happened = false;
                }
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
    public unsubscribe(carId: number, userId: number, event:string): void {
        this.find(userId, carId, event).forEach((element) => {
            this.remove(element)
        })
    }
}

export { notification, eventListener }