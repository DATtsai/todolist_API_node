// 建立編輯代辦事項API
// 1.新增路由處理單筆代辦
// 2.使用req.on('end', ()=>{})承接完整request body
// 3.例外處理，JSON.parse()異常、未依規格填寫body欄位、未給定正確id

const http = require('http');
const { rawListeners } = require('process');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');

const todos = [ // 先放些測試用資料確定回傳正確
  { 
    'title': 'item1',
    'id': uuidv4(),
  },
  { 
    'title': 'item2',
    'id': uuidv4(),
  },
]; // 暫存在本機記憶體上，之後要改到伺服器DB上

const requestListener = (req, res)=>{ // req為承接client端所發送之內容變數，res為server端要返還的相關方法物件
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*', // CORS容許其他伺服器IP都可造訪
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE', // 支援方法
    'Content-Type': 'application/json'
  }
  // console.log(req);
  console.log(req.url);
  console.log(req.method);
  let body = ''; // 用來承接並組裝TCP封包
  // 註冊req中的封包處理方法
  req.on('data', (chunk)=>{ // 監聽資料的所有封包
    console.log(chunk);
    body+=chunk; // 累加所有封包
  });

  if(req.url === '/' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': [],
    }));
    res.end();
  }
  else if(req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos,
    }));
    res.end();
  }
  else if(req.url === '/todos' && req.method === 'POST') {
    // 註冊req中的封包處理方法
    req.on('end', ()=>{
      console.log(body);
      console.log(typeof body);
      // 判斷是否為JSON格式
      try{
        console.log(JSON.parse(body).title);
        const title = JSON.parse(body).title;
        if(title !== undefined) {
          const todo = {
            'title': title,
            'id': uuidv4(), 
          }
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            'status': 'success',
            'data': todos,
          }));
          res.end();
        }
        else{
          // 未重構前
          // res.writeHead(400, headers);
          // res.write(JSON.stringify({
          //   'status': 'fail',
          //   'message': `request body formate error! miss the key of title!`,
          // }));  
          // res.end(); 

          errorHandle(res, headers);
        }
      }
      catch(error){
        // 未重構前
        // res.writeHead(400, headers);
        // res.write(JSON.stringify({
        //   'status': 'fail',
        //   'message': `request body formate error! ${error}`,
        // }));  
        // res.end();      

        errorHandle(res, headers, error);
      }
    });
  }
  else if(req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0; // 清空陣列元素
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos,
    }));
    res.end();
  }
  else if(req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);
    console.log('id: ', id, 'index: ', index);
    if(index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        'status': 'success',
        'data': todos,
      }));
      res.end();
    }
    else{
      errorHandle(res, headers);
    }
  }
  else if(req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', ()=>{
      try{
        const id = req.url.split('/').pop();
        const todo = JSON.parse(body).title;
        const index = todos.findIndex(item => item.id === id);
        console.log('id: ', id, 'todo: ', todo, 'index: ', index);
        if(todo !==  undefined && index !== -1) {
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            'status': 'success',
            'data': todos,
          }));
          res.end();
        }
        else{
          errorHandle(res, headers);
        }
        res.end();
      }
      catch(error) {
        errorHandle(res, headers, error);
      }
    });
  }
  else if(req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
  else{
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      'status': 'fail',
      'message': '404 not found',
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(3005);