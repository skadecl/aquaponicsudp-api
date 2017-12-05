/**
 * Action.js
 *
 */

 module.exports = {
   tableName: 'actions',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     actuator: {
       type: 'integer',
       required: true
     },
     status: {
       type: 'integer',
       required: true
     },
     confirmed: {
       type: 'boolean',
       defaultsTo: false
     },
     source: {
       type: 'integer',
       defaultsTo: 0
     },
     attempts: {
       type: 'integer',
       defaultsTo: 0
     }
   }
 };
