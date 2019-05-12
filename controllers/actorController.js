const axios = require('axios');
const _ = require('lodash');

// Helpers
const actorHelper = require('./helpers/actorHelper');

const getActor = async (req, res) => {
  const { cachedUser } = req;
  const { id } = req.params;

  try {
    const URL = `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=combined_credits`;

    const response = await axios.get(URL);

    if (!response.data) {
      throw new Error('No data was found');
    }

    const personalInformation = _.pick(response.data, [
      'birthday',
      'deathday',
      'name',
      'gender',
      'biography',
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
      country: await actorHelper.getCountry(personalInformation),
      credits: await actorHelper.getTopCredits(personalInformation),
    };

    // res.send(actor);
    res.render('actor/actor', {
      title: actor.name,
      cachedUser,
      actor,
    });
  } catch (error) {
    error.message = 'No data was found';
    res.render('404', { cachedUser, error });
  }
};

module.exports = { getActor };
