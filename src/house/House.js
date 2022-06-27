const Person = require('../person/Person')
const Light = require('../devices/Light')
const Alarm = require('../devices/Alarm')
const CoffeMachine = require('../devices/CoffeMachine')
const Observable = require('../utils/Observable')
const SolarPanels = require('../devices/SolarPanels')
const FakeAction = require('../pddl/actions/pddlActionIntention')
const Pool = require('../devices/Pool')
const Curtain = require('../devices/Curtain')

//const CoffeMachine = require('./CoffeMachine')
class House {
    constructor() {
        this.people = {
            james: new Person(this, 'James'),
            lily: new Person(this, 'Lily')
        }
        this.rooms = {
            kitchen: { name: 'kitchen', doors_to: ['living_room'], n_ppl: 0 },
            living_room: { name: 'living_room', doors_to: ['kitchen', 'corridor', 'garden'], n_ppl: 0 },
            bedroom: { name: 'bedroom', doors_to: ['living_room', 'corridor'], n_ppl: 2 },
            bathroom: { name: 'bathroom', doors_to: ['corridor'], n_ppl: 0 },
            corridor: { name: 'corridor', doors_to: ['living_room', 'bedroom', 'bathroom'], n_ppl: 0 },
            garden: { name: 'garden', doors_to: ['living_room', 'outside'], n_ppl: 0 },
            child_bedroom: { name: 'child_bedroom', doors_to: ['corridor'], n_ppl: 0 },
            guess_bedroom: { name: 'guess_bedroom', doors_to: ['corridor'], n_ppl: 0 },
            little_bathroom: { name: 'little_bathroom', doors_to: ['corridor'], n_ppl: 0 },
            outside: { name: 'outside', doors_to: ['garden'], n_ppl: 0 },



        }
        this.devices = {
            kitchen_light: new Light(this, 'kitchen'),
            bedroom_light: new Light(this, 'bedroom'),
            bathroom_light: new Light(this, 'bathroom'),
            corridor_light: new Light(this, 'corridor'),
            outside_light: new Light(this, 'outside'),
            garden_light: new Light(this, 'outside'),
            living_room_light: new Light(this, 'living_room'),
            bedroom_alarm1: new Alarm(this, 'bedroom_alarm1'),
            bedroom_alarm2: new Alarm(this, 'bedroom_alarm2'),
            coffe_machine: new CoffeMachine(this, 'coffe_machine'),
            pool: new Pool(this, 'pool'),
            solar_panels: new SolarPanels(this, 'solar_panels'),
            kitchen_curtain: new Curtain(this, 'kitchen_curtain'),
            bedroom_curtain: new Curtain(this, 'bedroom_curtain'),
            bathroom_curtain: new Curtain(this, 'bathroom_curtain'),
            living_room_curtain: new Curtain(this, 'living_room_curtain')



        }
        this.utilities = {
            electricity: new Observable({ consumption: 0 })
        }


    }

}

module.exports = House