DOCUMENTATION

In the scenario presented for the final assignment there are 2 people(James and Lily) in the house composed by 8 rooms and the garden.

I’ve created 4 main devices : lights, alarm, pool and coffe machines.

The alarm class has been modified creating senseAlarm.js and adding the device Alarm to the house devices

The lights are equipped in each room of the house and are controlled by the agent.

The coffe machines class is defined in CoffeMachine.js and has 2 status (machine\_status and coffe\_status) and 3 methods used to modify those status ( turnOn(), turnOff(), makeCoffe() ) . The coffe machine is automatic activated by the agent when the alarm ring.

The pool class is defined in Pool.js and has 2 status (pool_status and Water_status) the pool status change using the pool sensors that use the weather condition, if the meteo is good than the pool will open the cover and warm up the water. 

I’ve created the Alarm class in Alarm.js and it’s status can be changed (set, not\_set) using the setAlarm(hh,mm) method of this class, it is possible to change this status even from the class Person thanks to a method implemented to access the alarm from Person.js (set_clock(hh,mm,name)).

I added to every room the attribute n_ppl (number of people present in that room in that instant of time)

I’ve created the script RoomSensor.js to perceive changes in the room, if someone enter or exit the room after a given time, automatically turn on the light or off the light of that room depending on different preconditions.

I've created a cleaner agent that at some point controls witch rooms are dirty and elaborates a plan to clean each room using the onlinePlanner.


