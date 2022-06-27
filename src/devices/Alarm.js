
const Observable = require('../utils/Observable');


class Alarm extends Observable{
    constructor(house,name){
        super()
        this.house = house;
        this.name = name;
        this.hh;
        this.mm;
        this.set('status','not_set')
        this.set('stat','not-ringing')
    }
    setAlarm(hh,mm){
        this.status = 'set'
        this.hh = hh
        this.mm = mm
        console.log(this.name,'at',this.hh,':',this.mm)
    }
    Ring(l){
        this.stat = 'ringing' 
        console.log(this.name,'is ringing at',this.hh,':',this.mm)
    }
    
}
module.exports = Alarm


// class AlarmGoal extends Goal {

// }

// class AlarmIntention extends Intention {
//     static applicable(goal) {
//         return goal instanceof AlarmGoal
//     }
//     *exec() {
//         while (true) {
//             Clock.global.notifyChange('mm')
//             if (Clock.global.hh == 6) this.log('ALARM' + Clock.global.mm)
//             yield
//             if (Clock.global.hh == 6) {
//                 // Log a message!
//                 this.log('ALARM, it\'s 6am!')
//                 break;
//             }
//         }
//     }
// }
// class CoffeGoal {

// }

// class AlarmCoffe extends Intention {
//     static applicable(goal) {
//         return goal instanceof CoffeGoal
//     }
//     *exec() {
        
//     }
// }



// module.exports = { AlarmGoal, AlarmIntention }