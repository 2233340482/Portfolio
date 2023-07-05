const http = require('http');
const url = require('url');
const hostname = 'localhost';
const port = 3000;
const server = http.createServer((req, res) => {
    var result = req.url.replace('%22', '"');

    while (result !== req.url) {

        req.url = req.url.replace('%22', '"');
        result = result.replace('%22', '"');

    }
    console.log(result);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
server.listen(port, hostname, () => {
    console.log("Server running at http://localhost:3000/");
});