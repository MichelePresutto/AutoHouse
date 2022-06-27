const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const Person = require('../person/Person');


class SenseRoomGoal extends Goal {

    constructor(person = []) {
        super()

        /** @type {Array<Person>} light */
        this.person = person

    }

}



class SenseRoomIntention extends Intention {

    constructor(agent, goal) {
        super(agent, goal)

        /** @type {Array<Person>} light */
        this.person = this.goal.person

    }

    static applicable(goal) {
        return goal instanceof SenseRoomGoal
    }

    *exec() {
        //let pre_room = this.person.in_room
        var personGoal = []
        for (let person of this.person) {
            let personGoalPromise = new Promise(async res => {
                while (true) {
                    let pre_room = person.in_room
                    let room = await person.notifyChange('in_room')


                    this.log('\n Room sense:' + person.name + ' has entered in ' + room)
                    //console.log(this.person.house.devices[room].n_ppl)

                    if (person.house.rooms[room].n_ppl > 0 &&
                        !((person.house.devices[room + '_light'].status) == 'on') && Clock.global.hh >= 19) {
                        person.house.devices[room + '_light'].switchOnLight()
                        //console.log('status of room entered', this.person.house.devices[room + '_light'].status)
                        //this.person.house.devices[pre_room + '_light'].switchOffLight()
                    }


                    if (person.house.rooms[pre_room].n_ppl == 0 &&
                        (((person.house.devices[pre_room + '_light'].status) == 'on') && Clock.global.hh >= 19)) {
                        person.house.devices[pre_room + '_light'].switchOffLight()
                    }
                    if (Clock.global.hh < 19 && (person.house.devices[room + '_light'].status) == 'on') {
                        person.house.devices[room + '_light'].switchOffLight()

                    }
                    //console.log(room)
                    //console.log('ecco', this.person.at(0))
                    // this.agent.beliefs.declare('light_on ' + this.light.name, status == 'on')
                    // this.agent.beliefs.declare('light_off ' + this.light.name, status == 'off')
                }
            });
            personGoal.push(personGoalPromise)

        } yield Promise.all(personGoal)


    }
    // *exec() {
    //     //let pre_room = this.person.in_room
    //     while (true) {
    //         let pre_room = this.person.in_room
    //         let room = yield this.person.notifyChange('in_room')


    //         console.log('\n Room sense:' + this.person.name + ' has entered in ' + room)
    //         //console.log(this.person.house.devices[room].n_ppl)
    //         if (this.person.house.rooms[room].n_ppl > 0 &&
    //             !((this.person.house.devices[room + '_light'].status) == 'on') && Clock.global.hh >= 19) {
    //             this.person.house.devices[room + '_light'].switchOnLight()
    //             //console.log('status of room entered', this.person.house.devices[room + '_light'].status)
    //             //this.person.house.devices[pre_room + '_light'].switchOffLight()
    //         }

    //         if (this.person.house.rooms[pre_room].n_ppl == 0 &&
    //             (((this.person.house.devices[pre_room + '_light'].status) == 'on') && Clock.global.hh >= 19)) {
    //             this.person.house.devices[pre_room + '_light'].switchOffLight()
    //         }
    //         if (Clock.global.hh < 19 && (this.person.house.devices[room + '_light'].status) == 'on') {
    //             this.person.house.devices[room + '_light'].switchOffLight()

    //         }
    //         //console.log(room)
    //         //console.log('ecco', this.person.at(0))
    //         // this.agent.beliefs.declare('light_on ' + this.light.name, status == 'on')
    //         // this.agent.beliefs.declare('light_off ' + this.light.name, status == 'off')
    //     }

    // }

}
module.exports = { SenseRoomGoal, SenseRoomIntention }