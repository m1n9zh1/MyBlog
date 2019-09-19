
var blogDetails = new Vue({
    el: '#blog_content',
    data: {
        curNum: 1,
        commentSize: 5,
        commentCount: 0,
        commentNum: 0,
        parent: -1,
        article : [],
        commentList: [],
        randomCode: [],
        container: [],
        pageArr: [],
        emailFormat: true,
        flag: false,
        submit: '提交评论中···',
        identify: '',
        hasCookie: false,
        author: '',
        info: {
            username: '',
            email: '',
        },
    },
    computed: {
        getComment : function () {
            return function (blogId, current, size) {
                var that = this;
                axios({
                    url: '/queryCommentByBlogId?blogId=' + blogId + '&current=' + (current - 1) + '&size=' + size,
                    method: 'get',
                }).then(function (resp) {
                    var data = resp.data.data
                    var len = data.length;
                    that.commentCount = len;
                    var parentComment = [];
                    var childrenComment = [];
                    for (var i = 0; i < len; i++) {
                        if (data[i].parent == -1) {
                            parentComment.push(data[i]);
                        } else {
                            childrenComment.push(data[i]);
                        }
                    }
                    for (var j = 0; j < parentComment.length; j++) {

                        for (var x = 0; x < childrenComment.length; x++) {

                            if (childrenComment[x].parent == parentComment[j].id) {
                                if (parentComment[j].children) {
                                    childrenComment[x].parentName = parentComment[j].user_name;
                                    parentComment[j].children.push(childrenComment[x]);
                                    childrenComment.splice(x, 1);
                                } else {
                                    parentComment[j].children = [];
                                    childrenComment[x].parentName = parentComment[j].user_name;
                                    parentComment[j].children.push(childrenComment[x]);
                                    childrenComment.splice(x, 1);
                                }
                            }

                        }

                    }
                    if (childrenComment.length > 0) {
                        var cLen = childrenComment.length;
                        var pLen = parentComment.length;
                        childrenComment.reverse();
                        for (var y = 0; y < cLen; y++) {
                            for (var z = 0; z < pLen; z++) {
                                if (parentComment[z].children == null) {
                                    continue;
                                }
                                var len = parentComment[z].children.length;
                                for (var a = 0; a < len; a++) {
                                    if (childrenComment[y].parent == parentComment[z].children[a].id) {
                                        childrenComment[y].parentName = parentComment[z].children[a].user_name;
                                        parentComment[z].children.push(childrenComment[y]);
                                    }
                                }
                            }
                        }
                    }
                    that.submit = '提交成功';
                    that.commentNum = parseInt(parentComment.length);
                    that.renderCommentList(that.curNum, that.commentSize, parentComment);
                    that.getTurnPage();
                }).catch(function (resp) {
                    console.log(resp);
                })
            }
        }

    },
    methods: {
        getBlogId : function () {
            var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1] : '';
            if (searchUrlParams == '') {
                return;
            }
            var params = searchUrlParams.indexOf('&') > -1 ? searchUrlParams.split('&') : searchUrlParams;
            var bid = -1;
            if (typeof (params) == 'string') {
                if (params.split('=')[0] == 'bid') {
                    try{
                        bid = parseInt(params.split('=')[1]);
                    }catch (e) {
                        console.log(e);
                    }

                }
            }else {
                for (var i = 0; i < params.length; i ++) {
                    if (params[i].split('=')[0] == 'bid') {
                        try{
                            bid = parseInt(params[i].split('=')[1]);
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            return bid;
        },
        getBlogDetails : function () {
            var that = this;
            var bid = this.getBlogId();
            axios({
                url: '/queryBlogById?bid=' + bid,
                method: 'get',
            }).then(function (resp) {
                that.article = resp.data.data;
            }).catch(function (resp) {
                console.log(resp);
                location.href = '../error.html';
            })
        },
        checkEmail : function () {
            var email = document.getElementsByClassName('email')[0].value;
            var emailFormat = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            var flag = emailFormat.test(email);
            if (flag || email == '') {
                this.emailFormat = true;
            }else {
                this.emailFormat = false;
            }
        },
        addComment: function () {
            var that = this;
            var parent = this.parent;
            if (this.info.username == '' && this.info.email == '') {
                var username = document.getElementsByClassName('nickname')[0].value;
                var email = document.getElementsByClassName('email')[0].value;
            }else {
                var username = this.info.username;
                var email = this.info.email;
            }

            var content = document.getElementsByClassName('edit-content')[0].value;
            var identify = document.getElementsByClassName('identify')[0].value.toLowerCase();
            var bid = this.getBlogId();
            if(username == '' || email == '') {
                alert('昵称或邮箱还没填呢~');
                return;
            }
            if (content === '') {
                alert('评论内容不能为空哦~');
                return;
            };
            if (identify !== this.randomCode.text.toLowerCase()) {
                this.identify = '验证码错误';
                setTimeout(function () {
                    that.identify = '';
                },1500);
                return;
            };
            this.flag = true;
            this.submit = '提交评论中···'
            axios({
                url: '/insertComment?blogId=' + bid + '&parent=' + parent + '&username=' + username + '&email=' + email + '&content=' + content,
                method: 'get'
            }).then(function (resp) {
                that.getComment(bid, that.curNum, that.commentSize);
                content = '';
                setTimeout(function () {
                    that.flag = false;
                    location.href = '#comment';
                },1000);
            }).catch(function (resp) {
                console.log(resp);
            })

        },
        getComment : function (blogId, current, size) {
            var that = this;
            axios({
                url: '/queryCommentByBlogId?blogId=' + blogId + '&current=' + (current - 1) + '&size=' + size,
                method: 'get',
            }).then(function (resp) {
                var data = resp.data.data
                var len = data.length;
                that.commentCount = len;
                var parentComment = [];
                var childrenComment = [];
                for (var i = 0; i < len; i++) {
                    if (data[i].parent == -1) {
                        parentComment.push(data[i]);
                    } else {
                        childrenComment.push(data[i]);
                    }
                }
                for (var j = 0; j < parentComment.length; j++) {

                    for (var x = 0; x < childrenComment.length; x++) {

                        if (childrenComment[x].parent == parentComment[j].id) {
                            if (parentComment[j].children) {
                                childrenComment[x].parentName = parentComment[j].user_name;
                                parentComment[j].children.push(childrenComment[x]);
                                childrenComment.splice(x, 1);
                            } else {
                                parentComment[j].children = [];
                                childrenComment[x].parentName = parentComment[j].user_name;
                                parentComment[j].children.push(childrenComment[x]);
                                childrenComment.splice(x, 1);
                            }
                        }

                    }

                }
                if (childrenComment.length > 0) {
                    var cLen = childrenComment.length;
                    var pLen = parentComment.length;
                    childrenComment.reverse();
                    for (var y = 0; y < cLen; y++) {
                        for (var z = 0; z < pLen; z++) {
                            if (parentComment[z].children == null) {
                                continue;
                            }
                            var len = parentComment[z].children.length;
                            for (var a = 0; a < len; a++) {
                                if (childrenComment[y].parent == parentComment[z].children[a].id) {
                                    childrenComment[y].parentName = parentComment[z].children[a].user_name;
                                    parentComment[z].children.push(childrenComment[y]);
                                }
                            }
                        }
                    }
                }
                that.submit = '提交成功';
                that.commentNum = parseInt(parentComment.length);
                that.getTurnPage();
                that.renderCommentList(that.curNum, that.commentSize, parentComment);
            }).catch(function (resp) {
                console.log(resp);
            })
        },
        renderCommentList : function (page, pageSize, result) {
            var count = result.length;
            var positionStart = (page - 1) * pageSize;
            var positionEnd = page * pageSize;
            if (positionEnd > count) {
                positionEnd = count;
            }
            this.container = result;
            var data = result.slice(positionStart, positionEnd);
            this.commentList  = data;
        },
        prevComment : function () {
            this.curNum = this.curNum - 1;
            this.renderCommentList(this.curNum, this.commentSize, this.container)
        },
        nextComment : function () {
            this.curNum = this.curNum + 1;
            this.renderCommentList(this.curNum, this.commentSize, this.container)

        },
        jumpComment : function (page) {
            this.curNum = page;
            this.renderCommentList(this.curNum, this.commentSize, this.container)
        },
        getTurnPage : function () {
            var curPage = this.curNum;
            var countBlog = this.commentNum;
            var pageSize = this.commentSize;
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
        setParent: function (parent) {
            this.parent = parent;
        },
        getRandomCode : function () {
            var that = this;
            axios({
                url: '/queryRandomCode',
                method: 'get',
            }).then(function (resp) {
                that.randomCode = resp.data.data;
            }).catch(function (resp) {
                console.log(resp)
            })
        },
        setViews : function (blogId) {
            axios({
                url: '/updateBlogViews?blogId=' + blogId,
                method: 'get'
            }).then(function (resp) {
            }).catch(function (resp) {
                console.log(resp);
            })
        },
        getCookies: function () {
            if (document.cookie) {
                var temp = document.cookie.split(';');
                var len = temp.length;
                var cookies = {};
                for (var i = 0; i < len; i ++) {
                    var data = temp[i].trim().split('=')[0]
                    if (data == 'comment_author' || data == 'comment_author_email') {
                        cookies[data] = temp[i].trim().split('=')[1];
                    }
                }
                if (cookies.comment_author && cookies.comment_author_email) {
                    this.info.username = decodeURIComponent(cookies.comment_author);
                    this.info.email = cookies.comment_author_email;
                    this.author = decodeURIComponent(cookies.comment_author);
                    this.hasCookie = true;
                }
            }else {
                this.info.username = '';
                this.info.email = '';
            }
        }
    },
    created: function () {
        var bid = this.getBlogId();
        this.getCookies();
        this.setViews(bid);
        this.getBlogDetails(bid);
        this.getComment(bid, this.curNum, this.commentSize);
        this.getRandomCode();
        this.getCookies();
    }
})