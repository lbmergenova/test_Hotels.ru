const express = require('express');
const data = require('../sql3-data');
const router = express.Router();

/* GET users listing. */
router.get('/', data.getUsers);

router.get('/:id', data.getUserById);

router.post('/', data.addUser);

router.put('/:id', data.updateUser);

router.delete('/:id', data.deleteUser);

module.exports = router;
