var request = require('request');

function Bot() {
    // app.post('/payload', function(request, response) {
    //     console.log('REQUEST BODY\n');
    //     console.log(request.body);
    //     if (request.body.hasOwnProperty('pull_request')) {
    //         handlePR_Event(request.body);
    //     }
    //     else if (request.body.hasOwnProperty('issues')) {
    //         if(request.body.issues.hasOwnProperty('pull_request')) {
    //             handlePR_Comment(request.body);
    //         }
    //     }
    //     response.status(200);
    //     response.set('Content-type', 'application/json');
    //     response.send({"test":"TRUE"})
    //     //console.log(body);
    // });

}

Bot.prototype.payloadHandler = function (request, response) {
    console.log('REQUEST BODY\n');
    console.log(request.body);
    if (request.body.hasOwnProperty('pull_request')) {
        this.handlePR_Event(request.body).bind(this);
    }
    else if (request.body.hasOwnProperty('issues')) {
        if(request.body.issues.hasOwnProperty('pull_request')) {
            this.handlePR_Comment(request.body).bind(this);
        }
    }
    response.status(200);
    response.set('Content-type', 'application/json');
    response.send({"test":"TRUE"})
    //console.log(body);
}



Bot.prototype.newPR_hasAuthorChecklist = function (prObj) {
    if (
        prObj.body.includes("Changes address original issue?") ||
        prObj.body.includes("Unit tests included and/or updated with changes?") ||
        prObj.body.includes("Command line build passes?") ||
        prObj.body.includes("Changes have been smoke-tested?")
    ) return true;
    else return false;
}

Bot.prototype.addLabel_needsAuthorChecklist = function (prObj) {
    // /repos/:owner/:repo/issues/:number/labels
    //just an extra comment to test
    var labels_url = prObj.issue_url + "/labels";
    var options = {
        url: labels_url,
        headers: {
            'User-Agent': 'request',
            'token': 'insert token here!'
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


Bot.prototype.handlePR_Event = function (reqBody) {
    //there are three types of events.
    //1. pull request.
    //2. pull request review comment.
    //3. pull request review.
    console.log("HANDLING PR EVENT\n");
    console.log(reqBody.pull_request);
    if (reqBody.action === "opened"){
        console.log("NEW PR OPENED");
        var hasAuthorChecklist = this.newPR_hasAuthorChecklist(reqBody.pull_request);
        console.log("HAS AUTHOR CHECKLIST: " + hasAuthorChecklist);
        if(!hasAuthorChecklist) this.addLabel_needsAuthorChecklist(reqBody.pull_request);
    }

}

Bot.prototype.handlePR_Comment = function (reqBody) {
    console.log("HANDLING PR COMMENT\n")
    console.log(reqBody.issues.pull_request);
}




module.exports = Bot;
