const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(port || process.env.PORT, function(){
    console.log("successful");
});

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
    const fName = req.body.fName;
    const sName = req.body.sName;
    const email = req.body.mail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: sName
                }
                
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/602d328860";

    const options = {
        method: "POST",
        auth: "omercol:t5b8a9a9a1f12d5d9b6714c87fc98e0a9-us17"
    }

    const request = https.request(url, options, function (response) {
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
      });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

//5b8a9a9a1f12d5d9b6714c87fc98e0a9-us17

//602d328860