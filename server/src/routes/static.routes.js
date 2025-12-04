'use strict'

const express = require('express')
const categories = require('../data/categories')
const accounts = require('../data/accounts')

const router = express.Router()

router.get('/categories', (req, res) => {
    res.json(categories)
})

router.get('/accounts', (req, res) => {
    res.json(accounts)
})

module.exports = router
