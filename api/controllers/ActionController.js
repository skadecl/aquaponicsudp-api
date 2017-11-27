/**
 * ActionController
 *
 * @description :: Server-side logic for managing Actions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	confirmActions: function(req, res){
		Action.update({id: req.body}, {confirmed: true})
		.exec(function (err, actions){
			if (err) {
				res.serverError();
			}
			else if (actions.length){
				async.each(actions, function(action, callback) {
					Actuator.update({id: action.actuator}, {status: action.status}).exec(function (err, updatedAction) {
						if (err) callback(err)
						else callback(null)
					})
				}, function (err) {
					if (err) res.serverError()
					else res.ok()
				})
			}
			else {
				res.ok()
			}
		});
	}
};
