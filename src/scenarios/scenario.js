// const Beliefset = require('../bdi/Beliefset')
// const Observable = require('../utils/Observable')
const Clock = require('../utils/Clock')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
// const Person = require('./Person')
// const Light = require('./Light')
// const Alarm = require('./Alarm')
// const CoffeMachine = require('./CoffeMachine')
const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const FakeAction = require('../bdi/FakeAction')
const PlanningGoal = require('../pddl/PlanningGoal')
const House = require('../house/House')
//const setup = require('../pddl/OnlinePlanner')



//const { AlarmGoal, AlarmIntention } = require('./Alarm')

const { SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention } = require('../devices/LightSensor')
const { SenseRoomIntention, SenseRoomGoal } = require('../devices/RoomSensor')
const { SensePoolGoal, SensePoolIntention } = require('../devices/PoolSensor')
const { SenseSolarPanelsGoal, SenseSolarPanelsIntention } = require('../devices/SolarPanelSensor')

const { time } = require('console')
const { SenseAlarmGoal, SenseAlarmIntention } = require('../devices/AlarmSensor')
const { sync } = require('glob')
const { SenseCurtainGoal, SenseCurtainIntention } = require('../devices/CurtainSensor')




//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

/**
 * World agent
 */
const world = new Agent('world');
var myHouse = new House()


class Clean extends FakeAction {
    static parameters = ['room', 'robot']
    static precondition = [['is-dirty', 'room'], ['in', 'room', 'robot']]
    static effect = [['not is-dirty', 'room'], ['in', 'room', 'robot']]
}

class Move extends FakeAction {
    static parameters = ['from', 'robot', 'to']
    static precondition = [['not in', 'to', 'robot'], ['in', 'from', 'robot'], ['linked', 'from', 'to']]
    static effect = [['in', 'to', 'robot'], ['not in', 'from', 'robot']]
}

world.Clean = async function ({ room, robot } = args) {
    this.log('Clean', room, robot)
    myHouse.utilities.electricity.consumption += 1
    this.log('energy consumption', myHouse.utilities.electricity.consumption)

    // await new Promise( res => setTimeout(res, 5000) )
    return new Clean(world, { room, robot }).checkPreconditionAndApplyEffect()
        .catch(err => { this.error('world.Clean failed:', err.message || err); throw err; })
}

world.Move = async function ({ from, robot, to } = args) {
    this.log('Move', from, robot, to)
    myHouse.utilities.electricity.consumption += 1
    this.log('energy consumption', myHouse.utilities.electricity.consumption)
    return new Move(world, { from, robot, to }).checkPreconditionAndApplyEffect()
        .catch(err => { this.error('world.Move failed:', err.message || err); throw err; })
}


