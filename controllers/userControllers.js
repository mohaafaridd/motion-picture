/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const listsHelpers = require('../controllers/helpers/listsHelpers');


const getUser = async (req, res) => {
  const { nickname } = req.params;
  const { user } = req;
  try {
    const profile = await User.findOne({ nickname });

    if (!profile.avatar) {
      profile.avatar = 'https://via.placeholder.com/1024';
    }

    let lists = await listsHelpers.getListJSON(req, 'params');

    lists = lists.map(obj => ({ ...obj, picture: obj.picture ? obj.picture : 'https://via.placeholder.com/1024' }));

    const isOwner = user._id.toString() === profile._id.toString();
    res.render('user/profile', {
      title: `${profile.name} Profile`,
      profile,
      user,
      lists,
      isLogged: !user.isAnonymous,
      isOwner,
    });
  } catch (error) {
    res.redirect('/');
  }
};

module.exports = {
  // postSignout,
  getUser,
};
