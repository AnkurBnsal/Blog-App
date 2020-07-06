var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	prompt		= require("prompt");
;


mongoose.connect("mongodb://localhost:27017/blog_app", {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false
});

// app config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//model/schema config
var blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

//Restful routes

app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){ console.log(err); }
		else{ res.render("index",{blogs:blogs}); }
	});
});

//New Route
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//Create routes
app.post("/blogs",function(req,res){
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.create(req.body.blog , function(err,newblog){
		if(err){ res.render("new"); }
		else{ res.redirect("/blogs"); }
	});
});

//show routes
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){ res.redirect("/blogs"); }
		else{ res.render("show",{blog:foundBlog}); }
	});
});


//edit
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){ res.redirect("/blogs"); }
		else{ res.render("edit",{blog:foundBlog}); }
	});
});

//update
app.put("/blogs/:id",function(req,res){
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.findByIdAndUpdate( req.params.id, req.body.blog, function(err,UpdatedBlog){
		if(err){ res.redirect("/blogs"); }
		else{ res.redirect("/blogs/" + req.params.id); }
	});
});

//delete
app.delete("/blogs/:id", middleware, function(req,res){
	Blog.findByIdAndRemove( req.params.id, function(err,UpdatedBlog){
		res.redirect("/blogs");
	});
});


function middleware(req, res, next){
	
	// alert("are you sure you want to delete");
	// prompt.start();
	
	// prompt.get(['password'], function (err, result) {
		
	// 	if(result.password ==="admin123"){ next(); }
	// 	else{ back(); }
	// });
	
	// var pass = prompt("Enter password");
	// if(pass==="admin123"){ next(); }
	// else{ back(); }
}


//start server
app.listen( process.env.PORT || 3000, process.env.IP , function(req,res){
	console.log("Blog app started");
});