{
    class CleanGoal extends Goal { }
    class Clean extends pddlActionIntention {
        static parameters = ['room', 'robot']
        static precondition = [['room', 'room'], ['is-dirty', 'room'], ['robot', 'robot'], ['in', 'room', 'robot']]
        static effect = [['not is-dirty', 'room'], ['in', 'room', 'robot']]
        static applicable(goal) {
            return goal instanceof CleanGoal
        }
        *exec({ room, robot } = parameters) {
            if (robot == this.agent.name)
                yield world.Clean({ room, robot })
            else
                yield MessageDispatcher.authenticate(this.agent).sendTo(robot, new CleanGoal({ room, robot }))
        }
    }

    class MoveGoal extends Goal { }
    class Move extends pddlActionIntention {
        static parameters = ['from', 'robot', 'to']
        static precondition = [['room', 'from'], ['room', 'to'], ['robot', 'robot'], ['not in', 'to', 'robot'], ['in', 'from', 'robot'], ['linked', 'from', 'to']]
        static effect = [['in', 'to', 'robot'], ['not in', 'from', 'robot']]
        static applicable(goal) {
            return goal instanceof MoveGoal
        }
        *exec({ from, robot, to } = parameters) {
            if (robot == this.agent.name) {
                yield world.Move({ from, robot, to })
            }
            else
                yield MessageDispatcher.authenticate(this.agent).sendTo(robot, new MoveGoal({ from, robot, to }))
        }
    }

    class RetryGoal extends Goal { }
    class RetryFourTimesIntention extends Intention {
        static applicable(goal) {
            return goal instanceof RetryGoal
        }
        *exec({ goal } = parameters) {
            //Clock.stopTimer()
            for (let i = 0; i < 4; i++) {
                let goalAchieved = yield this.agent.postSubGoal(goal)
                if (goalAchieved)
                    return;
                this.log('wait for something to change on beliefset before retrying for the ' + (i + 2) + 'th time goal', goal.toString())
                yield this.agent.beliefs.notifyAnyChange()
            }
            //Clock.startTimer()
        }
    }

    var sensor = (agent) => (value, key, observable) => {
        value ? agent.beliefs.declare(key) : agent.beliefs.undeclare(key)
    }

    let { OnlinePlanning } = require('../pddl/OnlinePlanner')([Clean, Move])


    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    let cleaner = new Agent('a3')
    world.beliefs.observeAny(sensor(cleaner))


    // House, which includes rooms and devices
    // Agents
    var myAgent = new Agent('myAgent')

    myAgent.intentions.push(SenseAlarmIntention)
    myAgent.intentions.push(SenseOneLightIntention)
    myAgent.intentions.push(SenseRoomIntention)
    myAgent.intentions.push(SensePoolIntention)
    myAgent.intentions.push(SenseSolarPanelsIntention)
    myAgent.intentions.push(SenseCurtainIntention)




    myAgent.postSubGoal(new SenseRoomGoal([myHouse.people.james, myHouse.people.lily]))
    myAgent.postSubGoal(new SenseAlarmGoal(myHouse.devices['bedroom_alarm1']))
    myAgent.postSubGoal(new SenseAlarmGoal(myHouse.devices['bedroom_alarm2']))
    myAgent.postSubGoal(new SenseSolarPanelsGoal(myHouse.devices['solar_panels']))
    myAgent.postSubGoal(new SensePoolGoal(myHouse.devices['pool']))
    myAgent.postSubGoal(new SenseCurtainGoal(myHouse.devices.bedroom_curtain))
    myAgent.postSubGoal(new SenseCurtainGoal(myHouse.devices.kitchen_curtain))
    myAgent.postSubGoal(new SenseCurtainGoal(myHouse.devices.living_room_curtain))
    myAgent.postSubGoal(new SenseCurtainGoal(myHouse.devices.bathroom_curtain))
    //myAgent.postSubGoal(new SenseCurtainGoal(myHouse.devices.bathroom_curtain))





    myHouse.devices.bedroom_alarm1.setAlarm(9, 0)
    myHouse.devices.bedroom_alarm2.setAlarm(8, 0)

    world.beliefs.declare('room kitchen')
    world.beliefs.declare('room corridor')
    world.beliefs.declare('room bathroom')
    world.beliefs.declare('room living_room')
    world.beliefs.declare('room bedroom')
    world.beliefs.declare('room child_bedroom')
    world.beliefs.declare('room guess_bedroom')
    world.beliefs.declare('room little_bathroom')



    world.beliefs.declare('linked kitchen living_room')
    world.beliefs.declare('linked living_room kitchen')
    world.beliefs.declare('linked corridor living_room')

    world.beliefs.declare('linked living_room corridor')
    world.beliefs.declare('linked corridor bathroom')
    world.beliefs.declare('linked bathroom corridor')
    world.beliefs.declare('linked bedroom corridor')
    world.beliefs.declare('linked corridor bedroom')
    world.beliefs.declare('linked corridor bathroom')
    world.beliefs.declare('linked bedroom corridor')
    world.beliefs.declare('linked little_bathroom corridor')
    world.beliefs.declare('linked corridor little_bathroom')



    //world.beliefs.declare('linked bedroom corridor')

    world.beliefs.declare('robot a3')
    world.beliefs.declare('in kitchen a3')
    //world.beliefs.declare('is-dirty kitchen')

    //world.beliefs.declare('is-dirty bathroom')
    //a3.postSubGoal(new RetryGoal({ goal: new PlanningGoal({ goal: ['not(is-dirty bedroom)', 'not(is-dirty bathroom)', 'not(is-dirty living_room)', 'not(is-dirty kitchen)', 'not(is-dirty corridor)'] }) })) // try to achieve the PlanningGoal for 4 times
    //a3.postSubGoal(new PlanningGoal({ goal: ['in living_room a3', 'not(is-dirty bedroom)', 'not(is-dirty bathroom)', 'not(is-dirty living_room)', 'not(is-dirty kitchen)', 'not(is-dirty corridor)'] }))  // try to achieve the PlanningGoal for 4 times
    //a3.postSubGoal(new RetryGoal({ goal: new PlanningGoal({ goal: ['not(is-dirty bedroom)', 'not(is-dirty bathroom)', 'not(is-dirty living_room)', 'not(is-dirty kitchen)', 'not(is-dirty corridor)'] }) })) // try to achieve the PlanningGoal for 4 times

    cleaner.intentions.push(Clean, Move)
    cleaner.intentions.push(OnlinePlanning)
    cleaner.intentions.push(RetryFourTimesIntention)

    //myAgent.postSubGoal(new SenseRoomGoal(myHouse.people.lily))

    //myAgent.postSubGoal(new SenseOneLightGoal())

    myAgent.intentions.push(SenseCurtainIntention)
    myAgent.intentions.push(SenseLightsIntention)
    //myAgent.intentions.push(SenseOneLightIntention)
    // myAgent.postSubGoal(new SenseLightsGoal([
    //     myHouse.devices.kitchen_light, myHouse.devices.bathroom_light,
    //     myHouse.devices.bedroom_light, myHouse.devices.corridor_light,
    //     myHouse.devices.living_room_light]))
    // Simulated Daily/Weekly schedule


    Clock.global.observe('mm', (mm) => {
        var time = Clock.global

        //setup(a3.intentions)
        if (time.hh == 8 && time.mm == 15) {
            //myHouse.people.james.moveTo('corridor')
            myHouse.people.james.moveTo('corridor')

            //setTimeout(Clock.startTimer(), 5000)
            //a3.postSubGoal(new RetryGoal({ goal: new PlanningGoal({ goal: ['not(is-dirty bedroom)', 'not(is-dirty bathroom)', 'not(is-dirty living_room)', 'not(is-dirty kitchen)', 'not(is-dirty corridor)'] }) })) // try to achieve the PlanningGoal for 4 times


        }
        if (time.hh == 8 && time.mm == 30) {
            myHouse.people.james.moveTo('bathroom')
            //myHouse.people.lily.moveTo('living_room')

        }
        if (time.hh == 9 && time.mm == 15) {
            //myHouse.people.james.moveTo('corridor')
            myHouse.people.lily.moveTo('corridor')
        }

        if (time.hh == 9 && time.mm == 30) {
            myHouse.people.lily.moveTo('living_room')
        }
        if (time.hh == 9 && time.mm == 45) {
            myHouse.people.james.moveTo('corridor')
            myHouse.people.lily.moveTo('kitchen')
            myHouse.devices.pool.weither = 'good'
        }
        if (time.hh == 12 && time.mm == 15) {
            myHouse.people.james.moveTo('living_room')
            world.beliefs.declare('is-dirty living_room')
            world.beliefs.declare('is-dirty bathroom')
        }
        if (time.hh == 12 && time.mm == 30) {
            myHouse.people.james.moveTo('kitchen')
        }
        if (time.hh == 13 && time.mm == 30) {
            myHouse.people.james.moveTo('living_room')
            myHouse.people.lily.moveTo('living_room')
            world.beliefs.declare('is-dirty bedroom')
            world.beliefs.declare('is-dirty kitchen')
        }
        if (time.hh == 19 && time.mm == 0) {
            myHouse.people.james.moveTo('corridor')
            myHouse.devices.pool.weither = 'bad'

        }
        if (time.hh == 19 && time.mm == 15) {
            myHouse.people.james.moveTo('bathroom')
            myHouse.people.lily.moveTo('corridor')
            //myHouse.devices.pool.weither = 'bad'

        }
        if (time.hh == 19 && time.mm == 30) {
            myHouse.people.james.moveTo('corridor')
            myHouse.people.lily.moveTo('bathroom')
        }
        if (time.hh == 21 && time.mm == 00) {
            myHouse.people.james.moveTo('bedroom')
            myHouse.people.lily.moveTo('corridor')
            //myHouse.people.james.set_clock(8, 15)
        }

        if (time.hh == 21 && time.mm == 15) {
            //myHouse.people.james.moveTo('bedroom')
            myHouse.people.lily.moveTo('bedroom')
            myHouse.people.lily.set_clock(9, 0, 'bedroom_alarm2')
            myHouse.people.james.set_clock(8, 0, 'bedroom_alarm1')
        }
        if (time.hh == 21 && time.mm == 30) {
            //myHouse.people.james.moveTo('bedroom')
            cleaner.postSubGoal(new PlanningGoal({ goal: ['in kitchen a3', 'not(is-dirty bedroom)', 'not(is-dirty bathroom)', 'not(is-dirty living_room)', 'not(is-dirty kitchen)', 'not(is-dirty corridor)'] }))  // try to achieve the PlanningGoal for 4 times
            //cleaner.postSubGoal(new PlanningGoal({ goal: ['not(in kitchen a3)', 'in bedroom a3'] }))  // try to achieve the PlanningGoal for 4 times


        }

        // console.log('\n' + "bedroom:::::", myHouse.rooms.bedroom.n_ppl)
        // console.log("kitchen:::::", myHouse.rooms.kitchen.n_ppl)
        // console.log("bathroom:::::", myHouse.rooms.bathroom.n_ppl)
        // console.log("living_room:::::", myHouse.rooms.living_room.n_ppl)
        // console.log("corridor:::::", myHouse.rooms.corridor.n_ppl)
    })

    // Start clock
    Clock.startTimer()
}
//setTimeout(Clock.stopTimer, 4000)
