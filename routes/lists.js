const express = require('express');
const listsController = require('../controllers/listsControllers');
const auth = require('../middlewares/auth');
const List = require('../models/list');
const User = require('../models/user');

const router = express.Router();


// Add list page
router.get('/add', auth, listsController.getAddList);

// Creates new list
router.post('/', auth, listsController.postList);

router.get('/edit/:id/', auth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const list = await List.findOne({ id });
  res.render('lists/edit', { list, user });
});

router.post('/edit/:id', auth, async (req, res) => {
  const { newName } = req.body;
  const { id } = req.params;
  const list = await List.findOne({ id });
  const user = await User.findById(list.owner);
  try {
    const duplicate = await List.findOne({ name: newName });
    if (duplicate) {
      throw new Error();
    }

    list.name = newName;
    await list.save();
    // res.send({ list, user });
    res.redirect(`/users/${user.nickname}/lists/${list.id}`);
  } catch (error) {
    res.redirect(`/users/${user.nickname}/lists/`);
  }
});

// Delete a list
router.post('/delete/:id', auth, listsController.deleteList);

// Gets top movies page
router.get('/pop', listsController.getTopMovies);

module.exports = router;
