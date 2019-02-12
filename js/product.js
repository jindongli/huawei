//引入第三方模块
requirejs.config({
    "paths": {
        "jquery": "jquery.min", //jquery库
        "login": "login", //登录模块
        "elg": "enlarge", //放大镜模块
        "sc": "scLocalStorage" //本地缓存操作模块
    }
})

//依赖注入并编写代码
requirejs(["jquery", "login", "elg", "sc"], function ($, lg, elg, sc) {

    //页面加载后
    $(function () {

        //判断是否处于登录状态
        var uName = localStorage.getItem("HWuName");
        if (uName) { //如果已经登录
            lg.hasLoginInit(uName, sc); //页面初始化           
        } else {
            //点击登录
            var login = $(".login");
            login.click(function () {
                lg.add("../css/login.css", "../php/login.php");//加载登录模块
            })
        }

        //搜索框获取焦点及失去焦点事件
        var searchKw = $("#search-kw");
        var searchBarKey = $(".search-bar-key");
        searchKw.focusin(function () { searchBarKey.hide(); });
        searchKw.blur(function () { searchBarKey.show(); });

        //根据跳转过来的信息加载产品图片
        var type = location.search.split("=")[1]; //获取商品类型
        var gid = location.hash.slice(1); //获取商品ID
        var pro = new Promise(function (success) {
            $.getJSON("../json/goods_" + type + ".json", function (res) {
                success(res);
            })
        });
        pro.then(function (res) {
            for (var i = 0; i < res.length; i++) {
                if (gid == res[i].id) {//找到匹配的商品

                    $("#pro-name").html(res[i].name);
                    $("#pro-name+p").html(res[i].descript);
                    $("#pro-id>span").html(res[i].id);
                    $("#pro-price>b").html("￥ " + res[i].price + ".00");
                    var str = "";
                    for (var j = 0; j < res[i].imgs.length; j++) {
                        str += `<li><img src='../images/goods/${type}/${gid}/${res[i].imgs[j]}'></li>`;
                    }
                    $("#pro-items").html(str);
                    $("#pro-items").find("li").eq(0).addClass("current");
                    var strbig = $("#pro-items").find(".current>img").attr("src").split("78_78").join("800_800");
                    $("#small-img").attr("src", strbig);
                    $("#big-img").attr("src", strbig);

                    //图片加载完毕后,初始化放大镜功能
                    var obj = {
                        smallImg: $(".pro-area"),
                        smallArea: $("#small-area"),
                        bigImg: $("#big-img"),
                        bigArea: $("#big-area"),
                        proItems: $("#pro-items"),
                        proPrev: $("#pro-prev"),
                        proNext: $("#pro-next"),
                    }
                    elg.init(obj).navMove().toPrev().toNext();
                }
            }
        });

        //商品数量增加或减少
        var addCount = $("#addCount");
        var reduceCount = $("#reduceCount");
        var proCount = $("#pro-count");
        addCount.click(function () {
            var num = +proCount.val();
            if (num) proCount.val(++num);
        });
        reduceCount.click(function () {
            var num = +proCount.val();
            if (num >= 2) proCount.val(--num);
        });

        //添加到购物车
        var proBuy = $("#pro-buy");
        proBuy.click(function () {
            //首先判断是否已经登录
            var uName = localStorage.getItem("HWuName");
            if (!uName) {
                alert("您还没有登录！请登录后再购买，谢谢！");
            } else {
                //购买的商品ID和购买数量
                var goosInfo = {
                    gId: $("#pro-id>span").html(),
                    gNum: +proCount.val()
                };
                //添加商品
                sc.addGoodsToSC(uName, goosInfo);

                //显示到页面顶部的购物车
                var shopCart = $(".s-main>ul>li>a.shopCart");
                shopCart.html("购物车(" + sc.getTotalNum(uName) + ")");

                //加入购物车成功的动画
                var src = $("#small-img").attr("src");
                $("<div class='moveImg'><img src='" + src + "'></div>").appendTo("body");
                var startLeft = proBuy.offset().left + 50;
                var startTop = proBuy.offset().top - 50;
                var endLeft = shopCart.offset().left + 20;
                var endTop = shopCart.offset().top;
                $(".moveImg").css({
                    left: startLeft,
                    top: startTop
                }).stop().animate({
                    left: endLeft,
                    top: endTop,
                    width: 10,
                    height: 10
                }, 1000, function () {
                    $(".moveImg").remove()
                });
            }
        });
    });
});