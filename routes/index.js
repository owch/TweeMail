var express = require('express');
var router = express.Router();
var twit = require('twitter');
var TwitterN = require("node-twitter-api");


var twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

var twitterN = new TwitterN({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callback: process.env.TWITTER_HOME + "/auth/access-token"
});

var _requestSecret;

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
    if(error)
    {
      res.status(500).send(error);
    }
    else{
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
    }
  });
});

  // post search
  router.post('/api/post/search', function(req, res) {
    console.log(req.body.text);
    console.log(twitter);
    twitter.get('search/tweets', {q: req.body.text}, function (error, tweets, response) {
      if(error)
      {
        res.status(500).send(error);
      }
      else {
        var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: ""}];
        for(i = 0; i < tweets.statuses.length; i++){

          tweet.push({});
          tweet[i].tw_id = tweets.statuses[i].id;
          tweet[i].text = tweets.statuses[i].text;
          tweet[i].date = tweets.statuses[i].created_at;
          tweet[i].username = tweets.statuses[i].user.name;
          tweet[i].screenname = tweets.statuses[i].user.screen_name;
      }
      }

      res.json(tweet);
    });
  });

router.get("/user-home", function (req, res) {

  twitterN.getTimeline('home_timeline', {count: 15},req.session.oauth_access_token, req.session.oauth_access_token_secret, function(err, tweets) {
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

//update status
router.post('/api/post/tweet', function(req, res) {
  twitterN.statuses("update", {
        status: req.body.text
      },
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      function(err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log("success tweet: ");
          res.send(data.text);
        }
      }
  );
});

//router.get("/get-trends", function (req, res) {
//    twitterN.trends('place', {
//      id: 1
//    },
//        _tempAccessToken,
//        _tempAccessSecret,
//        function(err, data) {
//          if (err) {
//            res.status(500).send(err);
//          } else {
//            res.send(data);
//          }
//        }
//    );
//});

router.get("/user-profile-pic", function (req, res) {
  res.send(req.session.profile_image_url);
});

router.get("/is-user-auth", function (req, res) {
  if(req.session.oauth_access_token == undefined)
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
      twitterN.verifyCredentials(accessToken, accessSecret, function(error, user, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          req.session.profile_image_url = user.profile_image_url_https;
          req.session.oauth_access_token = accessToken;
          req.session.oauth_access_token_secret = accessSecret;
          console.log("here");
          res.redirect(process.env.TWITTER_HOME);
        }
      });
    }
  });
});



module.exports = router;
