/**
 * Measurement.js
 *
 */

 module.exports = {
   tableName: 'measurements',
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
     value: {
       type: 'float',
       required: true
     },
     sampledate: {
       type: 'datetime',
       required: true
     }
   }
 };
