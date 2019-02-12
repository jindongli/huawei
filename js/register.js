$(function () {

    /*用户名验证*/
    var uNameFlag = false;

    var uName = $("#uname");
    var info_user = $("#info_user");
    var error_user = $("#error_user");
    var succ_user = $("#succ_user");
    var uNameReg = /^(\w|[\u4e00-\u9fa5]){3,20}$/; //用户名正则
    //获取焦点，显示提示信息
    uName.focus(function () {
        info_user.show();
        error_user.hide();
        succ_user.hide();
    });
    //失去焦点，开始检测
    uName.blur(function () {
        if (uNameReg.test(uName.val())) { //输入OK
            info_user.hide();
            error_user.hide();
            succ_user.show();
            uNameFlag = true;
        } else {
            info_user.hide();
            error_user.show().css("color", "red");
            succ_user.hide();
            uNameFlag = false;
        }
    });

    /*密码验证*/
    var pwdFlag = false;

    var pwd = $("#pwd");
    var info_pass = $("#info_pass");
    var error_pass = $("#error_pass");
    var succ_pass = $("#succ_pass");
    var pwdReg = /^[a-zA-Z0-9]{6,20}$/; //密码正则
    pwd.on({
        "focus": function () {
            info_pass.show();
            error_pass.hide();
            succ_pass.hide();
        },
        "keyup": function () {
            var str = pwd.val();
            //密码长度判断
            if (6 <= str.length && str.length <= 20) {
                $("#q1").html("●");
            } else {
                $("#q1").html("○");
            }
            //是否含有空格
            if (/\s/.test(str) || str.length == 0) {
                $("#q2").html("○");
            } else {
                $("#q2").html("●");
            }
            //密码含字符种类
            var num = /\d/.test(str) + /[a-z]/.test(str) + /[A-Z]/.test(str);
            if (num >= 2) {
                $("#q3").html("●");
            } else {
                $("#q3").html("○");
            }

            //强度判断
            if (pwdReg.test(str)) {
                $("#s1").css("color", "#000");
                if (num == 2) {
                    $("#s2").css("color", "#000");
                    $("#s3").css("color", "#ccc");
                    info_pass.find(".s4").html("中").css("color", "#000");
                } else if (num == 3) {
                    $("#s2").css("color", "#000");
                    $("#s3").css("color", "#000");
                    info_pass.find(".s4").html("强").css("color", "#000");
                } else {
                    $("#s2").css("color", "#ccc");
                    $("#s3").css("color", "#ccc");
                    info_pass.find(".s4").html("弱").css("color", "#000");
                }
            }
        },
        "blur": function () {
            if (pwdReg.test(pwd.val())) {
                info_pass.hide();
                error_pass.hide();
                succ_pass.show();
                pwdFlag = true;
            } else {
                info_pass.hide();
                error_pass.show().css("color", "red");
                succ_pass.hide();
                pwdFlag = false;
            }
        }
    });

    /*密码确认*/
    var pwdAginFlag = false;

    var pswAgin = $("#pswAgin");
    var info_notpass = $("#info_notpass");
    var error_notpass = $("#error_notpass");
    var succ_notpass = $("#succ_notpass");
    pswAgin.on({
        "focus": function () {
            info_notpass.show();
            error_notpass.hide();
            succ_notpass.hide();
        },
        "blur": function () {
            if (pswAgin.val() == pwd.val() && pwdFlag) {
                info_notpass.hide();
                error_notpass.hide();
                succ_notpass.show();
                pwdAginFlag = true;
            } else {
                info_notpass.hide();
                error_notpass.show().css("color", "red");
                succ_notpass.hide();
                pwdAginFlag = false;
            }
        }
    });

    /*验证码*/
    var verFlag = false;

    var verification = $("#verification");
    var verifi_num = $("#verifi_num");
    verifi_num.html(getVeriCode(4)).css("backgroundColor", getRandColor());
    //点击更换验证码
    verifi_num.click(function () {
        verifi_num.html(getVeriCode(4)).css("backgroundColor", getRandColor());
    });
    verification.blur(function () {
        if (verification.val().toLowerCase() == verifi_num.html().toLowerCase()) verFlag = true;
        else verFlag = false;
    });

    /*电子邮件*/
    var emailFlag = false;

    var email = $("#email");
    var info_email = $("#info_email");
    var error_email = $("#error_email");
    var succ_email = $("#succ_email");
    var all_email = $("#all_email");
    var emailText = $("#all_email>li>.emailText")
    var emailReg = /^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/; //邮箱正则
    var index = -1;//当前邮箱下标
    email.on({
        "focus": function () {
            info_email.show();
            all_email.show();
            error_email.hide();
            succ_email.hide();
        },
        "keyup": function (e) {
            e.preventDefault();
            var str = email.val().split("@")[0];
            emailText.html(str);
            var code = e.keyCode || e.which || e.charCode;
            switch (code) {
                case 38: //向上
                    index--;
                    index = index < 0 ? emailText.size() - 1 : index;
                    emailText.eq(index).parent().css("backgroundColor", "#c1c1c1").siblings().css("backgroundColor", "#fff");
                    break;
                case 40: //向下
                    emailText.eq(index).parent().css("backgroundColor", "#c1c1c1").siblings().css("backgroundColor", "#fff");
                    index++;
                    index = index > emailText.size() - 1 ? 0 : index;
                    break;
                case 13: //回车
                    email.val(email.val().split("@")[0] + "@" + emailText.eq(index).parent().text().split("@")[1]);
                    all_email.hide();
                    email.blur();
                    break;
            }
        },
        "blur": function () {
            info_email.hide();
            setTimeout(function () {
                all_email.hide();
            }, 200);
            if (emailReg.test(email.val())) {
                error_email.hide();
                succ_email.show();
                emailFlag = true;
            } else {
                error_email.show();
                succ_email.hide().css("coloc", "red");
                emailFlag = false;
            }
        }
    });

    all_email.on("mouseenter", "li", function () {
        $(this).css("backgroundColor", "#c1c1c1").siblings().css("backgroundColor", "#fff");
    });
    all_email.on("click", "li", function () {
        email.val(email.val().split("@")[0] + "@" + $(this).text().split("@")[1]);
        all_email.hide();
        email.blur();
    });


    /*生日*/

    var year = $("#year");
    var month = $("#month");
    var day = $("#day");

    for (var i = 1970; i <= 2019; i++) {
        var option = new Option(i, i)
        year.append(option);
    }
    year.change(function () {
        month.get(0).options.length = 1;
        if (year.val() != "0") {
            for (var i = 1; i <= 12; i++) {
                var option = new Option(i, i)
                month.append(option);
            }
        }
    });

    month.change(function () {
        day.get(0).options.length = 1;
        if (month.val() != "0") {
            var y = 31; //先假设是31天
            switch (parseInt(month.val())) {
                case 2:
                    if ((year.val() % 4 == 0 && year.val() % 100 != 0) || year.val() % 400 == 0) {
                        y = 29; //闰年
                    } else y = 28; //平年
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    y = 30;
                    break;
            }
            for (var i = 1; i <= y; i++) {
                var option = new Option(i, i)
                day.append(option);
            }
        }
    });


    //点击注册
    var userBtn = $("#userBtn");
    userBtn.click(function () {
        var birthdayFlag = +year.val() && +month.val() && +day.val();
        if (!uNameFlag) {
            alert("用户名不正确,请更改,谢谢！");
        } else if (!pwdFlag) {
            alert("密码不正确,请更改,谢谢！");
        } else if (!pwdAginFlag) {
            alert("两次密码输入不一致,请检查,谢谢！");
        } else if (!verFlag) {
            alert("验证码不符合,请检查,谢谢！");
            verifi_num.click();
        } else if (!emailFlag) {
            alert("邮箱不正确,请检查,谢谢！");
        } else if (!birthdayFlag) {
            alert("请选择您的生日,谢谢！");
        } else {
            //输入正确，发后台验证用户名是否唯一
            var pro = new Promise(function (success, failed) {
                $.post("../php/onlyUser.php", { name: uName.val() }, function (res) {
                    if (res == 1) {
                        success();
                    } else {
                        alert("用户名已经存在,请更换用户名,谢谢！");
                    }
                })
            });
            pro.then(function () { //注册成功
                //保存用户信息
                $.post("../php/saveUserInfo.php", {
                    name: uName.val(),
                    pwd: pwd.val(),
                    email: email.val(),
                    brithday: year.val() + "年" + month.val() + "月" + day.val() + "日"
                }, function (res) {
                    if (res == "1") {
                        alert("恭喜您注册成功，请登录，谢谢！");
                        //跳转到登录页
                        location.href = "login.html";
                    } else {
                        alert("抱歉,注册失败，请重新注册，谢谢！");
                    }
                });
            });
        }

    });

});

//使用十六进制获取随机颜色
function getRandColor() {
    var str = "0123456789abcdef";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += str.charAt(parseInt(Math.random() * 16));
    }
    return color;
}

//获取n位数字验证码
function getVeriCode(n) {
    var str = ""
    for (var i = 0; i < n; i++) {
        var num = getRand(48, 122);
        if ((57 < num && num < 65) || (90 < num && num < 97)) {
            i--;
        } else {
            str += String.fromCharCode(num);
        }
    }
    return str;
}

//获取区间范围的随机数
function getRand(startNum, endNum) {
    return Math.floor(Math.random() * (endNum - startNum + 1) + startNum);
}