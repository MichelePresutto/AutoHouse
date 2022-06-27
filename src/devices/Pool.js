const Observable = require('../utils/Observable');



class Pool extends Observable {
    constructor(house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('pool_status', 'close')
        this.set('weither', 'bad')   // observable
        this.set('water_status', 'not-ready')

    }
    Open(l) {
        this.pool_status = 'open'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(this.name + ' opened the cover')
    }
    Close(l) {
        this.pool_status = 'close'
        this.house.utilities.electricity.consumption -= 1;
        // Include some messages logged on the console!
        console.log(this.name + ' closed the cover')
    }
    WarmPool(l) {
        this.water_status = 'ready'
        this.house.utilities.electricity.consumption += 1;
        console.log(this.name + ': pool is ready and warm! jump in!')

    }

}



module.exports = Pool