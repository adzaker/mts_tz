const http = require("http");
const fs = require("fs");

http.createServer(function (request, response) {
  const filePath = request.url.substr(1);
  console.log(filePath);
  fs.readFile(filePath, function (error, data) {
    response.end(data);
  })
}).listen(3000, function () {
  console.log("Server started at 3000");
});
