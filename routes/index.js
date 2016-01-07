var express = require('express');
var router = express.Router();
var twit = require('twitter');
var Tweet = require('../models/tweet');
var TwitterN = require("node-twitter-api");
var token = require('../models/token');

var twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  callback: "http://127.0.0.1:3000"
});

var twitterN = new TwitterN({
  consumerKey: "CpA5oWclxPV3Etj3I9yF7ba9d",
  consumerSecret: "XdIgLK8qPwX5CK7uMfFtWKNgaaOgKIZCLqBOgEEJ7MrusKOGOj",
  callback: "http://127.0.0.1:3000/auth/access-token"
});

var _requestSecret;
var _tempAccessToken;
var _tempAccessSecret;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// api ---------------------------------------------------------------------
// get stream
router.get('/api/stream', function(req, res) {
  /**
   * Stream statuses filtered by keyword
   * number of tweets per second depends on topic popularity
   **/
  twitter.stream('statuses/filter', {track: 'water'},  function(stream){
    stream.on('data', function(tweet) {
      console.log(tweet.text);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });
});

// api ---------------------------------------------------------------------
// get search
router.get('/api/get/search', function(req, res) {
  twitter.get('search/tweets', {q: 'toronto'}, function (error, tweets, response) {
    console.log(tweets.statuses);

    var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: ""}];
    for(i = 0; i < tweets.statuses.length; i++){
      tweet.push({});
      tweet[i].tw_id = tweets.statuses[i].id;
      tweet[i].text = tweets.statuses[i].text;
      tweet[i].date = tweets.statuses[i].created_at;
      tweet[i].username = tweets.statuses[i].user.name;
      tweet[i].screenname = tweets.statuses[i].user.screen_name;
    }

      res.json(tweet);
  });
});

  // post search
  router.post('/api/post/search', function(req, res) {
    console.log(req.body.text);
    twitter.get('search/tweets', {q: req.body.text}, function (error, tweets, response) {

      var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: ""}];
      for(i = 0; i < tweets.statuses.length; i++){
        tweet.push({});
        tweet[i].tw_id = tweets.statuses[i].id;
        tweet[i].text = tweets.statuses[i].text;
        tweet[i].date = tweets.statuses[i].created_at;
        tweet[i].username = tweets.statuses[i].user.name;
        tweet[i].screenname = tweets.statuses[i].user.screen_name;
      }

      res.json(tweet);
    });
  });

//update status
router.post('/api/post/tweet', function(req, res) {
  twitterN.statuses("update", {
        status: "weowww"
      },
      _tempAccessToken,
      _tempAccessSecret,
      function(err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log("success tweet: " +data.text);
        }
      }
  );
});

router.get("/user-home", function (req, res) {

  twitterN.getTimeline('home_timeline', {count: 12},_tempAccessToken, _tempAccessSecret, function(err, tweets) {
    if (err) {
      res.status(500).send(err);
    } else {
      var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: ""}];
      for(i = 0; i < tweets.length; i++){
        tweet.push({});
        tweet[i].tw_id = tweets[i].id;
        tweet[i].text = tweets[i].text;
        tweet[i].date = tweets[i].created_at;
        tweet[i].username = tweets[i].user.name;
        tweet[i].screenname = tweets[i].user.screen_name;
      }

      res.json(tweet);
    }
  });
});

router.get("/is-user-auth", function (req, res) {
  if(_tempAccessToken == undefined)
  {
    res.send('false');
  }
  else
  {
    res.send('true');
  }
});

router.get("/auth/request-token", function (req, res) {
  twitterN.getRequestToken(function (err, requestToken, requestSecret) {
    if (err)
      res.status(500).send(err);
    else {
      _requestSecret = requestSecret;
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
    }
  });
});

router.get("/auth/access-token", function(req, res) {
  var requestToken = req.query.oauth_token,
      verifier = req.query.oauth_verifier;

  twitterN.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
    if (err)
      res.status(500).send(err);
    else
    {
      //twitterN.verifyCredentials(accessToken, accessSecret, function(error, user, response) {
      //  if (err) {
      //    res.status(500).send(err);
      //  } else {
      //    var date = new Date();
      //
      //    token.create({
      //      access_token: accessToken,
      //      access_secret: accessSecret,
      //      screen_name: user.screen_name,
      //      creation: date
      //    });
      //
      //    res.send(user);
      //  }
      //});
      _tempAccessToken = accessToken;
      _tempAccessSecret = accessSecret;
      console.log("here");
      res.redirect("http://127.0.0.1:3000");
    }
  });
});



module.exports = router;
