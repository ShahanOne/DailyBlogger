require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const _ = require("lodash");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const ejs = require("ejs");
app.set('view engine', 'ejs');

app.use(express.static("public"));


const homeStartingContent = "Welcome to your Blog , Go to the Compose section or click on the '+' button to add a new post to  your Blog.     Happy Blogging!";


mongoose.connect(`mongodb+srv://Shahan786:${process.env.MONGO_PASSWORD}@cluster0.ma0c6.mongodb.net/BlogsDB`);

const postSchema = {
  title:{
    type: String,
    required:true
  },
    body: {
    type: String,
    required:true
  }
}

const Post = new mongoose.model("Post", postSchema);


app.get("/", function(req,res){

Post.find({}, function(err,foundPosts){

    res.render("home.ejs", {home: homeStartingContent , posts : foundPosts });
    // res.redirect("/");
})


})

app.get("/compose", function(req,res){
  res.render("compose.ejs")
})

app.post("/compose" , function(req,res){

const postTitle= req.body.postTitle;
const postBody = req.body.postBody;

const newPost = new Post({
  title:postTitle,
  body: postBody
})
newPost.save(function(err){
  if (!err){
      res.redirect("/");
  }
});


})

app.get("/posts/:postName" , function(req,res){
const postName = req.params.postName;  

Post.find({}, function(err,foundPosts){
  if(!err){
foundPosts.forEach(function(foundedPosts){
  const postTitle = foundedPosts.title;
  const postBody  = foundedPosts.body;

  const postTitleKebab = _.kebabCase(foundedPosts.title);
  const postNameKebab = _.kebabCase(req.params.postName);  // this will change however the title is written in the url to kebab cased



if(postNameKebab===postTitleKebab){
      res.render("post.ejs", {title: postTitle , body: postBody});
}
})

app.post("/delete", function(req,res){
  const postName= req.body.button;

Post.findOneAndDelete({title: postName}, function(err,result){
  if (!err){
    console.log("Successfully Deleted");
  }
});

  res.redirect("/")
})



      // const postTitleKebab = _.kebabCase(foundPosts.title);



  }



});
})







let port = process.env.PORT;
if (port == null || port == "") {
  port =3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});




// app.get("/about", function(req,res){
//   res.render("about.ejs", {about: aboutContent});
// })
//
// app.get("/contact", function(req,res){
//   res.render("contact.ejs", {contact: contactContent});
// })
