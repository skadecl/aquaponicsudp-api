/**
 * Alarm.js
 *
 */

 module.exports = {
   tableName: 'alarms',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     sensor: {
       model: 'sensor',
       required: true
     },
     name: {
       type: 'string',
       unique: true,
       required: true
     },
     description: {
       type: 'text',
       required: true,
     },
     type: {
       type: 'integer',
       required: true
     },
     status: {
       type: 'integer',
       defaultsTo: 0
     },
     triggered: {
       type: 'boolean',
       defaultsTo: false
     },
     value: {
       type: 'float',
       required: true
     },
     delta: {
       type: 'float',
       defaultsTo: 0
     },
     style: {
       type: 'string',
       defaultsTo: 'info'
     },
     icon: {
       type: 'string',
       defaultsTo: 'fa-exclamation-triangle'
     },

     //References
     users: {
       collection: 'user',
       via: 'alarms',
       through: 'subscription'
     },
     effects: {
       collection: 'effect',
       via: 'alarm'
     },
   },

   //Lifecycle actions
   afterDestroy: function (alarms, cb){
     alarmsIds = _.pluck(alarms, 'id');
     Effect.destroy({alarm: alarmsIds}, function (err, destroyedEffects) {
       if (err) console.log(err);
     });
     Subscription.destroy({alarm: alarmsIds}, function (err, destroyedSubs) {
       if (err) console.log(err);
     });
     cb();
   }
 };
