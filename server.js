///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongojs = require('mongojs');
var app = express();
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));

// Run Morgan for Logging & BodyParser interprets data sent to the server
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// MongoDB Configuration configuration (Change this URL to your own DB)
var databaseUrl = 'mongodb://admin:codingrocks@ds023674.mlab.com:23674/heroku_5ql1blnl';
var collections = ["clicks"];

// use mongojs to hook the database to the db variable 
var db = mongojs(databaseUrl, collections);

db.on('error', function (err) {
  console.log('MongoDB Error: ', err);
});


// Main Route. This route will redirect to our rendered React application
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

// This is the route we will send GET requests to retrieve our most recent click data.
// We will call this route the moment our page gets rendered
app.get('/api/', function(req, res) {

  // This GET request will search for the latest clickCount
  db.address.find({}, function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    });
});

// This is the route we will send POST requests to save each click.
// We will call this route the moment the "click" or "reset" button is pressed.
app.post('/api/', function(req, res){
  var object = {
    location: req.body.location,
    time: req.body.date
  }
  console.log(object);

  db.address.insert(object, function(err, data){

    if(err){
      console.log(err);
    }

    else{
        db.address.find({}, function(err, data) {
          res.json(data)
        })
    }

  });

});

//Listener
var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log("Listening on %d", PORT);
});