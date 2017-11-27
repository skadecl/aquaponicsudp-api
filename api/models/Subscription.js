/**
 * Subscription.js
 *
 */

 module.exports = {
   tableName: 'subscriptions',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     user: {
       model: 'user',
       required: true
     },
     alarm: {
       model: 'alarm',
       required: true
     }
   }
 };
