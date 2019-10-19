var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看 ************/
  /*  console.log('方方说：得到HTTP路径为\n' + path) */
  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if (path === '/') {
    let string = fs.readFileSync('./index.html', 'utf-8')
    let amount = fs.readFileSync('./db', 'utf-8')
    string = string.replace('&&&amount&&&', amount)
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/style.css') {
    response.statusCode = 200
    let string = fs.readFileSync('./style.css', 'utf-8')
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/main.js') {
    response.statusCode = 200
    let string = fs.readFileSync('./main.js', 'utf-8')
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === "/pay") {
    let amount = fs.readFileSync('./db', 'utf-8')
    let newAmount = amount - 1
    fs.writeFileSync('./db', newAmount)
    response.setHeader('Content-Type', 'text/javascript')
    response.statusCode = 200
    response.write(`
      ${query.callback}.call(undefined,{
        "success":true,
        "left":${newAmount}
      })
    `)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('找不到')
    response.end()
  }

  /******** 代码结束************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


