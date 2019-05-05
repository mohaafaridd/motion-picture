/* eslint-disable no-underscore-dangle */
const express = require('express');
const searchController = require('../controllers/searchController');
const viewController = require('../controllers/viewController');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();


router.get('/search', viewAuth, searchController);

router.get('/:type/:id', viewAuth, viewController);

router.post('/add-to-list', auth, listsController.addToList);

router.post('/remove-from-list', auth, listsController.deleteFromList);

router.post('/:id/seen/', auth, async (req, res) => {
  const { user } = req;
  let { id } = req.params;
  try {
    const arr = [...user.seen];
    const seenIds = arr.map(obj => obj.id);
    id = parseInt(id, 10);
    if (seenIds.includes(id)) {
      user.seen = user.seen.filter(obj => obj.id !== id);
    } else {
      user.seen = user.seen.concat({ id });
    }

    await user.save();
    console.log(user.seen);
    res.redirect(req.header('Referer'));
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
