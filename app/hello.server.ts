/**
 * Created by Administrator on 2017/8/5.
 */

import * as http from "http"

const server = http.createServer((request , response) => {
    response.end("hello Node !")
});

server.listen(8000);