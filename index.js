var http     = require('http'),
	express  = require('express'),
	mysql    = require('mysql')
	parser   = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'db_test'
});

var sessionStore = new MySQLStore({}/* session store options */, connection);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));


app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});



app.get('/user/', function (req,res) {
	//var id = req.params.id;

	connection.query('SELECT * from nd_products', function(err, rows, fields) {
  		if (!err){
  			var response = [];

			if (rows.length != 0) {
				response.push({'result' : 'success', 'data' : rows});
			} else {
				response.push({'result' : 'error', 'msg' : 'No Results Found'});
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});



app.get('/product/', function (req,res) {
	//var id = req.params.id;

	connection.query('SELECT * from nd_products', function(err, rows, fields) {
  		if (!err){
  			var response = [];

			if (rows.length != 0) {
				response.push({'result' : 'success', 'data' : rows});
			} else {
				response.push({'result' : 'error', 'msg' : 'No Results Found'});
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});



app.post('/product/create/', function (req,res) {
	var id = req.params.id, response = [];

	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.price !== 'undefined' && 
		typeof req.body.imageUrl !== 'undefined' &&
		typeof req.body.time !== 'undefined'
	) {
		var name = req.body.name, price = req.body.price, imageUrl = req.body.imageUrl, time = req.body.time;

		connection.query('INSERT INTO nd_products values (?,?,?,?,?)', 
			[id,name, price, imageUrl,time], 
			function(err, result) {
		  		if (!err){

					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}

					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});

	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.status(200).send(JSON.stringify(response));
	}
});

app.put('/product/edit/:id', function (req,res) {
	var id = req.params.id, response = [];

	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.price !== 'undefined' && 
		typeof req.body.imageUrl !== 'undefined'
	) {
		var name = req.body.name, price = req.body.price, imageUrl = req.body.imageUrl;

		connection.query('UPDATE nd_products SET product_name = ?, product_price = ?, product_image = ? WHERE id = ?', 
			[name, price, imageUrl, id], 
			function(err, result) {
		  		if (!err){

					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}

					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});

	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.status(200).send(JSON.stringify(response));
	}
});


app.delete('/product/delete/:id', function (req,res) {
	var id = req.params.id;

	connection.query('DELETE FROM nd_products WHERE id = ?', [id], function(err, result) {
  		if (!err){
  			var response = [];

			if (result.affectedRows != 0) {
				response.push({'result' : 'success'});
			} else {
				response.push({'msg' : 'No Result Found'});
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});


app.get('/product/:id', function (req,res) {
	var id = req.params.id;

	connection.query('SELECT * from nd_products where id = ?', [id], function(err, rows, fields) {
  		if (!err){
  			var response = [];

			if (rows.length != 0) {
				response.push({'result' : 'success', 'data' : rows});
			} else {
				response.push({'result' : 'error', 'msg' : 'No Results Found'});
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});


app.listen(3000);