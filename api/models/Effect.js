/**
 * Effect.js
 *
 */

 module.exports = {
   tableName: 'effects',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     alarm: {
       model: 'alarm',
       required: true
     },
     actuator: {
       model: 'actuator',
       required: true
     },
     status: {
       type: 'integer',
       required: true
     }
   }
 };
