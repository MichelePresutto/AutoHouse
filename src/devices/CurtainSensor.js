const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');
const Alarm = require('./Alarm');
const Curtain = require('./Curtain')




class SenseCurtainGoal extends Goal {

    constructor(curtain = []) {
        super()

        /** @type {Array<Curtain>} lights */
        this.curtain = curtain

    }

}



class SenseCurtainIntention extends Intention {

    constructor(agent, goal) {
        super(agent, goal)

        /** @type {Array<Curtain>} lights */
        this.curtain = this.goal.curtain
    }

    static applicable(goal) {
        return goal instanceof SenseCurtainGoal
    }

    *exec() {

        let t = true
        let c = true
        let flag = true
        while (true) {
            Clock.global.notifyChange('mm')
            this.curtain.house.devices.bedroom_alarm1.notifyChange('stat')
            if (!t && !c) {
                t = true
                c = true
            }

            //this.house.devices.bedroom_alarm1.hh
            //if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm) this.log('ALARM' + Clock.global.mm)
            yield
            if (this.curtain.name == 'bathroom_curtain' && this.curtain.house.rooms.bathroom.n_ppl != 0 && flag && this.curtain.curtain_status != 'Close') {
                this.log('senses: ', this.curtain.name, "closing curtains for privacy!")
                this.curtain.Close()
                flag = false
            } else if (this.curtain.name == 'bathroom_curtain' && this.curtain.house.rooms.bathroom.n_ppl == 0 && this.curtain.curtain_status != 'Open') {
                this.curtain.Open()
                flag = true

            }
            let h = 0
            let m = 0
            if (this.curtain.house.devices.bedroom_alarm1.hh > this.curtain.house.devices.bedroom_alarm2.hh) {
                h = this.curtain.house.devices.bedroom_alarm1.hh
                m = this.curtain.house.devices.bedroom_alarm1.mm
            } else {
                h = this.curtain.house.devices.bedroom_alarm2.hh
                m = this.curtain.house.devices.bedroom_alarm2.mm
            }
            if (Clock.global.hh == h && Clock.global.mm == m && t && this.curtain.name != 'bathroom_curtain') {
                //console.log("\nAlarm! it\'s", Clock.global.hh, ':', Clock.global.mm)
                this.log('senses: ', this.curtain.name, "it's morning, curtains Open!")
                this.curtain.Open()

                t = false

            }
            if (Clock.global.hh == 20 && Clock.global.mm == 0 && c) {
                this.log('senses: ', this.curtain.name, "it's night, curtain closed!")

                this.curtain.Close()
                c = false

            }
        }




        yield Promise.all(SenseCurtainGoal)
    }

}






module.exports = { SenseCurtainGoal, SenseCurtainIntention }