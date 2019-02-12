<?php
    header("content-type:text/html;charset=utf-8");
    $ids = $_POST["goodsId"]; //数组

    // print_r($id);

    $db = mysqli_connect("localhost","root","");

    mysqli_select_db($db,"huaweimail");

    mysqli_query($db,"set names utf8");

    foreach($ids as $id){
        $sql = "select * from `goodsinfo` where gid=$id";
        $row = mysqli_query($db,$sql);
        $arr[] = mysqli_fetch_array($row);
    }

    $str = json_encode($arr);
    echo $str;
    
?>