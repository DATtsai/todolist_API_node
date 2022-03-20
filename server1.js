// 建立基本server與瞭解req和res
const http = require('http');

const requestListener = (req, res)=>{ // req為承接client端所發送之內容變數，res為server端要返還的相關方法物件
  // console.log(req);
  console.log(req.url);
  console.log(req.method);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello~~');
  res.end()
}

const server = http.createServer(requestListener);
server.listen(3005);