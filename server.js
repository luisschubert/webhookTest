var express = require('express');
var port = 4567;
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.post('/payload', function(request, response) {
    console.log('RESPONSE\n\n');
    console.log(response);
    // var responseO = JSON.parse(response);
    // console.log(responseO);
    // var requestO = JSON.parse(request);
    console.log('REQUEST\n\n');
    console.log(request);
    console.log('REQUEST BODY\n\n');
    console.log(request.body);
    //console.log(body);
});

app.listen(port, function(){
    console.log("ya bish is running on 4567");
});
