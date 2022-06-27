const Observable = require('../utils/Observable');



class CoffeMachine extends Observable {
    constructor(house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('machine_status', 'off')   // observable
        this.set('coffe_status', 'not_ready')
    }
    turnOn(l) {
        this.machine_status = 'on'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(this.name + ' turned on')
    }
    turnOff(l) {
        this.status = 'off'
        this.house.utilities.electricity.consumption -= 1;
        // Include some messages logged on the console!
        console.log(this.name + ' turned off')
    }
    makeCoffe(l) {
        this.coffe_status = 'ready'
        this.house.utilities.electricity.consumption += 1;
        console.log(this.name + ': coffe is ready!')

    }
}



module.exports = CoffeMachine