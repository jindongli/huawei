<?php
    header("content-type:text/html;charset=utf-8");
    $name = $_POST["name"];

    $db = mysqli_connect("localhost","root","");

    mysqli_select_db($db,"huaweimail");

    mysqli_query($db,"set names utf8");

    $sql = "select * from userinfo where uname='$name'";

    $result = mysqli_query($db,$sql);

    $row = mysqli_fetch_array($result);

    if($row){
        echo 0;//用户名存在，需要更换用户名
    }else{
        echo 1;//用户名不存在,可以注册
    }
?>