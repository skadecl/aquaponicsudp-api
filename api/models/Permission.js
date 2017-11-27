/**
 * Permission.js
 *
 */

 module.exports = {
   tableName: 'permissions',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     role: {
       model: 'Role',
       required: true
     },
     module: {
       type: 'string',
       required: true
     }
   }
 };
