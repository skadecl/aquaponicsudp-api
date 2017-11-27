/**
 * SubscriptionController
 *
 * @description :: Server-side logic for managing Subscriptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
		Subscription.find({user: req.token.id}, {select: ['alarm']}).exec(function (err, subscriptions) {
			if (err) res.serverError();
			else {
				alarmsIds = _.pluck(subscriptions, 'alarm');
				Alarm.find(
					{id: alarmsIds},
					{select:
						[
							'id',
							'name',
							'type',
							'status',
							'value',
							'style',
							'icon',
							'createdAt'
						]
					}
				).exec(function (err, alarms) {
					if (err) res.serverError();
					else {
						res.json(alarms);
					}
				})
			}
		});
	},

	create: function(req, res) {
		newSubscription = {
			user: req.token.id,
			alarm: req.body.alarm
		};

		Subscription.findOrCreate(newSubscription, function (err, created) {
			if (err) res.serverError();
			else res.status(201).json(true);
		})
	},

	remove: function(req, res) {
		criteria = {
			user: req.token.id,
			alarm: req.params.alarm
		};

		Subscription.destroy(criteria, function (err, subscription) {
			if (err) res.serverError();
			else if (subscription.length) res.status(200).json(true);
			else res.notFound();
		})
	}
};
