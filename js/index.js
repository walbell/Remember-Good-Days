/**
 * Index requiring all services and controllers
 */

/**
 * Main file
 */
require('./app.js');

/**
 * Controllers
 */
require('./controllers/mainCtrl.js');
require('./controllers/imagesCtrl.js');
require('./controllers/settingsCtrl.js');

/**
 * Services
 */
require('./services/auth.js');
require('./services/user.js');
require('./services/feed.js');

/**
 * External libraries
 */
require('angular-local-storage');

