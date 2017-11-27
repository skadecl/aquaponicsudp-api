/**
 * Role.js
 *
 */

 module.exports = {
   tableName: 'roles',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     name: {
       type: 'string',
       required: true,
       unique: true
     },
     description: {
       type: 'text',
       required: true,
     },

     //References
     users: {
       collection: 'User',
       via: 'role'
     },
     permissions: {
       collection: 'Permission',
       via: 'role'
     }
   }
 };
