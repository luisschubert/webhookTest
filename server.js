var express = require('express');
var port = 4567;
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

function handlePR_Event(reqBody) {
    //there are three types of events.
    //1. pull request.
    //2. pull request review comment.
    //3. pull request review.
    console.log("HANDLING PR EVENT\n");
    console.log(reqBody.pull_request);

}

function handlePR_Comment(reqBody) {
    console.log("HANDLING PR COMMENT\n")
    console.log(reqBody.issues.pull_request);
}

app.post('/payload', function(request, response) {
    console.log('REQUEST BODY\n');
    console.log(request.body);
    if (request.body.hasOwnProperty('pull_request')) {
        handlePR_Event(request.body);
    }
    else if (request.body.hasOwnProperty('issues')) {
        if(request.body.issues.hasOwnProperty('pull_request')) {
            handlePR_Comment(request.body);
        }
    }
    response.status(200);
    response.set('Content-type', 'application/json');
    response.send({"test":"TRUE"})
    //console.log(body);
});

app.listen(port, function(){
    console.log("ya bish is running on 4567");
});
