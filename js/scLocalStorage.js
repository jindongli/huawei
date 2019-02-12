define(function () {
    //localstorage相关功能模块
    return {
        //获取购物车商品信息(返回数组)
        getGoodsInfo: function (uName) {
            return JSON.parse(localStorage.getItem(uName + "scInfo"));
        },

        //获取商品总数量,存储方式为 uName + "scInfo"
        getTotalNum: function (uName) {
            var scInfo = this.getGoodsInfo(uName);
            if (!scInfo) return 0;
            var sum = 0;
            scInfo.forEach(function (item) { sum += item.gNum });
            return sum;
        },

        //新增商品(加入购物车)
        addGoodsToSC: function (uName, obj) {
            var scInfo = JSON.parse(localStorage.getItem(uName + "scInfo"));
            if (!scInfo) { //如果客户购物车里面没有任何商品
                localStorage.setItem(uName + "scInfo", JSON.stringify([obj]));
            } else {
                var hasGood = false; //购物车里面没有买过同一款商品
                for (var i = 0; i < scInfo.length; i++) {
                    if (obj.gId == scInfo[i].gId) {
                        scInfo[i].gNum += obj.gNum;
                        hasGood = true; break;
                    };
                };
                if (!hasGood) { //没有买过此商品
                    scInfo.push(obj);
                }
                localStorage.setItem(uName + "scInfo", JSON.stringify(scInfo));
            }
            return this;
        },

        //根据ID删除某个商品
        delGood: function (id, uName) {
            var scInfo = this.getGoodsInfo(uName);
            for (var i = 0; i < scInfo.length; i++) {
                if (id == scInfo[i].gId) {
                    scInfo.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem(uName + "scInfo", JSON.stringify(scInfo));
        },

        //商品数量加一
        addNum: function (id, uName) {
            var scInfo = this.getGoodsInfo(uName);
            for (var i = 0; i < scInfo.length; i++) {
                if (id == scInfo[i].gId) {
                    scInfo[i].gNum++;
                    break;
                }
            }
            localStorage.setItem(uName + "scInfo", JSON.stringify(scInfo));
        },

        //商品数量减一
        reduceNum: function (id, uName) {
            var scInfo = this.getGoodsInfo(uName);
            for (var i = 0; i < scInfo.length; i++) {
                if (id == scInfo[i].gId) {
                    scInfo[i].gNum--;
                    break;
                }
            }
            localStorage.setItem(uName + "scInfo", JSON.stringify(scInfo));
        },

        //修改某个商品数量
        updateNum: function (num, id, uName) {
            var scInfo = this.getGoodsInfo(uName);
            for (var i = 0; i < scInfo.length; i++) {
                if (id == scInfo[i].gId) {
                    scInfo[i].gNum = num;
                    break;
                }
            }
            localStorage.setItem(uName + "scInfo", JSON.stringify(scInfo));
        },

        //获取某个商品的数量
        getGoodNum: function (id, uName) {
            var scInfo = this.getGoodsInfo(uName);
            for (var i = 0; i < scInfo.length; i++) {
                if (id == scInfo[i].gId) {
                    return scInfo[i].gNum;
                }
            }
            return 0;
        },

        //退出登录
        exitLog: function () {
            localStorage.removeItem("HWuName");
        }
    };
});