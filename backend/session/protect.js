const protect = (request, response, next) => {
	if (request.session.authenticated) {
		// authentification methods
		// keeps track of the logged in user
		next();
	} else {
		response.redirect("/SignIn");
	}
};

module.exports = protect;
