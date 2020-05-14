// // 1. 서버 사용을 위해서 http 모듈을 http 변수에 담는다. (모듈과 변수의 이름은 달라도 된다.)
// var http = require('http');
//
// // 2. http 모듈로 서버를 생성한다.
// //    아래와 같이 작성하면 서버를 생성한 후, 사용자로 부터 http 요청이 들어오면 function 블럭내부의 코드를 실행해서 응답한다.
// var server = http.createServer(function(request,response){
//
//     response.writeHead(200,{'Content-Type':'text/html'});
//     response.end('Hello node.js!!');
//
// });
//
// // 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
// server.listen(8080, function(){
//     console.log('Server is running...');
// });

const express = require('express'); // express 모듈 추가하기
var fs = require('fs');
var https = require('https');
var url = require('url');

const app = express();
const port = 3000;
const path = require('path');
const options = {
    key: fs.readFileSync('./keys/private.pem'),
    cert: fs.readFileSync('./keys/public.pem')
};

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/web/src/index2.html'));
});

// 구글 인증 테스트 페이지
// app.get("/", function(req, res){
//     res.sendFile(path.join(__dirname + '/web/auth/google.html'));
// })
//
// // 구글 인증 콜백
// app.get("/", function(req, res){
//     res.sendFile(path.join(__dirname + '/web/auth/google.html'));
// })

https.createServer(options, app).listen(port, function(err) {
    console.log('HTTPS SERVER : Connected port - ' + port + ' : localhost:' + port);
    console.log('Server is running...');
    if (err) {
        return console.log('Found error - ', err);
    }
});