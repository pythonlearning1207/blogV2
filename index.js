import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

// main page index.ejs
app.get('/', (req, res) => {
    // 读取已创建的文件列表
    fs.readdir('./views/pages', (err, files) => {
        if (err) throw err;
        // 渲染主页，并将文件列表传递给视图
        res.render('index', { files: files });
    });
});
// 表单提交路由
app.post('/submit', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    // 创建 EJS 文件并写入内容
    fs.writeFile(`./views/pages/${title}.ejs`, content, (err) => {
        if (err) throw err;
        console.log('File created successfully!');
        res.redirect('/');
    });
});

//server
app.listen(port, (req, res)=> {
    console.log(`Server is listening on port ${port}`);
})