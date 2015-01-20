var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var content = [
  {
    "title": "... insomnia is a perfect oppurtunity to learn the lastest-new-web framework.",
    "body": "React, baby! Here we go!"
  }
];

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/content.json', function(req, res) {
  console.log('GET %s', req.path);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(content));
});

app.post('/content.json', function (req, res) {
  console.log('POST %s', req.path);
  console.log(req.body);
  content = content.concat(req.body);
  res.setHeader('Content-Type', 'application/json');
  console.log(content);
  res.send(JSON.stringify(content));
});


app.listen(3000);

console.log('Server started: http://localhost:3000/');
