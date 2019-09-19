var randomTags = new Vue({
    el: '#random_tags',
    data: {
        tagList: []
    },
    computed: {
        randomColor : function () {
            return function (){
                var red = Math.random() * 205 + 50;
                var green = Math.random() * 205 + 50;
                var blue = Math.random() * 205 + 50;
                return 'rgb(' + red + ',' + green + ',' + blue + ')';
            }

        },
        randomSize : function () {
            return function (){
                var size = Math.random() * 15 + 10;
                return size + 'px';
            }

        }
    },
    methods: {
        getTags: function () {
            var that = this;
            axios({
                url: '/queryTags',
                method: 'get',
            }).then(function (resp) {
                var data = resp.data.data.sort(function(a,b) {
                    return Math.random() * -1 + 0.5;
                })
                that.tagList = data;
            }).catch(function (resp) {
                console.log('查询标签发生错误',resp)
            })
        },
        renderBlogTagsList : function (page, pageSize, result) {
            var count = result.length
            var positionStart = (page - 1) * pageSize;
            var positionEnd = page * pageSize;
            if (positionEnd > count) {
                positionEnd = count;
            }
            var data = result.slice(positionStart, positionEnd);
            return data;
        }
    },
    created: function () {
        this.getTags();
    }
});


var recentlyHot = new Vue({
    el: '#recently_hot',
    data: {
        article: [
            {
                title: '建档立卡几份',
                id: '3'
            },
            {
                title: '建档立卡几份',
                id: '2'
            },
            {
                title: '建档立卡几份',
                id: '1'
            }
        ]
    },
    methods: {
        getBlogByViews : function () {
            var that = this;
            axios({
                url: '/queryBlogByViews',
                method: 'get',
            }).then(function (resp) {
                that.article = resp.data.data;
            }).catch(function (resp) {
                console.log(resp);
            })
        }
    },
    created : function () {
        this.getBlogByViews();
    }
})

var recentlyComments = new Vue({
    el: '#recently_comments',
    data: {
        commentList: [
            {
                username: '收快递',
                time: '23小时前',
                comment: '乐山大佛拉三等奖打卡机'
            },
            {
                username: '收快递',
                time: '23小时前',
                comment: '乐山大佛拉三等奖打卡机'
            },
            {
                username: '收快递',
                time: '23小时前',
                comment: '乐山大佛拉三等奖打卡机'
            },
            {
                username: '收快递',
                time: '23小时前',
                comment: '乐山大佛拉三等奖打卡机'
            },
            {
                username: '收快递',
                time: '23小时前',
                comment: '乐山大佛拉三等奖打卡机'
            },
        ]
    },
    methods: {
        getCommentByTime: function () {
            var that = this;
            axios({
                url: '/queryCommentByTime',
                method: 'get',
            }).then(function (resp) {
                var date = Date.now() / 1000;
                var len = resp.data.data.length;
                for (var i = 0; i < len; i ++) {
                    var time = date - resp.data.data[i].ctime;
                    if (time < 60) {
                        resp.data.data[i].time = time + '秒前';
                    }else if (time >= 60 && time < 60 * 60) {
                        resp.data.data[i].time = Math.ceil(time / 60) + '分前';
                    }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                        resp.data.data[i].time = Math.ceil(time / 3600) + '时前';
                    }else if (time >= 60 * 60 * 24 && time < 60 * 60 * 24 * 7) {
                        resp.data.data[i].time = Math.ceil(time / (3600 * 24)) + '天前';
                    }else if (time >= 3600 * 24 * 7 && time < 3600 * 24 * 30) {
                        resp.data.data[i].time = Math.ceil(time / (3600 * 24 * 7)) + '周前';
                    }else if (time >= 3600 * 24 * 30 && time < 3600 * 24 * 30 * 12) {
                        resp.data.data[i].time = Math.ceil(time / (3600 * 24 * 30)) + '月前';
                    }else {
                        resp.data.data[i].time = Math.ceil(time / (3600 * 24 * 30 * 12)) + '年前';
                    }
                }


                that.commentList = resp.data.data;
            }).catch(function (resp) {
                console.log(resp);
            })
        }
    },
    created : function () {
        this.getCommentByTime();
    }
})