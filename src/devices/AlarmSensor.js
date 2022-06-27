const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const Alarm = require('./Alarm');




class SenseAlarmGoal extends Goal {

    constructor(alarm) {
        super()

        /** @type {Array<Alarm>} lights */
        this.alarm = alarm

    }

}



class SenseAlarmIntention extends Intention {

    constructor(agent, goal) {
        super(agent, goal)

        /** @type {Array<Alarm>} lights */
        this.alarm = this.goal.alarm
    }

    static applicable(goal) {
        return goal instanceof SenseAlarmGoal
    }

    *exec() {

        let t = true

        while (true) {
            Clock.global.notifyChange('mm')

            //if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm) this.log('ALARM' + Clock.global.mm)
            yield
            if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm && t) {
                console.log("\nAlarm! it\'s", Clock.global.hh, ':', Clock.global.mm)
                this.log('senses: ', this.alarm.name, "has rung")
                this.alarm.house.devices['coffe_machine'].turnOn()
                this.alarm.house.devices['coffe_machine'].makeCoffe()
                this.alarm.house.devices['coffe_machine'].turnOff()
                this.alarm.Ring()


                t = false
                //this.alarm.house.devices

            } else if (Clock.global.hh != this.alarm.hh && Clock.global.mm != this.alarm.mm && !t) { t = true }
        }




        yield Promise.all(SenseAlarmGoal)
    }

}






module.exports = { SenseAlarmGoal, SenseAlarmIntention }