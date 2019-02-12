//引入第三方模块
requirejs.config({
    "paths": {
        "jquery": "jquery.min", //jquery库
        "login": "login", //登录模块
        "sc": "scLocalStorage" //购物车缓存模块
    }
})

//依赖注入并编写代码
requirejs(["jquery", "login", "sc"], function ($, lg, sc) {
    //页面加载后
    $(function () {

        //判断是否处于登录状态
        var uName = localStorage.getItem("HWuName");
        if (!uName) { //如果没有登录
            //加载登录模块
            $("<div class='login-prompt'>您还没有登录！登录后可查看之前加入的商品<a href='javascript:;' class='login'>登录</a></div>").prependTo("#main>.container");
            var login = $(".login");
            login.click(function () {
                lg.add("../css/login.css", "../php/login.php");
            });
        } else { //如果处于登录状态
            lg.hasLoginInit(uName, sc); //页面初始化

            //加载客户购物车商品
            var goodsInfo = sc.getGoodsInfo(uName); //获取本地缓存中的购物车信息
            if (!goodsInfo) { //如果购物车里面没有商品
                $("<div class='haveNoGoods'>您的购物车里面没有商品，快去逛逛吧！</div>").insertBefore(".sc-list>.sc-total-tool");
            } else {
                var goodsID = []; //获取购物车中所有商品的ID
                goodsInfo.forEach(function (item) { goodsID.push(item.gId) });
                var pro = new Promise(function (success) {
                    $.post("../php/seachGoods.php", { "goodsId": goodsID }, function (res) {
                        success(res);
                    });
                });
                pro.then(function (res) {
                    var good = JSON.parse(res);
                    var str = "";
                    for (var i = 0; i < good.length; i++) {
                        str += `<div class="sc-pro">
                        <div class="sc-pro-list clearfix">
                            <label class="checkbox">
                                <input class="vam" readonly="readonly">
                            </label>
                            <div class="sc-pro-main clearfix">
                                <a href="product.html?type=phone#${good[i].gid}" class="p-img">
                                    <img src="../${good[i].gsrc}">
                                </a>
                                <ul>
                                    <li>${good[i].gname} ${good[i].gdescript}</li>
                                    <li class="p-price">￥ ${good[i].gprice}.00</li>
                                    <li>
                                        <div class="p-num">
                                            <input type="text" class="p-num-text" value="${goodsInfo[i].gNum}">
                                            <p class="p-num-btn">
                                                <button class="pro-add">+</button>
                                                <button class="pro-reduce">-</button>
                                            </p>
                                        </div>
                                    </li>
                                    <li class="p-price-total">￥ ${good[i].gprice * goodsInfo[i].gNum}.00</li>
                                    <li class="p-del">
                                        <button>删除</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
                    }
                    $(str).insertBefore(".sc-list>.sc-total-tool");
                }).then(function () {
                    //购物车增删改查等功能

                    //顶部和底部的全选按钮
                    var totalChoose = $(".sc-pro-title .checkbox>.vam,.sc-total-tool .checkbox>.vam");

                    //点击标题栏和结算栏的全选按钮
                    totalChoose.click(function () {
                        if ($(this).hasClass("checked")) {
                            $(".checkbox>.vam").removeClass("checked");
                            showTotalNumAndPrice();
                        }
                        else {
                            $(".checkbox>.vam").addClass("checked");
                            showTotalNumAndPrice();
                        }
                    });

                    //点击商品栏的选中按钮
                    $(".sc-pro .checkbox>.vam").click(function () {
                        if ($(this).hasClass("checked")) { //如果已经是选中状态
                            $(this).removeClass("checked");
                            totalChoose.removeClass("checked");
                        } else {
                            $(this).addClass("checked");
                            var isAllChoose = true;
                            $(".sc-pro .checkbox>.vam").each(function () {
                                if (!$(this).hasClass("checked")) { //如果有一个没被选中
                                    isAllChoose = false;
                                    return false;
                                }
                            });
                            if (isAllChoose) {
                                totalChoose.addClass("checked");
                            };
                        }
                        showTotalNumAndPrice();
                    });

                    //删除商品功能
                    //点击商品栏的删除
                    $(".sc-pro .p-del>button").click(function () {
                        var cofDel = confirm("您确认要删除此商品吗？");
                        if (cofDel) {
                            delThisGood($(this));
                            showTotalNumAndPrice();
                            $(".s-main>ul>li>a.shopCart").html("购物车(" + sc.getTotalNum(uName) + ")");
                        }
                    });

                    //点击底部结算栏的删除
                    var botDel = $(".sc-total-tool>.sc-total-control>button");
                    botDel.click(function () {
                        //看看是否有商品被选中
                        var checks = $(".sc-pro .checkbox>.vam"); //商品选择框
                        var hasChoose = false; //假设没有产品被选中
                        checks.each(function () {
                            if ($(this).hasClass("checked")) { //如果有被选中的
                                hasChoose = true;
                                return false;
                            }
                        });
                        if (!hasChoose) {//如果一个都没有选
                            alert("请选择您要删除的商品！");
                        } else {
                            var cofDel = confirm("确认要删除勾选的商品吗？");
                            if (cofDel) {
                                checks.each(function () {
                                    if ($(this).hasClass("checked")) { //如果有被选中的
                                        var obj = $(this).parent().parent().find("li.p-del>button");
                                        delThisGood(obj);
                                    }
                                });
                                showTotalNumAndPrice();
                                $(".s-main>ul>li>a.shopCart").html("购物车(" + sc.getTotalNum(uName) + ")");
                            }
                        }
                    });

                    //增加或减少商品数量
                    //增加
                    var addGoodNum = $(".p-num>.p-num-btn>.pro-add");
                    addGoodNum.click(function () {
                        //显示数量加1
                        var proMain = $(this).parent().parent().parent().parent().parent();
                        var num = +proMain.find(".p-num-text").val();
                        proMain.find(".p-num-text").val(++num);
                        //找到商品id
                        var id = +proMain.find(".p-img").attr("href").split("#")[1];
                        var uName = localStorage.getItem("HWuName");
                        //缓存中数量加1
                        sc.addNum(id, uName);
                        //这条商品的总价变更
                        var price = parseInt(proMain.find(".p-price").html().substr(1));
                        proMain.find(".p-price-total").html("￥ " + price * num + ".00");
                        showTotalNumAndPrice();
                        $(".s-main>ul>li>a.shopCart").html("购物车(" + sc.getTotalNum(uName) + ")");
                    });

                    //减少
                    var reduceGoodNum = $(".p-num>.p-num-btn>.pro-reduce");
                    reduceGoodNum.click(function () {
                        var proMain = $(this).parent().parent().parent().parent().parent();
                        var num = +proMain.find(".p-num-text").val();
                        if (num > 1) { //商品数量大于1才能减
                            proMain.find(".p-num-text").val(--num);
                            //找到商品id
                            var id = +proMain.find(".p-img").attr("href").split("#")[1];
                            var uName = localStorage.getItem("HWuName");
                            //缓存中数量加1
                            sc.reduceNum(id, uName);
                            //这条商品的总价变更
                            var price = parseInt(proMain.find(".p-price").html().substr(1));
                            proMain.find(".p-price-total").html("￥ " + price * num + ".00");
                            showTotalNumAndPrice();
                            $(".s-main>ul>li>a.shopCart").html("购物车(" + sc.getTotalNum(uName) + ")");
                        }
                    });

                    //手动修改输入框数量
                    var everyGoodNum = $(".p-num>.p-num-text");
                    everyGoodNum.change(function () {
                        var proMain = $(this).parent().parent().parent().parent();
                        //找到商品id
                        var id = +proMain.find(".p-img").attr("href").split("#")[1];
                        var uName = localStorage.getItem("HWuName");
                        var num = parseInt(+$(this).val());
                        //判断数据是否合法
                        if (num && num >= 1) { //如果修改后的数据合法
                            //更新缓存中的商品数量
                            sc.updateNum(num, id, uName);
                            //这条商品的总价变更
                            var price = parseInt(proMain.find(".p-price").html().substr(1));
                            proMain.find(".p-price-total").html("￥ " + price * num + ".00");
                            showTotalNumAndPrice();
                            $(".s-main>ul>li>a.shopCart").html("购物车(" + sc.getTotalNum(uName) + ")");
                        } else { //如果数据不合法
                            alert("数量输入有误，请重新输入，谢谢！");
                            //商品数量改为修改前的数量
                            $(this).val(sc.getGoodNum(id, uName));
                        }
                    });

                });
            };
        };
    });

    //删除某商品 (参数为删除按钮的jquery对象)
    function delThisGood(obj) {
        //删除缓存中此商品的数据
        var id = +obj.parent().parent().prev().attr("href").split("#")[1];
        var uName = localStorage.getItem("HWuName");
        sc.delGood(id, uName);
        //删除页面中的这条商品
        obj.parent().parent().parent().parent().parent().remove();
    }

    //显示所有选中的商品的总金额和数量
    function showTotalNumAndPrice() {
        var TolNum = 0;
        var TolPrice = 0;
        $(".sc-list .checkbox>.checked").parent().next().find(".p-num>.p-num-text").each(function () {
            TolNum += +$(this).val();
        });
        $(".sc-list .checkbox>.checked").parent().next().find("ul>li.p-price-total").each(function () {
            TolPrice += parseInt($(this).html().substr(1));
        });
        $(".sc-total-tool .total-choose>em").html(TolNum);
        $(".sc-total-tool .sc-total-price>p>span").html("￥ " + TolPrice + ".00");
    };
});