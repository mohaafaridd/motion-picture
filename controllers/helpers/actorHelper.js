const moment = require('moment');

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

const getImages = (info) => {
  const images = info.images.profiles;
  const arr = [];
  images.forEach(obj => arr.push(obj.file_path));
  return arr;
};

const getCountry = (info) => {
  const str = info.place_of_birth;
  const arr = str.split(', ');
  const country = arr[arr.length - 1];
  return country;
};

module.exports = {
  getAge,
  getGender,
  getBio,
  getImages,
  getCountry,
};
