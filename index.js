// ///////////////
// particle lights - light management for a particle button
////
var express = require('express');
var app = express();   
var querystring = require('querystring');
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));
var port = process.env.PORT || 8080;
var http = require("https");
var bodyParser = require('body-parser');
var deviceId="";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
 
// start the server
app.listen(port);
console.log('Server started!');
// routes will go here
app.head("/smarterai",(req2,res2)=>{
  res2.sendStatus(200);
})
app.post('/smarterai', function (req1, res1) {
  console.log('POST /smarterai');
  console.log(req1.body);
  command = req1.body.args;
  deviceId = req1.body.deviceId;
  console.log('text: ' + command);
  var options = "{}";
  var postData = querystring.stringify({
    args: command
  });

    var options = {
      method: 'POST', 
      hostname: 'api.particle.io',
      path: '/v1/devices/42004f001051363036373538/mask',
      port: 443,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer 95bc8b1b03e64511149e156cc61be2175f80c09a',
        'Content-Length': postData.length
      }
    }
  
  
  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  
    res.on("error", function (error) {
      console.error(error);
    });
  });
  
  req.write(postData);
  res1.sendStatus(200);
  req.end();

})