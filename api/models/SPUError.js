/**
 * MeasurementError.js
 *
 */

 module.exports = {
   tableName: 'errors',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     device: {
       type: 'integer',
       required: true
     },
     type: {
       type: 'integer',
       required: true
     },
     message: {
       type: 'string',
       required: true
     },
     sampledate: {
       type: 'datetime',
       required: true
     }
   }
 };
