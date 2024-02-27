本地运行：
安装15.0以上node.js
下载所有文件至主目录，假设为main_vue，解压node_modules文件夹到同一主目录main_vue
admin用户进入cmd，进入main_vue目录并执行npm run serve

服务器部署：
admin用户进入cmd，进入main_vue目录并执行npm run build
生成dist包即为部署内容
登录服务器root
cd /usr/share/nginx
备份dist
tar -zcvf dist.tar.gz2024XXXX dist
rm -rf dist
上传main_vue下的dist目录
nginx -s reload
