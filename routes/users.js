var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Photo = require('../models/photo');
var Verify = require('./verify');
var multiPart = require('connect-multiparty');
var multiPartMiddleWare = new multiPart();
var fs = require('fs-extra');
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(401).json({err: err});
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        });
    });
});

router.post('/login', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken(user);
        res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        username:user.username,
        image: user.image,
        followers: user.followers,
        following: user.following
      });
    });
  })(req,res,next);

});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.post('/edit', Verify.verifyOrdinaryUser ,multiPartMiddleWare ,function(req, res) {
  var file = req.files.file;
  theuser = req.body.username;
  console.log("User " + theuser + "..." + file);

  var uploadDate = new Date().toString();
  uploadDate = uploadDate.replace(/:/g,'-');  console.log(file.path + '\n')
  var tempPath = file.path;
  var finalPath = path.join(__dirname, "../userphotos/", theuser + uploadDate+file.name);
  console.log(finalPath);
  var savePath = "/userphotos/" + theuser + uploadDate + file.name;
  
  fs.rename(tempPath, finalPath, function (err){
       if (err){
           console.log(err)
       } else {
           User.findOne({"username":theuser}, function(err, userData){
               var userd = userData;
               userd.image = savePath;
               console.log('\n' + userd + '\n');
               userd.save(function(err){
                   if (err){
                       console.log("Error whilst saving file: " + err)
                       res.json({status: 500})
                   } else {
                       console.log("Image saved");
                       
                       res.json(savePath);
                    }
                  })
              })
          }
      })   
});


router.post('/edit/updatebio', Verify.verifyOrdinaryUser ,function(req, res){
    var name = req.body.username;
    var bio = req.body.bio;
    console.log(name);
    User.findOne({"username":name}, function(err, userData){
      var userd = userData;
      userd.bio = bio;
      userd.save(function(err){
        if(err){
          console.log("Not able to update bio");
          res.json({status:500});
        }
        else{
          console.log("Successly updated Bio");
          res.json({status:200});
        }
      });
    });
});


router.post('/addphoto', multiPartMiddleWare,Verify.verifyOrdinaryUser ,function(req, res){
 var file = req.files.file;
 theuser = req.body.username;
 thedp = req.body.image;
 console.log("User " + theuser + "..." + file);

  var uploadDate = new Date().toString();
  uploadDate = uploadDate.replace(/:/g,'-');
  console.log(uploadDate + '\n');
  var tempPath = file.path;
  var finalPath = path.join(__dirname, "../userphotos/", theuser +"normal"+ uploadDate+file.name);
  console.log(finalPath);
  var savePath = "/userphotos/" + theuser+ "normal" + uploadDate + file.name;
  
  fs.rename(tempPath, finalPath, function (err){
       if (err){
        console.log(err);
       } else {
           Photo.findOne({"username":theuser}, function(err, photoData){
              if(!photoData){
                var photoData = new Photo({username: theuser, image : thedp});

                photoData.save(function (err) {
                  if (err) {
                    return err;
                  }
                  else {
                    console.log("Post saved");
                  }
                });
              }
              var phtd = photoData;
              phtd.images.unshift(savePath);
              console.log('\n' + phtd + '\n');
              phtd.save(function(err){
                  if(err){
                      console.log("Error whilst saving file: " + err)
                      res.json({status: 500})
                   } else {
                      console.log("Image saved");                       
                      res.json({status:200});
                    }
                  })
              })
          }
    })   
});
   
router.post('/getphotos',function(req, res){
  
    var reqPhotos = [];
    console.log( "\n" + req.body + "\n");
    try{
      for(x =0; x < req.body.following.length;  x++){
        reqPhotos.push({username: req.body.following[x].username});
      }
    }

    catch(err){
      console.log(err);
    }

    Photo.find({}).exec(function(err, allPhotos){
        if(err){console.log(err);}
        else{
          res.json(allPhotos);
        }
    });

});

router.get('/get' ,function(req, res){
  
    User.find({}, function(err, userData){
       if(err){
          res.error(err);
       }
       else{
          res.json(userData);
       }
    });
});

router.post('/follow', function(req, res){

    var followed_username = req.body.followed_username;
    var follower_username = req.body.follower_username;

    User.findOne(followed_username, function(err, followed){
      if(!err){
        console.log("\n Followed \n" + followed);
        followed.followers.push({username : follower_username});
        followed.save();
      }
    });
    User.findOne({username : follower_username}, function(err, follower){
      if(!err){
        console.log("\n Follower \n" + follower);
        follower.following.push({username : followed_username});
        follower.save();
      }
    });

    console.log("This " + followed_username + " is followed by " + follower_username);
});

module.exports = router;
