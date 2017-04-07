var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var friends = require("mongoose-friends");
var handlebars = require('handlebars');

var url = 'mongodb://localhost/4770TeamProject';
mongoose.connect(url);
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var comments = require('./routes/comments');
var groups = require('./routes/groups');
var lostItems = require('./routes/lostItems');
var schedule = require('./routes/schedule');
var poll = require('./routes/poll');
var feedback = require('./routes/feedback');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case 'contains':
            return (v1.includes(v2)) ? options.fn(this) : options.inverse(this);
        case 'equals':
            return (v1.equals(v2)) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

handlebars.registerHelper('ratingsAverage', function(v1){
  var sum = 0;
  var average = 0;
  for(var i = 0; i< v1.length; i++){
    sum += parseInt(v1[i]);
  }
  average = sum/v1.length;
  return average;
});

handlebars.registerHelper('voteCount', function(v1){
  return v1.length;
});

// BodyParser Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('routes'));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(expressValidator({
 customValidators: {
    isArray: function(value) {
        return Array.isArray(value);
    },
    endsWith: function(param, regex) {
        return param.endsWith(regex);
    },
 }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.post = req.post;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/groups', groups);
app.use('/lostItems', lostItems);
app.use('/schedule', schedule);
app.use('/poll', poll);
app.use('/feedback', feedback);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
