/**
 * Actuator.js
 *
 */

 module.exports = {
   tableName: 'actuators',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     name: {
       type: 'string',
       required: true
     },
     description: {
       type: 'text',
       required: true,
     },
     status: {
       type: 'integer',
       defaultsTo: 0
     },
     lock: {
       type: 'integer',
       defaultsTo: 0
     },
     style: {
       type: 'string',
       defaultsTo: 'info'
     },
     icon: {
       type: 'string',
       defaultsTo: 'fa-cogs'
     }
   },

   //Lifecycle actions
   afterDestroy: function (actuators, cb) {
     actuatorsIds = _.pluck(actuators, 'id');
     Effect.destroy({actuator: actuatorsIds}, function (err, destroyedEffects) {
       if (err) console.log(err);
     });
     cb();
   }
 };
