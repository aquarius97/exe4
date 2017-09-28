var gulp = require('gulp');
var webserver = require('gulp-webserver');
var urlTool = require('url');
var qs = require('qs');
var database = {
    goodslist: [{
        name: '铅笔',
        price: .2
    }, {
        name: '橡皮',
        price: .5
    }],
    name: [
        '张三', '李四', '王麻子', '老干妈'
    ],
    users: [{
        userName: 'zhangsan',
        password: 123456
    }, {
        userName: 'lisi',
        password: 123457
    }]
};

function login(userName, password) {

    var exist = false;

    var success = false;

    var users = database['users'];

    for (var i = 0, length = users.length; i < length; i++) {

        if (userName == users[i].userName) {
            exist = true;
            if (users[i].password == password) {
                success = true;
            }
            break;
        }

    }

    return exist ? { success: success } : exist;
}
gulp.task('mockServer', function() {
    gulp.src('.')
        .pipe(webserver({
            port: 3333,
            middleware: function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                //1. 分析前端的请求方式。 到底是get 还是post  通过 req.method  查看

                //2. 看看前端想要请求的是什么 通过 pathname 来查看 

                //3. 再去分析前端穿过来的参数是什么 如果是get 请求 那么就通过 query 去查看 

                //如果是post 通过 on('data') 去查看

                //4. 设置响应头 告诉前端你返回的数据类型是什么

                //5. 填写数据 

                //6. end


                //1.获取请求方式 以便分析
                var method = req.method;
                //2.获取pathname
                var urlObj = urlTool.parse(req.url);
                var pathname = urlObj.pathname;
                //3. 获取url?以后的参数
                var getParams = urlObj.query;
                console.log(urlObj);
                if (method == 'GET') { //1.分析请求方式
                    //2分析pathname
                    switch (pathname) {
                        case '/goodslist':
                            //4.告诉前端 你要要返回什么数据类型
                            res.setHeader('content-type', 'application/json;charset=utf-8');
                            //5.写数据
                            res.write(JSON.stringify(database['goodslist']));
                            //6.结束
                            res.end();
                            break;
                        case '/name':
                            res.setHeader('content-type', 'application/json;charset=utf-8');
                            res.write(JSON.stringify(database['name']));
                            res.end();
                            break;
                        default:
                            res.end('没有这个路径');
                            break;
                    }
                } else if (method == 'POST') {
                    //准备接收受post参数
                    var postParams = '';
                    req.on('data', function(chunk) {
                        postParams += chunk;
                    })
                    req.on('end', function() {
                        var postParamsObj = qs.parse(postParams);
                        switch (pathname) {
                            case '/login':
                                res.setHeader('content-type', 'application/json;charset=utf-8');

                                var exist = login(postParamsObj.userName, postParamsObj.password);

                                if (exist) {
                                    if (exist.success) {
                                        var data = {
                                            message: '登陆成功'
                                        };
                                        res.write(JSON.stringify(data));
                                    } else {
                                        var error = {
                                            message: '密码错误'
                                        };
                                        res.write(JSON.stringify(error));
                                    }
                                } else {

                                    res.write('账号不存在');

                                }
                                res.end();
                                break;
                            case '/reguster':
                                break;
                            default:
                                res.end();
                                break;
                        }
                    })

                } else if (method == 'OPTIONS') {
                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT,DELETE',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
                    });
                    res.end();
                }
                return;
            }
        }))
});
gulp.task('default', ['mockServer'])