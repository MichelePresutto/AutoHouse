const Observable = require('../utils/Observable');
const { SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention } = require('../devices/LightSensor')
const Light = require('../devices/Light');



class Person extends Observable {
    constructor(house, name) {
        super()
        this.house = house;             // reference to the house
        this.name = name;               // non-observable
        this.set('in_room', 'bedroom')  // observable
        //this.set('')
        // this.observe( 'in_room', v => console.log(this.name, 'moved to', v) )    // observe
    }
    moveTo(to) {
        if (this.house.rooms[this.in_room].doors_to.includes(to)) { // for object: to in this.house.rooms[this.in_room].doors_to
            console.log('\n', '\n', this.name, ' is moving from', this.in_room, 'to', to)
            // updating the number of person in a camera. Bedroom starts with 2 people in it.

            this.house.rooms[this.in_room].n_ppl = this.house.rooms[this.in_room].n_ppl - 1
            this.house.rooms[to].n_ppl = this.house.rooms[to].n_ppl + 1
            //console.log(this.in_room + ' number of people:', this.house.rooms[this.in_room].n_ppl)
            //console.log(this.house.rooms[to].name + ' number of people:', this.house.rooms[to].n_ppl)

            this.in_room = to
            //console.log(this.rooms.n_ppl)
            return true
        }
        else {
            console.log(this.name, '\t failed moving from', this.in_room, 'to', to)
            return false
        }
    }
    set_clock(hh, mm, alarm_name) {

        this.house.devices[alarm_name].status = 'set'
        this.house.devices[alarm_name].hh = hh
        this.house.devices[alarm_name].mm = mm

        console.log(this.name + 'changed alarm to:', hh, mm)
    }
    switchOnLight(l) {

        this.house.devices[this.person.in_room + '_light'].status = 'on'
        this.house.utilities.electricity.consumption += 0.09;
        // Include some messages logged on the console!
        console.log('\n', this.name + 'light turned on')
    }
    switchOffLight(l) {
        this.house.devices[this.person.in_room + '_light'].status = 'off'
        this.house.utilities.electricity.consumption += 0.01;
        // Include some messages logged on the console!
        console.log('\n', this.name + 'light turned off')
    }
}

module.exports = Person