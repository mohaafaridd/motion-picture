const moment = require('moment');
const axios = require('axios');
const _ = require('lodash');

const mediaInfoGrapper = require('./mediaInfoGrapper');

const getAge = (info) => {
  const birth = moment(info.birthday);
  const deathday = info.deathday
    ? moment(info.deathday) : null;

  let age;

  if (deathday) {
    age = deathday.diff(birth, 'years');
  } else {
    age = (moment(Date.now())).diff(birth, 'years');
  }

  return age;
};

const getGender = (info) => {
  const gender = info.gender === 1;
  return gender;
};

const getBio = (info) => {
  let bio = info.biography;
  bio = bio.replace(/[\n\r]/g, '');
  return bio;
};

const getCountry = async (info) => {
  const str = info.place_of_birth;
  const arr = str.split(', ');
  const country = arr[arr.length - 1];
  const valid = country.replace(/[^a-zA-Z ]/g, '');
  const abbr = await axios.get(`https://restcountries.eu/rest/v2/name/${valid}?fullText=true`);
  return abbr.data[0].alpha2Code;
};

const getTopCredits = async (info) => {
  const asCast = info.combined_credits.cast;
  const top = _.orderBy(asCast, ['popularity'], ['desc']);
  const sliced = top.slice(0, 5);
  const parsed = await mediaInfoGrapper(sliced);
  return parsed;
};

module.exports = {
  getAge,
  getGender,
  getBio,
  getCountry,
  getTopCredits,
};
