const Observable = require('../utils/Observable');



class Cleaner extends Agent {
    constructor(house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('cleaner_status', 'off')   // observable

    }
    Move(l) {
        this.machine_status = 'on'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(this.name + ' turned on')
    }
    Clean(l) {
        this.status = 'off'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(this.name + ' turned off')
    }

}



module.exports = Cleaner