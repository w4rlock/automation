var express = require('express')
, http = require('http')
, path = require('path')
, app = express()
, port = 6661

app.use('/', express.static(path.join(__dirname, 'app')));

http.createServer(app).listen(port, 
  function() {
    console.log("\n[*] Server Listening on port %d", port); 
  }
);
