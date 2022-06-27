const Observable = require('../utils/Observable');



class Curtain extends Observable {
    constructor(house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('curtain_status', 'Close')


    }
    Open(l) {
        if (this.curtain_status != 'Open') {
            this.curtain_status = 'Open'
            this.house.utilities.electricity.consumption += 1;
            // Include some messages logged on the console!
            console.log(this.name + ' curtains are Open')
        } else console.log(this.name + 'is already Open')
    }
    Close(l) {
        if (this.curtain_status != 'Close') {
            this.curtain_status = 'Close'
            this.house.utilities.electricity.consumption += 1;
            // Include some messages logged on the console!
            console.log(this.name + 'curtains are Close')
        } else console.log(this.name + 'is already Close')
    }



}



module.exports = Curtain