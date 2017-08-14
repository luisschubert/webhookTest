var express = require('express');
var request = require('request');

var port = 4567;
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

function newPR_hasAuthorChecklist(prObj) {
    if (
        prObj.body.includes("Changes address original issue?") ||
        prObj.body.includes("Unit tests included and/or updated with changes?") ||
        prObj.body.includes("Command line build passes?") ||
        prObj.body.includes("Changes have been smoke-tested?")
    ) return true;
    else return false;
}

function addLabel_needsAuthorChecklist(prObj) {
    // /repos/:owner/:repo/issues/:number/labels
    //just an extra comment to test
    var labels_url = prObj.issue_url + "/labels";
    var options = {
        url: labels_url,
        headers: {
            'User-Agent': 'request',
            'token': '6c4c4efd2868ac837eafe110f2f18c0bdd461ddd'
        },
        data: [
            "Needs: Author Checklist"
        ]
    }
    request.post(options, function(error, response, body) {
        if (error){
            console.log("Error: "+ error);
        }
        console.log(response.statusCode);
        console.log("FULL RESPONSE");
        console.log(response);
        if (response.statusCode === 200) {
            console.log(JSON.parse(response.body));
        }
    })
}


function handlePR_Event(reqBody) {
    //there are three types of events.
    //1. pull request.
    //2. pull request review comment.
    //3. pull request review.
    console.log("HANDLING PR EVENT\n");
    console.log(reqBody.pull_request);
    if (reqBody.action === "opened"){
        console.log("NEW PR OPENED");
        var hasAuthorChecklist = newPR_hasAuthorChecklist(reqBody.pull_request);
        console.log("HAS AUTHOR CHECKLIST: " + hasAuthorChecklist);
        if(!hasAuthorChecklist) addLabel_needsAuthorChecklist(reqBody.pull_request);
    }

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
