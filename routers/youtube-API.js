const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const { YOUTUBE_API_KEY } = require('../config');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/:artist/:songTitle', (req, res, next) => {
  let artist = req.params.artist;
  let songTitle = req.params.songTitle;
  
  const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search'+
  `?key=${YOUTUBE_API_KEY}&q=${artist}+${songTitle}+lyrics&part=snippet&maxResults=1&type=video`;
  // console.log(YOUTUBE_API_KEY)
  return fetch(youtubeUrl, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(result => {
      result = result.json();
      return result;
    })
    .then(result => {
      let videoId = result.items[0].id.videoId;
      let videoURL = 'https://www.youtube.com/watch?v=' + videoId;
      // console.log(videoURL);
      return res.json(videoURL);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = { router };