//引入第三方模块
requirejs.config({
    "paths": {
        "jquery": "jquery.min", //jquery库
        "banner": "bannerOpacity", //轮播图模块
        "login": "login", //登录模块 
        "sc": "scLocalStorage" //购物车缓存模块
    }
})


//依赖注入并编写代码
requirejs(["jquery", "banner", "login", "sc"], function ($, ban, lg, sc) {

    //页面加载后
    $(function () {
        //判断是否处于登录状态
        var uName = localStorage.getItem("HWuName");
        if (uName) { //如果已经登录
            lg.hasLoginInit(uName, sc); //页面初始化
        } else {//未登录则加载登录模块
            var login = $(".login");
            login.click(function () {
                lg.add("css/login.css", "php/login.php");
            })
        }

        //点击隐藏上面的广告
        $("#close_advert").click(function () {
            $("#advert").hide();
        });

        //轮播图
        var banImg = $("#banner>.ec-slider>.ec-slider-img>li");
        var banNav = $("#banner>.ec-slider>.ec-slider-nav-1>li");
        ban.startMove(banImg, banNav, "current");


        //搜索框获取焦点及失去焦点事件
        var searchKw = $("#search-kw");
        var searchBarKey = $(".search-bar-key");
        searchKw.focusin(function () { searchBarKey.hide(); });
        searchKw.blur(function () { searchBarKey.show(); });

        //懒加载及楼层电梯
        var phone = $("#phone");
        var computer = $("#computer");
        var iPad = $("#iPad");
        var smartWear = $("#smartWear");
        var smartHome = $("#smartHome");
        var naverFloor = $(".naver-floor"); //楼层导航块
        var naverFloorItem = $(".naver-floor .hover-list>li");
        var floorBtn = $(".naver-floor .hover-list>li>a");
        var proArr = [phone, computer, iPad, smartWear, smartHome];
        // var proArrStr = ["phone", "computer", "iPad", "smartWear", "smartHome"];

        var isMoving = false; //表示是否有用户点击了楼层电梯

        floorBtn.click(function () { //点击相应楼层
            var index = $(this).parent().index();
            naverFloorItem.eq(index).addClass("hover").siblings().removeClass("hover");
            isMoving = true;
            $("html,body").stop(true).animate({
                scrollTop: proArr[index].offset().top - 30
            }, 500, function () { isMoving = false; });
        });

        $(window).scroll(function (e) {
            var scrollTop = $(window).scrollTop();
            //获取滚走的距离和视口的高度一半之和
            if (scrollTop >= phone.offset().top - 50) { //出现电梯导航条
                naverFloor.addClass("tool-fixed");
            } else {
                naverFloor.removeClass("tool-fixed");
            }


            //懒加载

            var t = scrollTop + $(window).height() / 2;

            if (t >= phone.offset().top && t < computer.offset().top) { //手机区域出现在屏幕中间以上
                if (!phone.find("ul.goods-list").find("li").size()) {//判断是否已经加载过商品
                    showGoods("json/goods_phone.json", phone.find("ul.goods-list"), "phone");
                }
            } else if (t >= computer.offset().top && t < iPad.offset().top) { //电脑区域出现在屏幕中间以上
                if (!computer.find("ul.goods-list").find("li").size()) {
                    showGoods("json/goods_computer.json", computer.find("ul.goods-list"), "computer");
                }
            } else if (t >= iPad.offset().top && t < smartWear.offset().top) { //iPad区域出现在屏幕中间以上
                if (!iPad.find("ul.goods-list").find("li").size()) {
                    showGoods("json/goods_iPad.json", iPad.find("ul.goods-list"), "iPad");
                }
            } else if (t >= smartWear.offset().top && t < smartHome.offset().top) { //智能穿戴区域出现在屏幕中间以上
                if (!smartWear.find("ul.goods-list").find("li").size()) {
                    showGoods("json/goods_smartWear.json", smartWear.find("ul.goods-list"), "smartWear");
                }
            } else if (t >= smartHome.offset().top) { //智能家居区域出现在屏幕中间以上
                if (!smartHome.find("ul.goods-list").find("li").size()) {
                    showGoods("json/goods_smartHome.json", smartHome.find("ul.goods-list"), "smartHome");
                }
            };

            if (!isMoving) {
                var index = 0;
                proArr.forEach(function (item, int) {
                    if (t >= item.offset().top) {
                        index = int;
                    }
                });
                naverFloorItem.eq(index).addClass("hover").siblings().removeClass("hover");
                // if (!proArr[index].find("ul.goods-list").find("li").size()) {
                // showGoods("json/goods_" + proArrStr[index] + ".json", smartHome.find("ul.goods-list"), proArrStr[index]);
                // };
            }
        });
    });



    //请求商品数据并显示在页面
    function showGoods(url, obj, type) {
        $.getJSON(url, function (res) {
            var str = ""
            for (var i = 0; i < res.length; i++) {
                str += `<li class='goods-items'>
                    <a href='src/product.html?type=${type}#${res[i].id}'>
                        <p class='grid-img'>
                            <img src='${res[i].src}'>
                        </p>
                        <p class='grid-title'>${res[i].name}</p>
                        <p class='grid-desc'>${res[i].descript}</p>
                        <p class='grid-price'>￥ ${res[i].price}</p>
                    </a>
                </li>`;
            }
            obj.html(str);
        });
    }
});



