
var searchBox = new Vue({
    el: '#search-box',
    data: {
        curPage: 1,
        pageSize: 5,
    },
    methods: {
        search: function () {
            var that = this;
            var key = document.getElementById('search').value;
            axios({
                url: '/queryBlogByKey?key=' + key,
                method: 'get',
            }).then(function (resp) {
                console.log(resp)
                blogList.renderBlogList(that.curPage, that.pageSize, resp.data.data)
                blogList.count = resp.data.data.length;
                blogList.getTurnPage();
                blogList.container = resp.data.data;
            }).catch(function (resp) {
                console.log(resp)
            })
        }
    }
})


var blogList = new Vue({
    el: '#blog_content',
    data: {
        curPage: 1,
        pageSize: 5,
        count: 100,
        // countPage : Math.ceil(this.count / pageSize),
        pageArr: [],
        blogList: [
            {
                title: '测试',
                content: '很多很多很多很多很多...',
                ctime: '2019-1-2',
                views: 1,
                tags: ['测试']
            }
        ],
        container: [],
    },
    methods: {
        getBlogList : function () {
            var that = this;
            axios({
                method: 'get',
                // url: '/queryBlogList?page=' + (page - 1) + '&pageSize=' + pageSize,
                url: '/queryBlogList',
            }).then(function (response) {
                var container = response.data.data
                that.container = container;
                that.renderBlogList(that.curPage, that.pageSize, container)
            }).catch(function (response) {
                console.log(response);
            })
            this.getBlogCount();
        },
        getBlogCount : function () {
            var that = this;
            axios({
                method: 'get',
                url: '/queryBlogCount'
            }).then(function (resp) {
                that.count = resp.data.data[0].count;
                that.getTurnPage();
            }).catch(function (resp) {
                console.log(resp);
            })
        },
        getTurnPage : function () {
            var curPage = this.curPage;
            var countBlog = this.count;
            var pageSize = this.pageSize;
            var countPage = Math.ceil(countBlog / pageSize);
            if (countPage <= 5) {
                var turnPageArr = [];
                for (var i = 0; i < countPage; i++) {
                    turnPageArr.push({text: i + 1, page: i + 1});
                }
                this.pageArr = turnPageArr;
            } else {
                var turnPageArr = [];
                if (curPage <= 3) {
                    turnPageArr = [
                        {
                            text: 1,
                            page: 1
                        },
                        {
                            text: 2,
                            page: 2
                        },
                        {
                            text: 3,
                            page: 3
                        },
                        {
                            text: '···',
                            page: countPage - 2
                        },
                        {
                            text: countPage,
                            page: countPage
                        }];
                }else if (curPage >= countPage - 2) {
                    turnPageArr = [
                        {
                            text: 1,
                            page: 1
                        },
                        {
                            text: '···',
                            page: Math.ceil((countPage - 2) / 2)
                        },
                        {
                            text: countPage - 2,
                            page: countPage - 2
                        },
                        {
                            text: countPage - 1,
                            page: countPage - 1
                        },
                        {
                            text: countPage,
                            page: countPage
                        }];
                }else {
                    turnPageArr = [
                        {
                            text: 1,
                            page: 1
                        },
                        {
                            text: '···',
                            page: Math.ceil(curPage / 2)
                        },
                        {
                            text: curPage - 1,
                            page: curPage - 1
                        },
                        {
                            text: curPage,
                            page: curPage
                        },
                        {
                            text: curPage + 1,
                            page: curPage + 1
                        },
                        {
                            text: '···',
                            page: Math.ceil((countPage + curPage) / 2)
                        },
                        {
                            text: countPage,
                            page: countPage
                        }];
                }
                this.pageArr = turnPageArr;
            };
        },
        prevPage : function () {
            this.curPage = this.curPage - 1;
            this.renderBlogList(this.curPage, this.pageSize, this.container)
        },
        nextPage : function () {
            this.curPage = this.curPage + 1;
            this.renderBlogList(this.curPage, this.pageSize, this.container)

        },
        jumpPage : function (page) {
            this.curPage = page;
            this.renderBlogList(this.curPage, this.pageSize, this.container)
        },
        queryBlogByTag : function (tag) {
            var that = this;
            this.curPage = 1;
            axios({
                url: '/queryBlogByTag?tag=' + tag,
                method: 'get',
            }).then(function (resp) {

                that.renderBlogList(that.curPage, that.pageSize, resp.data.data)
                that.count = resp.data.data.length;
                that.getTurnPage();
                that.container = resp.data.data;
            }).catch(function (resp) {
                console.log('通过标签查询文章列表发生错误', resp);
            })
        },
        renderBlogList : function (page, pageSize, result) {
            var count = result.length
            var positionStart = (page - 1) * pageSize;
            var positionEnd = page * pageSize;
            if (positionEnd > count) {
                positionEnd = count;
            }
            var data = result.slice(positionStart, positionEnd);
            this.blogList = data;
        },
        getTag : function () {
            var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1] : '';
            if (searchUrlParams == '') {
                return;
            }
            var params = searchUrlParams.indexOf('&') > -1 ? searchUrlParams.split('&') : searchUrlParams;
            var tag = '';
            if (typeof (params) == 'string') {
                if (params.split('=')[0] == 'tag') {
                    try{
                        tag = params.split('=')[1];
                    }catch (e) {
                        console.log(e);
                    }

                }
            }else {
                for (var i = 0; i < params.length; i ++) {
                    if (params[i].split('=')[0] == 'tag') {
                        try{
                            tag = params[i].split('=')[1];
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            return tag;
        },

    },
    created: function () {
        var tag = this.getTag();
        if (tag) {
            this.queryBlogByTag(tag)
        }else {
            this.getBlogList();
        }


    }
});


