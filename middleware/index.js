var Comment = require("../models/comment");
var Campground = require("../models/campground");

var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, (err, foundCamp)=>{
      if(err || !foundCamp){
        req.flash("error", "Campground not found");
        res.redirect("back");
      }else{
        if(foundCamp.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You do not have permissions for this campground");
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error", "You need to be logged in to do that")
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
      if(err || !foundComment){
        req.flash("error", "Comment not found");
        res.redirect("back");
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You do not have permissions for this comment");
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated())
    return next();
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
}

module.exports = middlewareObj;