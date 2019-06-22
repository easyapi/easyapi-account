EasyAPI账户中心
--------

EasyAPI账户中心，是一个纯静态项目工程，通过调用API接口实现功能。

## 开发建议
- 公共样式表、脚步、图片放到easyapi-static项目中
- 每个站点，根据需要独立建立静态文件，css，images，js（命名参照jhipster框架，Bootstrap等）
- 样式表使用less语法编写

## 命名规范

- 使用kebab-case（短横线）命名方式
- 图片资源采用的命名规范
- CSS命名规范
- 常规名称命名方案，参见EasyAPI中英文翻译

## 目录结构

``` bash
├── README.md
├── index.html              #首页
├── login.html              #登录
├── signup.html             #注册
├── forget-password.html    #忘记密码
├── callback                #第三方登录
├── images                  #图片文件夹
├── css                     #样式文件夹
└── js                      #脚本文件夹

```

    
## 常见问题
	
**1. 样式图片等无法访问，访问本地静态资源**

    请单独运行easyapi-static项目(https://github.com/easyapi/easyapi-static)，端口使用80，访问地址http://localhost。
    使用SwitchHosts，设置127.0.0.1 static.easyapi.com。
