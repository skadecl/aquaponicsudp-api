/**
 * SensorController
 *
 * @description :: Server-side logic for managing Sensors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	check: function(req, res) {
		Sensor.findOne({name: req.params.name}, function (err, sensor) {
			if (err) res.serverError();
			else if (sensor) {
				res.ok();
			}
			else {
				res.notFound();
			}
		})
	},

	findErrors: function(req, res) {
		SPUError.find({device: req.params.id, type: 0}, {select: ['message', 'sampledate']}).sort('sampledate DESC').exec(function (err, errors) {
			if (err) res.serverError();
			else res.json(errors);
		})
	}
};
