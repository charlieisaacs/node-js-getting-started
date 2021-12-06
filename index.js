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

 //sourceDeviceId: 4525,
 //userId: 1485,
//occurrenceTime: 1638761339627,
//tenantId: '507c100c-7242-4818-bf87-30f7786e61d6',
//eventType: 'com.anyconnect.event.vision',
 //snapshotUrl: 'https://accind0ds1.blob.core.windows.net/eventrecording0/4525/000001638761339627_snapshot.jpg?sig=J7bbesUaAyklK5nVc6s%2Bfio0FP4vKlfays1aGF6346I%3D&se=2021-12-06T04%3A29%3A21Z&sv=2019-02-02&sp=rcw&sr=b',
 //sourceImagerDetails: 'In Cabin Camera',
 //eventTriggerDetails: 'No Driver & Camera Occlusion',
//summary: ''
sourceDeviceId= "";
userId= "";
occurrenceTime= "";
tenantId= "";
eventType= "";
snapshotUrl= "";
eventTriggerDetails= "";
summary= "";

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
      sourceDeviceId=body.sourceDeviceId;
      console.log("HERE IS sourceDeviceId"+sourceDeviceId);
 //userId= "";1485,
//occurrenceTime= "";1638761339627,
//tenantId= "";'507c100c-7242-4818-bf87-30f7786e61d6',
//eventType= "";'com.anyconnect.event.vision',
// snapshotUrl= "";'https:accind0ds1.blob.core.windows.net/eventrecording0/4525/000001638761339627_snapshot.jpg?sig=J7bbesUaAyklK5nVc6s%2Bfio0FP4vKlfays1aGF6346I%3D&se=2021-12-06T04%3A29%3A21Z&sv=2019-02-02&sp=rcw&sr=b',
// sourceImagerDetails= "";'In Cabin Camera',
// eventTriggerDetails= "";'No Driver & Camera Occlusion',
//summary= "";'
    });
  
    res.on("error", function (error) {
      console.error(error);
    });
  });
  
  req.write(postData);
  res1.sendStatus(200);
  req.end();

})