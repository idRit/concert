let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('./config/database.config.js');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

//default
app.get('/', (req, res) => {
    //do something
});

// Require event routes
require('./api/routes/concert.route.js')(app);

app.listen(3000);
console.log('listening on port 3000');