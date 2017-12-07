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
	},

	getHistory: function(req, res) {
		var paginate = {
			skip: 0,
			limit: 10
		}

		if (req.query.limit) {
			paginate.limit = ((req.query.limit-1) % sails.config.globals.maxPageResults) + 1;
		}

		if (req.query.page) {
			paginate.skip = (req.query.page - 1) * paginate.limit;
		}

		Measurement.find({where: {sensor: req.params.id}, skip: paginate.skip, limit: paginate.limit, select: ['value', 'createdAt']}).sort('createdAt DESC').exec(function (err, actions) {
			if (err) res.serverError();
			else res.json(actions);
		})
	}
};
