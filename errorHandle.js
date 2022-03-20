function errorHandle(res, headers, error) {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    'status': 'fail',
    'message': `request formate error! ${error ? error : 'miss the key of title or id!'}`,
  }));  
  res.end();
}

module.exports = errorHandle;
