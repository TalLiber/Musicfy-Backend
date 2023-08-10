const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getCategoryCategorys, getCategories, getCategoryById, addCategory, updateCategory, removeCategory, addCategoryMsg, removeCategoryMsg } = require('./category.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getCategories)
// router.get('/category/:id',getCategoryCategorys)
// router.get('/:id', getCategoryById)
// router.post('/', addCategory)
// router.put('/:id', updateCategory)


// router.post('/', requireAuth, addcategory)
// router.put('/:id', requireAuth, updatecategory)
// router.delete('/:id', requireAuth, removecategory)
// router.delete('/:id', requireAuth, requireAdmin, removecategory)

// router.post('/:id/msg', requireAuth, addcategoryMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removecategoryMsg)

module.exports = router