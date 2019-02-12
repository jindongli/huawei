define(function () {
    return {
        //加载登录模块
        add: function (cssHref, phpSrc) { //传入css相对路径
            if (!$("body>#login").size()) { //如果页面没有加载过登录块
                //添加样式表到页面头部
                $("<link rel='stylesheet' href='" + cssHref + "'>").appendTo("head")
                $("<div id='filter'></div>").appendTo("body");//添加遮罩层到页面
                //添加登录块
                $(`<div id="login">
                    <div id="login-top">
                        <button class="login-close">X</button>
                    </div>
                    <h2>请输入用户名和密码</h2>
                    <form action="" method="POST">
                        <input type="text" name="userName" id="userName" placeholder="用户名">
                        <input type="password" name="userPsw" id="userPsw" placeholder="密码">
                        <input type="button" value="登录" id="userBtn">
                    </form>
                </div>`).appendTo("body"); //添加输入框到页面
            } else {
                $("#filter").show();//遮罩层显示
                //登录块显示
                $("#login").css({ left: "50%", top: "50%", marginLeft: -150, marginTop: -130 }).show();
            }


            var loginClose = $(".login-close");

            //点击关闭登录框
            loginClose.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $("#filter").hide();
                $("#login").hide();
            });

            //拖拽
            var loginTop = $("#login-top");
            loginTop.bind("mousedown", function (e) {
                e.preventDefault();
                $(this).parent().css({
                    left: loginTop.offset().left,
                    top: loginTop.parent().offset().top,
                    margin: 0
                });
                var x = e.offsetX;
                var y = e.offsetY;
                var that = this

                $(document).on({
                    "mousemove": function (e) {
                        var l = e.pageX - x;
                        var t = e.pageY - y;
                        var maxL = $(window).width() - $(that).parent().width();
                        var maxT = $(window).height() - $(that).parent().height();
                        l = l < 0 ? 0 : (l > maxL ? maxL : l);
                        t = t < 0 ? 0 : (t > maxT ? maxT : t);
                        $(that).parent().css({ left: l, top: t });
                    },
                    "mouseup": function () {
                        $(this).off();
                    }
                });
            });



            var uNameReg = /^(\w|[\u4e00-\u9fa5]){2,16}$/; //用户名要2个字符或以上（数字字母下划线或者中文字符）
            var uPwdReg = /^[a-zA-Z0-9]{6,16}$/; //密码需要6到16位
            //提交登录
            var userBtn = $("#userBtn");
            userBtn.click(function () {
                var userName = $("#userName").val();
                var userPsw = $("#userPsw").val();
                var checkInfo = $("#login>h2")

                //前端先判断用户名和密码格式
                if (!uNameReg.test(userName)) {//
                    checkInfo.css({ "color": "#840707", fontWeight: 600 }).html("用户名不正确,请重新输入!");
                } else if (!uPwdReg.test(userPsw)) {
                    checkInfo.css({ "color": "#840707", fontWeight: 600 }).html("密码不正确,请重新输入!");
                } else { //格式OK则发到服务端判断
                    $.post(phpSrc, { "userName": userName, "userPsw": userPsw }, function (res) {
                        if (res == "0") {//用户名不存在
                            checkInfo.css({ "color": "#840707", fontWeight: 600 }).html("用户名不存在,请重新输入!");
                        } else if (res == "2") {//密码错误
                            checkInfo.css({ "color": "#840707", fontWeight: 600 }).html("密码错误,请重新输入!");
                        } else {//登录成功
                            //将用户信息存储到本地
                            localStorage.setItem("HWuName", res);

                            //刷新页面
                            location.reload();
                            // loginClose.click();
                            // //XXX欢迎登陆
                            // $(".s-main>ul>li").eq(0).remove();
                            // $(".s-main>ul>li").eq(0).remove();
                            // $("<li><a href='#'>" + res + ",欢迎您！</a></li>").prependTo(".s-main>ul")
                        }
                    })
                }
            });
        },

        //如果已经登录了，页面进行初始化
        hasLoginInit: function (uName, sc) {
            $(".s-main>ul>li").eq(0).remove();
            $(".s-main>ul>li").eq(0).remove();
            $("<li><a href='#'>" + uName + ",欢迎您！</a></li><li><a href='#' class='exitLogin'>退出登录</a></li>").prependTo(".s-main>ul");
            $(".s-main>ul>li>a.shopCart").html("购物车(" + sc.getTotalNum(uName) + ")");
            $(".exitLogin").click(function () {//退出登录
                var cof = confirm("您确定要退出登录吗?");
                if (cof) {
                    sc.exitLog();
                    location.reload();
                }
            });
        }
    };
});

