var siteMap = new Vue({
    el: '#siteMap',
    data: {
        titleList: [],
    },
    methods: {
        getTitle: function () {
            var that = this;
            axios({
                url: '/queryAllBlog',
                method: 'get',
            }).then(function (resp) {
                that.titleList = resp.data.data;
            }).catch(function (resp) {
                console.log(resp);
            })
        }
    },
    created : function () {
        this.getTitle();
    }
})