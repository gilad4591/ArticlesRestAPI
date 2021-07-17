const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")
.get(function(req, res) {

  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  console.log(req.body.title);
  console.log(req.body.content);

  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err) {
    if (!err) {
      res.send('Succesfully added a new article');
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send('Succefully deleted all articles');
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne(
    {title: req.params.articleTitle},
     function(err,foundArticle){
    if (!err){
      if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No article found");
    }
  }
    else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle},
    function(err){
    if (!err){
      res.send("Article deleted Succefully");
    }
    else{
      res.send("Article not found.");
    }
  });
})
.put(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
     function(err, results){
    if (!err){
      res.send("Succefully updated article");
    }
    else{
      res.send(err);
    }
  });
})
.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Succefully updated article");
      }
      else{
        res.send(err);
      }
    }
  )
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
