const { getPopular } = require('./helpers/indexHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const getHome = async (req, res) => {
  try {
    const { user } = req;
    user.isAnonymous = !!user.isAnonymous;
    const popular = await getPopular(user);
    const lists = user.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');
    const hasList = lists.length !== 0;
    res.render('index', {
      title: 'Motion Picture',
      user,
      popular,
      options: lists,
      hasList,
      isLogged: !user.isAnonymous,
    });
  } catch (error) {
    res.redirect(req.header('Referer'));
  }
};

module.exports = {
  getHome,
};
