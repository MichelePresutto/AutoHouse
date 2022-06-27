const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const Alarm = require('./Alarm');
const SolarPanels = require('./SolarPanels')




class SenseSolarPanelsGoal extends Goal {

    constructor(solarPanels) {
        super()

        /** @type {Array<SolarPanels>} lights */
        this.solarPanels = solarPanels

    }

}



class SenseSolarPanelsIntention extends Intention {

    constructor(agent, goal) {
        super(agent, goal)

        /** @type {Array<SolarPanels>} lights */
        this.solarPanels = this.goal.solarPanels
    }

    static applicable(goal) {
        return goal instanceof SenseSolarPanelsGoal
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
        let c = true
        while (true) {
            Clock.global.notifyChange('mm')
            if (!t && !c) {
                t = true
                c = true
            }
            //if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm) this.log('ALARM' + Clock.global.mm)
            yield
            if (Clock.global.hh == 7 && Clock.global.mm == 0 && t) {
                //console.log("\nAlarm! it\'s", Clock.global.hh, ':', Clock.global.mm)
                this.log('senses: ', this.solarPanels.name, "it's morning, sun is up!")
                this.solarPanels.house.devices['solar_panels'].On()

                t = false

            } else if (Clock.global.hh == 19 && Clock.global.mm == 0 && c && !t) {
                this.log('senses: ', this.solarPanels.name, "it's night!")

                this.solarPanels.house.devices['solar_panels'].Off()
                c = false

            }
        }




        yield Promise.all(SenseSolarPanelsGoal)
    }

}






module.exports = { SenseSolarPanelsGoal, SenseSolarPanelsIntention }