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

//get favourite list
router.get('/get/favslist', function(req, res) {
  twitter.get('favorites/list', {user_id: req.session.userid, count: 25}, function (error, tweets, response) {
        if (error) {
          res.status(500).send(error);
        } else {
          console.log("get favourite tweets: ");

          var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: "", favorited: ""}];
          for(i = 0; i < tweets.length; i++) {

            tweet[i].tw_id = tweets[i].id_str;
            tweet[i].text = tweets[i].text;
            tweet[i].date = tweets[i].created_at.substring(4, 10);
            tweet[i].username = tweets[i].user.name;
            tweet[i].screenname = tweets[i].user.screen_name;
            tweet[i].favorited = true;
            tweet.push({});
          }
          tweet.pop();
          res.json(tweet);
        }
      }
  );
});

//get followers
router.get('/get/followers', function(req, res) {
  twitter.get('followers/list', {user_id: req.session.userid, count: 25}, function (error, tweets, response) {
        if (error) {
          res.status(500).send(error);
        } else {
          console.log("get followers: ");

          var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: "", favorited: ""}];
          for(i = 0; i < tweets.users.length; i++) {
            tweet[i].username = tweets.users[i].name;
            tweet[i].screenname = tweets.users[i].screen_name;
            tweet.push({});
          }
          tweet.pop();
          res.json(tweet);
        }
      }
  );
});

//post retweet
router.post('/api/post/retweet', function(req, res) {
  console.log(req.body.text);
  twitterN.statuses("retweet", {
        id: req.body.text
      },
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      function(err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log("success retweet: ");
          res.send(data.text);
        }
      }
  );
});

//get my retweets
router.get('/get/myretweets', function(req, res) {
  twitter.get('statuses/retweets', {user_id: req.session.userid, count: 25}, function (error, tweets, response) {
        if (error) {
          res.status(500).send(error);
        } else {
          console.log("get followers: ");

          var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: "", favorited: ""}];
          for(i = 0; i < tweets.users.length; i++) {
            tweet[i].username = tweets.users[i].name;
            tweet[i].screenname = tweets.users[i].screen_name;
            tweet.push({});
          }
          tweet.pop();
          res.json(tweet);
        }
      }
  );
});

//get retweets of me
router.get('/get/retweetsme', function(req, res) {
  twitterN.getTimeline('retweets_of_me', {count: 25},req.session.oauth_access_token, req.session.oauth_access_token_secret, function(err, tweets) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log("get retweets of me: ");

          var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: "", favorited: ""}];
          for(i = 0; i < tweets.length; i++) {
            tweet[i].tw_id = tweets[i].id_str;
            tweet[i].text = tweets[i].text;
            tweet[i].date = tweets[i].created_at.substring(4, 10);
            tweet[i].username = tweets[i].user.name;
            tweet[i].screenname = tweets[i].user.screen_name;
            tweet[i].favorited = true;
            tweet.push({});
          }
          tweet.pop();
          res.json(tweet);
        }
      }
  );
});

// api ---------------------------------------------------------------------
// get search
router.get('/api/get/search', function(req, res) {
  twitter.get('search/tweets', {count: 20, count: 25}, {q: 'toronto'}, function (error, tweets, response) {
    console.log(tweets.statuses);
    if(error)
    {
      res.status(500).send(error);
    }
    else{
      var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: ""}];
      for(i = 0; i < tweets.statuses.length; i++){
        tweet.push({});
        tweet[i].tw_id = tweets.statuses[i].id_str;
        tweet[i].text = tweets.statuses[i].text;
        tweet[i].date = tweets.statuses[i].created_at.substring(4, 10);
        tweet[i].username = tweets.statuses[i].user.name;
        tweet[i].screenname = tweets.statuses[i].user.screen_name;
        tweet[i].favorited = tweets.statuses[i].favorited;
      }

      res.json(tweet);
    }
  });
});

  // post search
  router.post('/api/post/search', function(req, res) {
    console.log(req.body.text);
    twitter.get('search/tweets', {q: req.body.text, count: 25}, function (error, tweets, response) {
      if(error)
      {
        res.status(500).send(error);
      }
      else {
        var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: "", favorited: ""}];
        for(i = 0; i < tweets.statuses.length; i++){

          tweet[i].tw_id = tweets.statuses[i].id_str;
          tweet[i].text = tweets.statuses[i].text;
          tweet[i].date = tweets.statuses[i].created_at.substring(4, 10);
          tweet[i].username = tweets.statuses[i].user.name;
          tweet[i].screenname = tweets.statuses[i].user.screen_name;
          tweet[i].favorited = tweets.statuses[i].favorited;
          tweet.push({});
      }
      }
      tweet.pop();
      res.json(tweet);
    });
  });

router.get("/user-home", function (req, res) {

  twitterN.getTimeline('home_timeline', {count: 25},req.session.oauth_access_token, req.session.oauth_access_token_secret, function(err, tweets) {
    if (err) {
      res.status(500).send(err);
    } else {
      var tweet = [{tw_id: "", text: "", date: "", username: "", screenname: "", favorited: ""}];
      for(i = 0; i < tweets.length; i++){
        tweet[i].tw_id = tweets[i].id_str;
        tweet[i].text = tweets[i].text;
        tweet[i].date = tweets[i].created_at.substring(4, 10);
        tweet[i].username = tweets[i].user.name;
        tweet[i].screenname = tweets[i].user.screen_name;
        tweet[i].favorited = tweets[i].favorited;
        //console.log(tweet[i].favorited);
        tweet.push({});
      }

      tweet.pop();
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

// post fav
router.post('/api/post/fav', function(req, res) {
  console.log(req.body.text);
  twitterN.favorites("create", {
        id: req.body.text
      },
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      function(err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log("success favorite: ");
          res.send(data.text);
        }
      }
  );
});

// post fav
router.post('/api/post/unfav', function(req, res) {
  console.log(req.body.text);
  twitterN.favorites("destroy", {
        id: req.body.text
      },
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      function(err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log("success unfavorite: ");
          res.send(data.text);
        }
      }
  );
});

router.get("/get-trends", function (req, res) {
      twitterN.trends('place',{
            id: 1
          },
          process.env.TWITTER_ACCESS_KEY,
          process.env.TWITTER_ACCESS_SECRET,
          function(err, data) {
            if (err) {
              res.status(500).send(err);
            } else {
              var trend = [{trend_name: ""}];
              var numTrend = Math.min(data[0].trends.length, 10);
              for(i = 0; i < numTrend; i++){
                trend[i].trend_name = data[0].trends[i].name;
                trend.push({});
              }
              trend.pop();
              res.json(trend);
            }
          }
      );
});

router.get("/user-profile-pic", function (req, res) {
  res.send(req.session.profile_image_url);
});

router.get("/user-id", function (req, res) {
  res.send(req.session.userid);
});

router.get("/user-display-name", function (req, res) {
  res.send(req.session.displayname);
});

router.get("/user-screen-name", function (req, res) {
  res.send(req.session.screenname);
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
	console.log(twitterN.callback);
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

  if(requestToken == undefined)
  {
    res.redirect(process.env.TWITTER_HOME);
  }
  else
  {
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
            req.session.displayname = user.name;
            req.session.screenname = user.screen_name;
            req.session.userid = user.id;
            req.session.oauth_access_token = accessToken;
            req.session.oauth_access_token_secret = accessSecret;
            res.redirect(process.env.TWITTER_HOME);
          }
        });
      }
    });
  }
});



module.exports = router;
