$(function () {

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
            $.post("../php/login.php", { "userName": userName, "userPsw": userPsw }, function (res) {
                if (res == "0") {//用户名不存在
                    checkInfo.css({ "color": "#840707", fontWeight: 600 }).html("用户名不存在,请重新输入!");
                } else if (res == "2") {//密码错误
                    checkInfo.css({ "color": "#840707", fontWeight: 600 }).html("密码错误,请重新输入!");
                } else {//登录成功
                    //将用户信息存储到本地
                    localStorage.setItem("HWuName", res);
                    //跳转到主页
                    location.href = "../index.html?uname=" + res;
                }
            })
        }

    });
});