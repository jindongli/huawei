define(function () {
    return {
        smallImg: null, //小图片
        smallArea: null, //放大镜
        bigImg: null, //大图片
        bigArea: null, //大图片显示区域
        proItems: null,  // 图片导航区
        proPrev: null, //向前
        proNext: null, //向后
        pec: 1, //放大系数

        init: function (obj) {
            this.smallImg = obj.smallImg;
            this.smallArea = obj.smallArea;
            this.bigArea = obj.bigArea;
            this.bigImg = obj.bigImg;
            this.proItems = obj.proItems;
            this.proPrev = obj.proPrev;
            this.proNext = obj.proNext;
            this.pec = this.bigArea.width() / this.smallArea.width();
            this.enlarge();
            return this;
        },

        //放大镜功能
        enlarge: function () {
            var that = this;
            this.smallImg.on({
                "mouseenter": function (e) {
                    var maxL = that.smallImg.width() - that.smallArea.width();
                    var maxT = that.smallImg.height() - that.smallArea.height();
                    var l = e.offsetX - that.smallArea.width() / 2;
                    var t = e.offsetY - that.smallArea.height() / 2;
                    l = l < 0 ? 0 : (l > maxL ? maxL : l);
                    t = t < 0 ? 0 : (t > maxT ? maxT : t);
                    that.smallArea.show().css({
                        left: l,
                        top: t
                    });
                    that.bigArea.show();
                    that.bigImg.css({
                        left: -l * that.pec,
                        top: -t * that.pec
                    });
                },

                "mousemove": function (e) {
                    var maxL = that.smallImg.width() - that.smallArea.width();
                    var maxT = that.smallImg.height() - that.smallArea.height();
                    var l = e.pageX - that.smallImg.offset().left - that.smallArea.width() / 2;
                    var t = e.pageY - that.smallImg.offset().top - that.smallArea.height() / 2;
                    l = l < 0 ? 0 : (l > maxL ? maxL : l);
                    t = t < 0 ? 0 : (t > maxT ? maxT : t);
                    that.smallArea.show().css({
                        left: l,
                        top: t
                    });
                    that.bigImg.css({
                        left: -l * that.pec,
                        top: -t * that.pec
                    });
                },

                "mouseleave": function () {
                    that.bigArea.hide();
                    that.smallArea.hide();
                }
            });
        },

        //下方图片导航功能
        navMove: function () {
            var that = this;
            //鼠标划入小图(需要用事件委托)
            this.proItems.on("mouseenter", "li", function () {
                var str = $(this).find("img").attr("src").split("78_78").join("800_800");
                $(this).addClass("current").siblings().removeClass("current");
                that.smallImg.find("img").attr("src", str);
                that.bigImg.attr("src", str);
            });
            return this;
        },

        //向左功能
        toPrev: function () {
            var that = this;
            this.proPrev.click(function () {
                var liWid = that.proItems.find("li").outerWidth();
                var l = that.proItems.position().left;
                if (l >= 0) return;
                that.proItems.stop().animate({ "left": l + liWid }, 200);
            });
            return this;
        },

        //向右
        toNext: function () {
            var that = this;
            this.proNext.click(function () {
                var liWid = that.proItems.find("li").outerWidth();
                var num = that.proItems.find("li").size();
                var l = that.proItems.position().left;
                if (l <= that.proItems.parent().width() - liWid * num) return;
                that.proItems.stop().animate({ left: l - liWid }, 200);
            });
            return this;
        }
    };
});