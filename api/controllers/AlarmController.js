/**
 * AlarmController
 *
 * @description :: Server-side logic for managing Alarms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAlarms: function(req, res) {
		Alarm.find().populate('sensor').exec(function (err, alarms) {
			if (err) res.serverError();
			else res.json(alarms);
		});
	},

	triggeredAlarms: function (req, res) {
		Alarm.find({triggered: true}).exec(function (err, alarms) {
			if (err) res.serverError();
			else {
				res.status(200).json(alarms);
			}
		})
	},

	findEffects: function (req, res) {
		Effect.find({alarm: req.params.id}).populate('actuator').exec(function (err, alarm) {
			if (err) res.serverError();
			else if (alarm) res.json(alarm);
			else res.notFound();
		});
	},

	update: function (req, res) {
		var updated = req.body;
		var effects = false;
		if (updated.effects) {
			var effects = updated.effects.slice();
			delete updated.effects;
		}

		Alarm.update({id: req.params.id}, updated).exec(function (err, alarms) {
			if (err) res.serverError();
			else if (alarms.length) res.json(alarms[0]);
			else res.notFound();
		});

		Effect.destroy({alarm: req.params.id}, function (err, destroyed) {
			if (err) console.log(err);
			else if (effects) {
				Effect.create(effects, function (err, created) {
					if (err) console.log(err);
				})
			}
		});
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

		Trigger.find({where: {alarm: req.params.id}, skip: paginate.skip, limit: paginate.limit}).populate('measurement').sort('createdAt DESC').exec(function (err, actions) {
			if (err) res.serverError();
			else res.json(actions);
		})
	}
};
