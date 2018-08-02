var express = require('express');
var router = express.Router();
// Require controller modules.
var login_controller = require('../controller/loginController');
var dashboard_controller = require('../controller/dashboardController');
/// login ROUTES ///
// GET login page.
router.get('/login', login_controller.index);
// POST request for Login.
router.post('/login', login_controller.login);
// GET Register page.
router.get('/register', login_controller.register);
// POST request for Register.
router.post('/register', login_controller.createUser);
router.get('/dashboard', dashboard_controller.dashboard);
module.exports = router;