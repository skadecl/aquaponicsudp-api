/**
 * Sensor.js
 *
 */

 module.exports = {
   tableName: 'sensors',
   attributes: {
     id: {
       type: 'integer',
       primaryKey: true,
       unique: true,
       autoIncrement: true
     },
     type: {
       type: 'integer',
       required: true
     },
     name: {
       type: 'string',
       required: true
     },
     description: {
       type: 'text',
       required: true,
     },
     unit: {
       type: 'string',
       defaultsTo: null
     },
     status: {
       type: 'integer',
       defaultsTo: 0
     },
     value: {
       type: 'float',
       defaultsTo: 0
     },
     min: {
       type: 'float',
       defaultsTo: null
     },
     max: {
       type: 'float',
       defaultsTo: null
     },
     avg: {
       type: 'float',
       defaultsTo: 0
     },
     count: {
       type: 'integer',
       defaultsTo: 0
     },
     style: {
       type: 'string',
       defaultsTo: 'success'
     },
     icon: {
       type: 'string',
       defaultsTo: 'fa-thermometer'
     },
     alarms: {
       collection: 'alarm',
       via: 'sensor'
     },
     //Relations
     errors: {
       collection: 'spuerror',
       via: 'device'
     }
   },

   updateValues: function(measurements) {
     sensorIds = _.pluck(measurements, 'sensor');
     Sensor.find({id: sensorIds}).exec(function (err, sensors) {
       if (err) console.log(err);
       else {
         sensors.forEach(function (sensor) {
           measurement = _.find(measurements, {sensor: sensor.id});
           sensor.value = measurement.value;
           if (sensor.count == 0) sensor.min = sensor.max = sensor.value;
           if (sensor.type > 0) {
             //avg
             sensor.avg = Math.round((((sensor.avg * sensor.count) + measurement.value) / (sensor.count+1)) * 100) / 100;
             if (sensor.value > sensor.max) sensor.max = sensor.value;
             if (sensor.value < sensor.min) sensor.min = sensor.value;
           }
           sensor.count += 1;
           sensor.save();
         })
       }
     })
   }
 };
