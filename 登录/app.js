var mysql  = require('mysql');  //导入mysql包

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    port: '3306',
    database: 'yyf'
});
connection.connect();

var express = require('express');
var app = express();
app.use(express.static('public'));
//参数里为'/'则是默认打开页面
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "登录.html" );
})
app.get('/login',function (req,res) {
    var response = {
        "username":req.query.username,
        "password":req.query.password,
    };
    var selectSQL = "select username,password from user where username = '"+req.query.username+"' and password = '"+req.query.password+"'";
//var selectSQL = "select password from user where account='"+req.query.account+"'";
    var  addSqlParams = [req.query.username,req.query.password];
    connection.query(selectSQL,function (err, result) {
        if(err){
            console.log('[login ERROR] - ',err.message);
            return;
        }
        //console.log(result);
        if(result=='')
        {
            console.log("帐号密码错误");
            res.end("0");//如果登录失败就给客户端返回0，
        }
        else
        {
            console.log("OK");
            res.end("1");//如果登录成就给客户端返回1
        }
    });
    console.log(response);
    //res.end(JSON.stringify(response));
})
app.get('/注册.html', function (req, res) {
    res.sendFile( __dirname + "/" + "注册.html" );
})
//注册模块
var  addSql = 'INSERT INTO user(username,password,name) VALUES(?,?,?)';
app.get('/process_get', function (req, res) {
    // 输出 JSON 格式
    var response = {
        "username":req.query.username,
        "password":req.query.password,
        "name":req.query.name
    };
    var  addSqlParams = [req.query.username,req.query.password,req.query.name];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.end("0");//如果注册失败就给客户端返回0
            return;//如果失败了就直接return不会继续下面的代码
        }
        res.end("1");//如果注册成功就给客户端返回1
        console.log("OK");
    });
    console.log(response);
    //res.end(JSON.stringify(response));
})
var server = app.listen(8087, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
