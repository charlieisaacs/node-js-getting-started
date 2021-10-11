// ///////////////
// work from anywhere challenge, called from a Slack App by Charlie Isaacs
////
var express = require('express');
var app = express();   
var querystring = require('querystring');
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));
var port = process.env.PORT || 8080;
var http = require("https");
var bodyParser = require('body-parser');
var token = "FILL IN";
var options2; 
var stringoptions; 
var savedbody = "";
var fs = require('fs');
var salesforceresponse = "";  

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// start the server
app.listen(port);
console.log('Server started!');
// routes will go here
app.post('/smarterai', function (req1, res1) {

  console.log('POST /smarterai');
  console.log(req1.body);
  var command = req1.body.text;
  console.log('actionId: ' + command);
  var deviceId = req1.body.user_id;
  console.log('deviceId (UserId): ' + deviceId);
  var actionId = command;
var itemId = "future";

if (deviceId == null) {
  console.log('this requires a deviceId and should be included as a record in the wfachallengeResponse Custom Object in Salesforce');
}
// GET TOKEN
//
const data = JSON.stringify({"grant_type":"password","client_id":"3MVG9vtcvGoeH2bhwf7xlWyLCGRU88kx78A0L9zVIZQd7QMGCqaqm.W6YWxj5Uw1sl4ef5U.KpqRT6lcxyjV7","client_secret":"E4BEB9ADE7F6AD7E37EB5202143EA924B5B3E7E784842DC6CAAF5CEF118250FF","username":"cisaacs@dfcharlie19sdo.demo","password":"Salesforce1"});
var options = {
hostname: 'login.salesforce.com',
port: 443,
path: '/services/oauth2/token?grant_type=password&client_id=3MVG9vtcvGoeH2bhwf7xlWyLCGRU88kx78A0L9zVIZQd7QMGCqaqm.W6YWxj5Uw1sl4ef5U.KpqRT6lcxyjV7&client_secret=E4BEB9ADE7F6AD7E37EB5202143EA924B5B3E7E784842DC6CAAF5CEF118250FF&username=cisaacs@dfcharlie19sdo.demo&password=Salesforce1!', 
method: 'POST',
headers: {
  'Content-Type': 'application/x-www-form-urlencoded'
}
};
/// Get the token /////////////
var req = http.request(options, function(res) {
console.log('Status: ' + res.statusCode);
//console.log('Headers: ' + JSON.stringify(res.headers));
res.on('data', function (body) {
  console.log('***********Body: ' + body);
  var obj = JSON.parse(body);
  var keys = Object.keys(obj);
  console.log(obj[keys[0]]);
  token = obj[keys[0]];
  console.log('here is the token: ' + token);
///// End of Token Request  routes will go here
////////
////// Let's send data to Salesforce Flow
/////
////

salesforceoptions = { 
  

};
 
  var bearertoken = 'Bearer '+token;   
  jsonpayload = '{"inputs" : [ {"actionId" : "'+actionId+'","itemId": "'+itemId+'","deviceId": "'+deviceId+'"} ]}';
  console.log('here is jsonpayload: '+jsonpayload);
    ///////////////////////////////////
    ////// now send API Call to Call the Flow
    options2 = {
      path: '/services/data/v33.0/actions/custom/flow/wfachallenge', 
      method: 'POST',
      hostname: 'dfcharlie19sdo-demo.my.salesforce.com',
      port: 443,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': bearertoken
      } 
    };
    var stringoptions = JSON.stringify(options2);
    console.log('stringoptions: '+stringoptions);
    console.log('Using this flow: wfachallenge');

    var req = http.request(options2, function(res) {
      console.log('Status: ' + res.statusCode);
      //console.log('Headers: ' + JSON.stringify(res.headers));
      var body = '';
      res.on('data', function (bodychunk) {
        body += bodychunk;
      ////
      }); 
      res.on('end', function(){
        console.log('SF Response: ' + body);
        console.log('success, calling queryresponse: ');
        queryresponse(token,res1,deviceId);
        if (actionId == 'redon' || actionId == 'alloff' || actionId == 'greenon') {
          lightcontrol(actionId);
        }
      });
      
    });
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(jsonpayload);
   
    req.end();
/// Wait to complete
////
//// Send Response Back
////

var body =  '{"deviceIdNumber__c":"1234567","speech__c":"hello world"}';

var obj = JSON.parse(body);

});
});
req.on('error', function(e) {
console.log('problem with request: ' + e.message);
});
// write data to request body
req.end();
}); 
function queryresponse(token,res1,deviceId) {
  //
  // This is a SOQL query that grabs the output from the Flow
  //
  var bearertoken = 'Bearer '+token;
  var pathstring = 'https://dfcharlie19sdo-demo.my.salesforce.com/services/data/v20.0/query/?q=SELECT+Response__c+from+wfachallengeResponse__c+where+deviceId__c=\''+deviceId+'\'';
  wfachallengeoptions = {
    hostname: 'dfcharlie19sdo-demo.my.salesforce.com',
    port: 443,
    path: pathstring,  
    method: 'GET',  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearertoken
    }
  }; 
  var reqwfachallenge = http.request(wfachallengeoptions, function(reswfachallenge) {
    var body = '';
    console.log('Status: ' + reswfachallenge.statusCode);
    //console.log('Headers: ' + JSON.stringify(reswfachallenge.headers));
    reswfachallenge.on('data', function (wfachallengechunk) {
      body += wfachallengechunk;
    ////
    }); 
    reswfachallenge.on('end', function(){
      console.log('###########wfachallenge Body: ' + body);
      var wfachallengeobj = JSON.parse(body);
      for (x in wfachallengeobj) {
        //console.log('wfachallenge: '+x);
        if (x == 'records') {
          console.log('Response[0]: ' + wfachallengeobj.records[0].Response__c);
          salesforceresponse = wfachallengeobj.records[0].Response__c;
          console.log('salesforceresponse' + salesforceresponse);
          res1.send(salesforceresponse);
         
        } 
      }
    }); // response from wfachallenge 'end'
 
});
reqwfachallenge.on('error', function(e) {
console.log('problem with request: ' + e.message);
});

// write data to request body
reqwfachallenge.end();
////END of queryresponse
}

function lightcontrol (actionId) {
  console.log('changing LED...');
  var postData = querystring.stringify({
    args: actionId
  });
  var optionsparticle = {
    method: 'POST', 
    hostname: 'api.particle.io',
    path: '/v1/devices/42004f001051363036373538/mask',
    port: 443,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer 95bc8b1b03e64511149e156cc61be2175f80c09a',
      'Content-Length': postData.length
    }
  
  };
  
  var particlereq= http.request(optionsparticle, function (particleres) {
    var chunks = [];
  
    particleres.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    particleres.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  
    particleres.on("error", function (error) {
      console.error(error);
    });
  });

  particlereq.write(postData);
  
  particlereq.end();

}