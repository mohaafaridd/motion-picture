// Modules
const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
// Auth
const auth = require('../middlewares/auth');
// Helpers
const mediaInfoGrapper = require('../controllers/helpers/mediaInfoGrapper');
const actorHelper = require('../controllers/helpers/actorHelper');

const router = express.Router();

// Gets an actor
router.get('/:id', auth.viewAuth, async (req, res) => {
  const { cachedUser } = req;
  const { id } = req.params;

  const URL = `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=combined_credits%2Cimages`

  const response = await axios.get(URL);

  const personalInformation = _.pick(response.data, [
    'birthday',
    'deathday',
    'name',
    'gender',
    'biography',
    'images',
    'place_of_birth',
    'profile_path',
    'combined_credits',
  ]);

  const actor = {
    name: personalInformation.name,
    pic: personalInformation.profile_path,
    birthday: personalInformation.birthday,
    deathday: personalInformation.deathday,
    age: actorHelper.getAge(personalInformation),
    isFemale: actorHelper.getGender(personalInformation),
    bio: actorHelper.getBio(personalInformation),
    images: actorHelper.getImages(personalInformation),
    country: actorHelper.getCountry(personalInformation),
    credits: await mediaInfoGrapper(response.data.combined_credits.cast),
  };

  actor.credits = _.orderBy(actor.credits, ['popularity'], ['desc']);

  res.render('actor/actor', {
    title: actor.name,
    cachedUser,
    actor,
  });
});

module.exports = router;
