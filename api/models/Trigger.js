/**
 * Trigger.js
 *
 */

 module.exports = {
   tableName: 'triggers',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     alarm: {
       type: 'integer',
       required: true
     },
     type: {
       type: 'integer',
       required: true
     },
     measurement: {
       model: 'measurement',
       required: true,
     }
   }
 };
