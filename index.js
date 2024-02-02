import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const __dirname = dirname(fileURLToPath(import.meta.url));
const linkName = __dirname + "/views/pages/";

// main page index.ejs
app.get('/', (req, res) => {
    // 读取已创建的文件列表
    fs.readdir('./views/pages', (err, files) => {
        if (err) throw err;
        // 渲染主页，并将文件列表传递给视图
        console.log(files);
        const filesWithoutExtension = files.map(file => file.replace('.ejs', ''));
        console.log(filesWithoutExtension);
        res.render('index', { files: filesWithoutExtension });
    });
});
app.get("/about", (req, res)=> {
    res.render("about.ejs");
})
app.get("/contact", (req, res)=> {
    res.render("contact.ejs");
})
app.get("/fullArticle", (req, res)=>{
    res.render("fullArticle.ejs");
})
// 表单提交路由
app.post('/submit', (req, res) => {
    const title = req.body.userTitle;
    const content = req.body.userText;

    // 创建 EJS 文件并写入内容
    fs.writeFile(`./views/pages/${title}.ejs`, content, (err) => {
        if (err) throw err;
        console.log('File created successfully!');
        res.redirect('/');
    });
});
// 动态路由，渲染单个页面
app.get('/:title', (req, res) => {
    const title = req.params.title;
    const filePath = path.join(__dirname, '/views/pages', `${title}.ejs`);

    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }
        // 渲染 EJS 文件
        res.render(`pages/${title}`);
    });
});

// 删除页面路由
app.post('/delete/:title', (req, res) => {
    const title = req.params.title;
    const filePath = path.join(__dirname, `./views/pages/${title}.ejs`);

    // 删除文件
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).send('Error deleting file');
            return;
        }
        console.log('File deleted successfully!');
        res.redirect('/');
    });
});

//server
app.listen(port, (req, res)=> {
    console.log(`Server is listening on port ${port}`);
})