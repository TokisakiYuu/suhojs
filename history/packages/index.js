
/**
 * 从当前script节点上获取入口脚本的url
 */
let mainModUrl = document.currentScript.getAttribute("suho-main");
let configUrl  = document.currentScript.getAttribute("suho-config");


 /**
 * 运行配置脚本
 */
if(configUrl){
    loadAndRunConfig(configUrl);
}else{
    doWork();
}



/**
 * 当入口模块被生成后，此变量应该被替换成入口模块，否则默认函数被运行了说明内部出错了
 */
let mainMod = function(){
    error(
        "The main module failed to load"
    );
}

/**
 * 生成入口模块
 */
function buildMainModule(url){
    let config = {};
    let levels = url.split("/");
    let fileName = levels.reverse()[0];
    let type = fileName.substr(fileName.lastIndexOf("."));
    config.url = url;
    config.fileName = fileName;
    config.type = type;
    return config;
}
function doWork(){
    generateModule(
        buildMainModule(mainModUrl), 
        function(module) {
            mainMod = module;
            snail_crawl(produce);
        }
    );
}



/**
 * 当所有所需的模块都被正确地加载到了环境中后，调用此函数开启正常业务流程，进入生产环节，
 * 并且确保此函数被调用时页面已经加载完毕了
 */
function produce() {
    //确保运行时页面已经加载完毕了
    if (document.readyState == "complete") {
        mainMod(require);
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState == "complete"){
                mainMod(require);
            }
        })
    }
}




/**
 * 加载并运行配置脚本
 * @todo 完善配置脚本特性
 */
function loadAndRunConfig(url){
    fetchResource(url, "text", function(raw){
        var configFn = new Function("Suho                        /* config */", raw);
        configFn(Suho);
        doWork();
    });
}




/**
 * 从模块库中取用一个模块
 */
function require(sign, _){
    let mod = modules.get(sign);
    let $ = mod.$;
    return typeof $ === "function"
        ? $(require)
        : $;
}