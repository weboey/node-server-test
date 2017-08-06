/**
 * Created by Administrator on 2017/8/5.
 */
var http = require("http");
var server = http.createServer(function (request, response) {
    response.end("hello Node !");
});
server.listen(8000);
//# sourceMappingURL=hello.server.js.map