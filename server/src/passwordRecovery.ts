

interface recoveryAnswers{
    answer1 : string,
    answer2 : string,
    answer3 : string
};

//Abstract handler
abstract class passwordRecovery{
    protected answer = "";
    protected successor : passwordRecovery | null;
    constructor(qs : recoveryAnswers){
        this.successor = null;
    };
    protected setSuccessor(object : passwordRecovery){
        this.successor = object;
    }
    abstract checkAnswer(as : recoveryAnswers) : boolean;
};

//First layer of handler checks for first secure question
class layer1 extends passwordRecovery{
    constructor(correctAnswers : recoveryAnswers){
        super(correctAnswers);
        this.answer = correctAnswers.answer1;
        this.successor = new layer2(correctAnswers);
    };
    public checkAnswer(as: recoveryAnswers): boolean {
        if (as.answer1 == this.answer && this.successor){
            return this.successor.checkAnswer(as);
        }
        else{
            return false;
        }
    }
};

//Second layer of hanlder
class layer2 extends passwordRecovery{
    constructor(correctAnswers : recoveryAnswers){
        super(correctAnswers);
        this.answer = correctAnswers.answer2;
        this.successor = new layer3(correctAnswers);
    };
    public checkAnswer(as: recoveryAnswers): boolean {
        if (as.answer2 == this.answer && this.successor){
            return this.successor.checkAnswer(as);
        }
        else{
            return false;
        }
    }
}

//Final layer of hanlder
class layer3 extends passwordRecovery{
    constructor(correctAnswers : recoveryAnswers){
        super(correctAnswers);
        this.answer = correctAnswers.answer3;
    };
    public checkAnswer(as: recoveryAnswers): boolean {
        if (as.answer3 == this.answer){
            return true;
        }
        else{
            return false;
        }
    }
}

export { layer1, recoveryAnswers};