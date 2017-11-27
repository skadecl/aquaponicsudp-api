/**
 * SPU.js
 *
 */

 module.exports = {
   tableName: 'spus',
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
     token: {
       type: 'string',
       required: true
     }
   }
 };
