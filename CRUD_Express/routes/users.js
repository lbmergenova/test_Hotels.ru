const express = require('express');
const data = require('../data_db');
const router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res) {
  res.json(await data.getUsers());
});

router.get('/:id', async function(req, res, next) {
  res.json(await data.getUserById(Number(req.params.id)));
});

router.post('/', async function (req, res, next) {
  console.log(req.body);
  res.json(await data.addUser(req.body));
})

router.put('/:id', async function(req, res, next) {
  res.json(await data.updateUser(Number(req.params.id), req.body));
});

router.delete('/:id', async function(req, res, next) {
  res.json(await data.deleteUser(Number(req.params.id)));
});

module.exports = router;
