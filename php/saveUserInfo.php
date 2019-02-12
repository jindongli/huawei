<?php
    header("content-type:text/html;charset=utf-8");
    $name = $_POST["name"];
    $pwd = $_POST["pwd"];
    $email = $_POST["email"];
    $brithday = $_POST["brithday"];

    // echo $name.$pwd.$email.$brithday;

    $db = mysqli_connect("localhost","root","");

    mysqli_select_db($db,"huaweimail");

    mysqli_query($db,"set names utf8");

    $sql = "INSERT INTO `userinfo`(`uname`, `upwd`, `uemail`, `ubrithday`) VALUES ('$name','$pwd','$email','$brithday')";
 
    $row = mysqli_query($db,$sql);

    echo $row;

?>