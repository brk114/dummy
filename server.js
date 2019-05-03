var express = require('express'),
    path = require('path'),
    url = require("url"),
    fs = require("fs"),
    app = express(),
    port = process.env.PORT || 8520,
    server = require('http').createServer(app).listen(port),
    bodyParser = require('body-parser'),
    request = require('request');

app.use(express.static(__dirname + "/")); //use static files in ROOT/public folder

app.get('/api/', function(req, resp) {
    resp.send({ 'hello': 'world' });
});

app.get('/api/ping', function(req, res) {
    res.send({ message: 'pong' });
});

// app.use(
//     connection(mysql, {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         port: 3306, //port mysql
//         database: 'mydata'
//     }, 'request')
// ); 

//route index, hello world
app.use(function(request, response) {

    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
        '.html': "text/html",
        '.css': "text/css",
        '.js': "text/javascript"
    };

    fs.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }
        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }
            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
});

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");