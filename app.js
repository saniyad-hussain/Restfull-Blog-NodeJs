const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  app = express(),
  methodOverride = require("method-override"),
  Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
//db connection path
const db = require("./config/keys").mongoURI;
//connect db with mongoose
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected Successfully"))
  .catch(err => console.log(err));

//Model Schema
const blogSchema = new Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
const Blog = mongoose.model("blog", blogSchema);

//Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      res.status(404).json();
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});
app.get("/blogs/new", (req, res) => {
  res.render("new");
});
app.post("/blogs", (req, res) => {
  Blog.create(
    {
      title: req.body.title,
      image: req.body.imgSrc,
      body: req.body.bodies
    },
    (err, newBlog) => {
      if (err) {
        res.status(404).json();
      } else {
        res.redirect("/blogs");
      }
    }
  );
});

//Show route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, post) => {
    if (err) {
      res.status(403);
    } else {
      res.render("post", { post: post });
    }
  });
});

//edit route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, post) => {
    if (err) {
      res.status(403);
    } else {
      res.render("edit", { post: post });
    }
  });
});

//Update
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, image: req.body.imgSrc, body: req.body.bodies },
    (err, updatedPost) => {
      if (err) {
        res.status(403);
      } else {
        res.redirect("/blogs");
      }
    }
  );
});

//Delete route
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});
app.listen(3000, () => {
  console.log("Server is running on 3000");
});
