const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const Alarm = require('./Alarm');
const Pool = require('./Pool')




class SensePoolGoal extends Goal {

    constructor(pool) {
        super()

        /** @type {Array<Pool>} lights */
        this.pool = pool

    }

}



class SensePoolIntention extends Intention {

    constructor(agent, goal) {
        super(agent, goal)

        /** @type {Array<Pool>} lights */
        this.pool = this.goal.pool
    }

    static applicable(goal) {
        return goal instanceof SensePoolGoal
    }

    // *exec() {
    //     var alarmGoals = []
    //     for (let alarm of this.alarms) {


    //         let t = true
    //         let alarmGoalPromise = new Promise(async res => {
    //             while (true) {
    //                 await Clock.global.notifyChange('mm')
    //                 //if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm) this.log('ALARM' + Clock.global.mm)
    //                 if (Clock.global.hh == alarm.hh && Clock.global.mm == alarm.mm && t) {
    //                     console.log("\nAlarm! it\'s", Clock.global.hh, ':', Clock.global.mm)
    //                     this.log('senses: ', alarm.name, "has rung")
    //                     alarm.house.devices['coffe_machine'].turnOn()
    //                     alarm.house.devices['coffe_machine'].makeCoffe()
    //                     alarm.house.devices['coffe_machine'].turnOff()


    //                     t = false
    //                     //this.alarm.house.devices

    //                 }
    //             }
    //         });
    //         alarmGoals.push(alarmGoalPromise)
    //     }
    //     yield Promise.all(alarmGoals)




    //     yield Promise.all(SenseAlarmGoal)
    // }

    *exec() {

        let t = true

        while (true) {
            Clock.global.notifyChange('mm')

            //if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm) this.log('ALARM' + Clock.global.mm)
            yield
            if (this.pool.weither == 'good' && t) {
                //console.log("\nAlarm! it\'s", Clock.global.hh, ':', Clock.global.mm)
                this.log('senses: ', this.pool.name, "sun is shining")
                this.pool.house.devices['pool'].Open()
                this.pool.house.devices['pool'].WarmPool()


                t = false
                //this.alarm.house.devices

            } else if (this.pool.weither == 'bad' && !t) {
                t = true
                this.log('senses: ', this.pool.name, "Bad weither")

                this.pool.house.devices['pool'].Close()

            }
        }




        yield Promise.all(SensePoolGoal)
    }

}






module.exports = { SensePoolGoal, SensePoolIntention }