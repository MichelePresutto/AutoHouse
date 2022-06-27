const Observable = require('../utils/Observable');



class SolarPanels extends Observable {
    constructor(house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('SolarPanels_status', 'Off')

    }
    On(l) {
        this.SolarPanels_status = 'On'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(this.name + 'Solar Panels are On')
    }
    Off(l) {
        this.SolarPanels_status = 'Off'
        this.house.utilities.electricity.consumption -= 1;
        // Include some messages logged on the console!
        console.log(this.name + 'Solar Panels are Off')
    }


}



module.exports = SolarPanels