/**
 * ActuatorController
 *
 * @description :: Server-side logic for managing Actuators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	heartbeat: function(req, res) {
		if (!req.body) res.badRequest()
		else if (req.body.length){
			actions = []
			actionsId = _.pluck(req.body, 'id');
			Actuator.find({id: actionsId}, function (err, actuators){
				if (err) res.serverError()
				else if (actuators.length) {
					actuatorIndex = 0
					actuators.forEach(function (localActuator) {
						remoteActuator = _.find(req.body, {id: localActuator.id})
						if (localActuator.status != remoteActuator.status) {
							actions.push({
								actuator: localActuator.id,
								status: localActuator.status,
								confirmed: false,
								source: 0
							})
						}
						actuatorIndex++
						if (actuatorIndex == actuators.length) {
							if (actions.length) {
								//If got actions create them
								Action.findOrCreate(actions).exec(function (err, createdActions) {
									if (err) res.serverError();
									else {
										//Get new and old actions
										Action.find({confirmed: false, attempts: { '<': sails.config.globals.maxActionAttempt }}).exec(function (err, allActions) {
											if (err) res.serverError();
											else {
												allActions.forEach(function (action) {
													action.attempts++
													action.save()
												})
												var pickedActions = _.map(allActions, _.partialRight(_.pick, ['id', 'actuator', 'status']))
												res.status(210).json(pickedActions)
											}
										})
									}
								})
							}
							else {
								Action.find({confirmed: false, attempts: { '<': sails.config.globals.maxActionAttempt }}).exec(function (err, allActions) {
									if (err) res.serverError();
									else if (allActions.length){
										allActions.forEach(function (action) {
											action.attempts++
											action.save()
										})

										var pickedActions = _.map(allActions, _.partialRight(_.pick, ['id', 'actuator', 'status']))
										res.status(210).json(pickedActions)
									}
									else res.ok()
								})
							}
						}
					})
				}
				else res.ok()
			})
		}
		else res.ok()
	},

	findAvailable: function (req, res) {
		Effect.find(function (err, effects) {
			if (err) res.serverError();
			else {
				actuatorsIds = _.pluck(effects, 'actuator');
				actuatorsIds.push(0);

				Actuator.find({id: {'!': actuatorsIds}}, {select: ['id', 'name']}).exec(function (err, actuators) {
					if (err) res.serverError();
					else res.json(actuators);
				});
			}
		});
	},

	findErrors: function(req, res) {
		var paginate = {
			skip: 0,
			limit: 5
		}

		if (req.query.limit) {
			paginate.limit = req.query.limit % sails.config.globals.maxPageResults;
		}

		if (req.query.page) {
			paginate.skip = (req.query.page - 1) * paginate.limit;
		}

		SPUError.find({where: {device: req.params.id, type: 1}, skip: paginate.skip, limit: paginate.limit}, {select: ['message', 'sampledate']}).sort('sampledate DESC').exec(function (err, errors) {
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

		Action.find({where: {actuator: req.params.id}, skip: paginate.skip, limit: paginate.limit}).sort('createdAt DESC').exec(function (err, actions) {
			if (err) res.serverError();
			else res.json(actions);
		})
	}
};
