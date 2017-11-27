/**
 * FetchController
 *
 */

var async = require('async');

module.exports = {
	fetch: function(req, res){
		var fetchSensors = req.body.sensors | false;
		var fetchActuators = req.body.actuators | false;
		var fetchAlarms = req.body.alarms | false;
		var result = {};

		async.parallel([
			function(callback) {
				if (fetchSensors) {
					Sensor.find({status: 1}, {select: ['id', 'name', 'value', 'min', 'max', 'avg', 'icon', 'style', 'unit', 'type']}).exec(function (err, sensors) {
						if (err) callback(err);
						else {
							result.sensors = sensors;
							callback(null);
						}
					})
				} else {
					callback(null);
				}
			},
			function(callback) {
				if (fetchActuators) {
					Actuator.find({select: ['id', 'name', 'status', 'style', 'icon']}).exec(function (err, actuators) {
						if (err) callback(err);
						else {
							result.actuators = actuators;
							callback(null);
						}
					})
				} else {
					callback(null);
				}
			},
			function(callback) {
				if (fetchAlarms) {
					Alarm.find({triggered: true}, {select: ['id', 'name', 'triggered', 'style', 'icon']}).exec(function (err, alarms) {
						if (err) callback(err);
						else {
							result.alarms = alarms;
							callback(null);
						}
					})
				} else {
					callback(null);
				}
			}
		], function (err) {
			if (err) res.serverError();
			else res.status(200).json(result);
		});
	}
};
