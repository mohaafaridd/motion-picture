/* eslint-disable no-underscore-dangle */
const express = require('express');
const search = require('../controllers/searchController');
const viewController = require('../controllers/viewController');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');

const router = express.Router();

// Search
router.get('/search', auth.viewAuth, search);

// Get specific movie or tv show
router.get('/:type/:id', auth.viewAuth, viewController);

router.post('/add-to-list', auth.loggedAuth, listsController.addToList);

router.post('/remove-from-list', auth.loggedAuth, listsController.deleteFromList);

router.post('/:id/seen/', auth.loggedAuth, async (req, res) => {
  const { cachedUser } = req;
  let { id } = req.params;
  try {
    const arr = [...cachedUser.seen];
    const seenIds = arr.map(obj => obj.id);
    id = parseInt(id, 10);
    if (seenIds.includes(id)) {
      cachedUser.seen = cachedUser.seen.filter(obj => obj.id !== id);
    } else {
      cachedUser.seen = cachedUser.seen.concat({ id });
    }

    await cachedUser.save();
    res.redirect(req.header('Referer'));
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
