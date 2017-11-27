/**
 * RoleController
 *
 * @description :: Server-side logic for managing Roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res){
		Role.findOne({id: req.params.id})
		.populate('permissions')
		.exec(function (err, role) {
			if (err) {
				res.serverError(err);
			}
			else if (!role) {
				res.notFound();
			}
			else {
				res.json(role);
			}
		})
	}
};
