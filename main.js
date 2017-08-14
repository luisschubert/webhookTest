(function () {
    "use strict";
    var PRBot = require('./server.js');
    var bodyParser = require('body-parser');
    var express = require('express');


    var app = express();
    var bot = new PRBot();
    var port = 4567;
    app.use(bodyParser.json());
    app.listen(port, function(){
        console.log("Bot Server is running on 4567");
    });
    app.post('/payload',bot.payloadHandler.bind(bot));


}());
