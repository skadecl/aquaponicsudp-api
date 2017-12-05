/**
 * MeasurementController
 *
 */

var async = require('async');


module.exports = {
	push: function(req, res) {
		if (!req.body.measurements) {
			res.badRequest('Measurements array wrong format');
		}
		else {
			//Create measurements
			Measurement.create(req.body.measurements).exec(function (err, createdMeasurements) {
				if (err) {
					res.serverError(err);
				}
				else {
					//If measurements, check alarms
					if (createdMeasurements.length > 0 && req.body.fresh) {
						sensorIds = _.pluck(createdMeasurements, 'sensor');
						actions = []

						Alarm.find({sensor: sensorIds}).populate('effects').exec(function (err, alarms) {
								if (err) res.serverError();
								//If alarms found
								else if (alarms.length > 0) {
									//Populate actuators
									async.each(alarms, function (alarm, callback) {
										if (alarm.effects.length) {
											effectIndex = 0
											alarm.effects.forEach(function (effect) {
												Actuator.findOne({id: effect.actuator}).exec(function (err, actuator){
													if (err) callback(err);
													else if (actuator){
														effect.actuator = actuator
														effectIndex++
														if (effectIndex == alarm.effects.length) callback(null);
													}
													else {
														effectIndex++
														if (effectIndex == alarm.effects.length) callback(null);
													}
												})
											})
										}
										else callback(null);
									}, function (err) {
										if (err) res.serverError()
										else {
											//Alarms with populated effects and actuators
											async.each(alarms, function (alarm, callback) {
												measurement = _.find(createdMeasurements, {sensor: alarm.sensor})
												shouldTrigger = false
												switch (alarm.type) {
													case 0:
														//Equals
														if (measurement.value == alarm.value)
															shouldTrigger = true
														break;
													case 1:
														//Less than
														if (measurement.value < alarm.value)
															shouldTrigger = true
														break;
													case 2:
														//More than
														if (measurement.value > alarm.value)
															shouldTrigger = true
														break;
													default:
														callback(null);
												}

												if (shouldTrigger) {
													//Notify
													// TODO: Notify
												}

												//Update triggered status if necessary
												if (alarm.triggered != shouldTrigger) {
													alarm.triggered = shouldTrigger;
													alarm.save();
												}

												if (alarm.effects.length) {
													effectIndex = 0
													alarm.effects.forEach(function (effect) {
														if (shouldTrigger && effect.status != effect.actuator.status && !effect.actuator.lock) {
															actions.push({
																actuator: effect.actuator.id,
																status: effect.status ? 1 : 0,
																confirmed: 0
															})
														}
														else if (!shouldTrigger && effect.status == effect.actuator.status && !effect.actuator.lock) {
															actions.push({
																actuator: effect.actuator.id,
																status: !effect.status ? 1 : 0,
																confirmed: 0
															})
														}
														effectIndex++
														if (effectIndex == alarm.effects.length) callback(null)
													})
												} else {
													//No effects
													callback(null);
												}
											}, function (err) {
												if (err) res.serverError()
												else {
													if (actions.length) {
														//If got actions create them
														Action.findOrCreate(actions).exec(function (err, createdActions) {
															if (err) {
																res.serverError();
																console.log(err);
															}
															else {
																//Get new and old actions
																Action.find({confirmed: 0, attempts: { '<': sails.config.globals.maxActionAttempt }}).exec(function (err, allActions) {
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
													//If not new actions, get only the old ones
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
															else res.created()
														})
													}
												}
											})
										}
									})
								}
								else {
									//If no alarms were found, return actions
									Action.find({confirmed: false, attempts: { '<': sails.config.globals.maxActionAttempt }}).exec(function (err, allActions) {
										if (err) res.serverError();
										else if (allActions.length > 0){
											allActions.forEach(function (action) {
												action.attempts++
												action.save()
											})
											var pickedActions = _.map(allActions, _.partialRight(_.pick, ['id', 'actuator', 'status']))
											res.status(210).json(pickedActions)
										}
										else {
											res.created();
										}
									})
								}
							});

							Sensor.updateValues(createdMeasurements);
					}
					else {
						res.created();
					}

					if (req.body.errors) {
						SPUError.create(req.body.errors).exec(function(err, errors){
							if (err) console.log(errors)
						});
					}
				}
			});
		}
	}
};
