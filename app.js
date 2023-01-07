const express = require("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");
const request = require('request');
const mongoose = require("mongoose");
const _ = require("lodash");


const homeStartingContent = "The journal—it s one of those things that can be as useless as a piece of trash, or one of the most valuable things you’ve ever owned…It all depends on what you fill that journals pages with. Today, I’m going to share some of my personal favorite journaling ideas.You can use them all, combine the ones you like, or pick the single journaling idea that most resonates with where you’re at in life right now.Either way, journaling—when done regularly—almost always leads to fresh, new insights and ideas that can absolutely transform your life.I’ve used all of these journaling ideas below at some point in my life. Either to get through tough times, to achieve my goals, maintain my sanity, or to foster my creative efforts (like fleshing out topic ideas for articles, podcasts or talks.)Whichever one of these journaling ideas you decide to use, just promise me  you’ll actually use them. Because they’ll only work if you work them";
const aboutContent = "A few years ago, I decided to start sharing the stuff I’ve learned from all these books to help people improve their lives and achieve their goals.These days, about half a million people read or listen to my work every month. And I’d love you to be one of them.";
const contactContent = "Thanks so much for taking the time and effort to connect with me. You could’ve connected with a gazillion other folks today, but you’re reaching out to me. So for that, I’m grateful. Fill out the form below and I’ll be in touch.";

const app = express();
app.set("view engine", "ejs");

 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"));

mongoose.set ('strictQuery',true);
mongoose.connect('mongodb://127.0.0.1/dailyjournalDB');



const postSchema =new mongoose.Schema({
    title: String,
    content: String
  });
const Post = mongoose.model("Post",postSchema);

app.get("/", function(req, res){
    Post.find({}, function(err, posts){
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts
          });
      });
  
  });

app.get("/about", function(req, res){
    res.render("about",{about: aboutContent});
});
app.get("/contact", function(req, res){
    res.render("contact", {contact: contactContent});
});
app.get("/compose", function(req, res){
    res.render("compose");
});
app.post("/home", function(req, res){
    res.redirect("/compose");
});
app.post("/compose", function(req, res){

    const post = new Post ({
      title: req.body.postTitle,
      content: req.body.postBody
    })
    post.save(function(err){
      if(!err){
      res.redirect("/");
      }
    });
  
  });
 
app.get("/posts/:postId", function(req, res){   
    const requestedPostId = req.params.postId;
     
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post",{
        title: post.title,
        content: post.content
      });
    });
});

app.listen(3200, function(){
    console.log("server is running on port 3200");
});