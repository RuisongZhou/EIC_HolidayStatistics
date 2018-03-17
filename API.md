后台数据库链接
===

### Mongodb使用

+ 通过文件mongodb-win32-x86_64-2008plus-v3.4-latest-signed.msi安装Mongodb
+ 添加环境变量：H:\MongoDB\bin（自己安装的目录）
+ 在MongoDB文件夹中添加新建db文件夹
+ 在MongoDB文件夹中添加新建log文件夹并在其中新建文件Mongodb.log
+ 打开Mongodb.conf文件将dbpath、logpath换成自己电脑上的绝对路径
+ mongod命令启动mongo数据库服务
```
mongod -f ./Mongodb.conf
```
Mongodb.conf文件已打包在压缩包中，命令行路径自己修正
+ 启动后无反应说明启动成功，之后可运行压缩包bin文件夹中的www查看是否连接成功，没有报错可以登陆localhost:3030检查网站是否成功运行