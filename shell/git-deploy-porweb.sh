codePath="/home/program/source/device_managment_web"
shellPath="/home/program/source/device_managment_web/shell"
target_path="/home/program/source/device_managment_web/dist"
deploy_path="/home/program/device_managment_web"
index_page="index.html"
env_file="product_env.js"
expectitem="test"

################################# 打包库选择 ##################################
read -p  "生产环境（1） 测试环境（2） 退出（3）" choic

if [ $choic -eq 1 ]
then
        echo "生产环境打包"
        deploy_path="/home/program/device_managment_web"
        env_file="product_env.js"
        expectitem="production"
elif [ $choic -eq 2 ]
then
        echo "测试环境打包"
        deploy_path="/home/program/device_managment_web"
        env_file="test_env.js"
        expectitem="test"
elif [ $choic -eq 3 ]
then
        exit 0
else
        exit 2
fi

################################# GIT拉取最新代码 ##################################
echo  "拉取代码..."
cd $codePath
git stash save "s"
git pull

################################# install and build ##############################################
cd $codePath
echo  "npm install..."
npm install --unsafe-perm=true --allow-root
npm run build:prod
################################# 打压缩包 ####################################
cd $target_path
echo  "产生对应压缩包..."
zip -rq webapp.zip *
cp webapp.zip $deploy_path/webapp.zip
cd $deploy_path
unzip -o webapp.zip

echo  "ok..."
