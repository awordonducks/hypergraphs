//Set up requirements
var express = require("express");
var Request = require('request');

var app = express();

var http = require('http').Server(app);
//Set up the view directory
app.set("views", __dirname);


//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));


//ROUTES
app.get("/", function(req, res){
	res.render('index');
});

app.get("/hypergraph", function(req, res){
	res.render('hypergraph');
});

app.get("*", function(req, res){
	res.render("index")
})



//SERVER START
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

 
http.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});
