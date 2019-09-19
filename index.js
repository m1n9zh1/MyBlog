const express = require('express');
const globalConfig = require('./config');
const loader = require('./loader');
const cookie = require('cookie-parser');
const app = new express();
app.use(express.static('./' + globalConfig.page_path)); //请求静态文件
app.use(cookie());

app.post('/editBlog', loader.get('/editBlog'));
app.get('/queryBlogList', loader.get('/queryBlogList'));
app.get('/queryBlogCount', loader.get('/queryBlogCount'));
app.get('/queryTags', loader.get('/queryTags'));
app.get('/queryBlogByTag', loader.get('/queryBlogByTag'));
app.get('/queryBlogById', loader.get('/queryBlogById'));
app.get('/updateBlogViews', loader.get('/updateBlogViews'));
app.get('/insertComment', loader.get('/insertComment'));
app.get('/queryCommentByBlogId', loader.get('/queryCommentByBlogId'));
app.get('/queryRandomCode', loader.get('/queryRandomCode'));
app.get('/queryAllBlog', loader.get('/queryAllBlog'));
app.get('/queryBlogByViews', loader.get('/queryBlogByViews'));
app.get('/queryCommentByTime', loader.get('/queryCommentByTime'));
app.get('/queryBlogByKey', loader.get('/queryBlogByKey'));




app.listen(globalConfig.port, function () {

}); //监听端口
