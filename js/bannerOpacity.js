//透明度轮播
define(function () {
    return {
        startMove: function (banImg, banNav, cName) {
            //三个参数，第一个是要做透明度轮播的图片，第二个是下面的图标导航，第三是图标导航样式变化的css类名

            var banIndex = 0;
            var num = banImg.size();
            //定时器
            var banTimer = setInterval(showNext, 2000);

            function showNext() {
                banIndex = ++banIndex % num;
                showImg();
            };

            function showImg() {
                banImg.eq(banIndex).fadeIn(500).siblings().fadeOut(500);
                banNav.eq(banIndex).addClass(cName).siblings().removeClass(cName);
            };

            //鼠标移入移出(导航)
            banNav.hover(function () {
                clearInterval(banTimer);
                banIndex = $(this).index();
                showImg();
            }, function () {
                banTimer = setInterval(showNext, 2000);
            });

            //鼠标移入移出(图片)
            banImg.hover(function () {
                clearInterval(banTimer);
            }, function () {
                banTimer = setInterval(showNext, 2000);
            });

        }
    }
});

