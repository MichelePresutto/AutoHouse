const Observable = require('../utils/Observable');



class Light extends Observable {
    constructor(house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable
    }
    switchOnLight(l) {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 0.09;
        // Include some messages logged on the console!
        console.log('\n', this.name + 'light turned on')
    }
    switchOffLight(l) {
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0.01;
        // Include some messages logged on the console!
        console.log('\n', this.name + 'light turned off')
    }
}



module.exports = Light