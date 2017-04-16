/* What about serving up static content, kind of like apache? */
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;

var url = "mongodb://mehtada3:05270@mcsdb.utm.utoronto.ca:27017/mehtada3_309";
// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
app.use('/',express.static('static_files')); // this directory has files to be returned

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

/*Validate User Login*/
app.post('/login', function (req, res) {
  console.log(req.body);
  mongo.connect(url, function(err,db){
  	if(err){
  		console.error(err);

  	} else {
  		console.log("connected to database");
  		var collection = db.collection("players");
  		collection.find({"username":req.body.username}).toArray(function (err,result){
  			if(err){
  				res.sendStatus(500);

  			} else if(result.length == 1 && req.body.password==result[0].password){
 				 res.send({"status":"OK"});
  			}else {
  				res.sendStatus(400);
  			}

  		});
  	}
    db.close();

  });
  
});

/*Update user password*/
app.post('/updateVote', function (req, res) {
  console.log(req.body);
  mongo.connect(url, function(err,db){
  	if(err){
  		console.error(err);

  	} else {
  		var collection = db.collection("users");
  		collection.find({"username":req.body.username}).toArray(function (err,result){
        console.log(result);
  			if(err){
  				res.send({"status":"BAD"});

  			} else if(result.length == 1){

			  	collection.update({username:req.body.username}, {$set: { vote: req.body.vote} }, function (err, result){
			  		if (err){
			  			res.sendStatus(500);

			  		} else{
			  			console.log("updated");
			  			res.send({"status":"OK"});
			  		}
			  	});	
  			}else{
          res.sendStatus(400);
        }

  			db.close();
  		});
  	}
  });
  
});

/*Get all votes*/
app.get('/getVotes', function (req, res) {

  // get the user
  mongo.connect(url, function(err,db){
    if(err){
      res.sendStatus(500);
    } else {
      var collection = db.collection("players");
      var response = {status:"OK"};

      collection.find({vote: 'extend'}).toArray(function (err,result){
        response.extend=result.length;

      });

      collection.find({vote: 'dontextend'}).toArray(function (err,result){
        response.dontextend=result.length;
        res.send(response);

      }); 
    }
   db.close(); 
  });
});

app.listen(10570, function () {
  console.log('Example app listening on port 10570!');
});