const categoryService = require('./category.service.js')

const logger = require('../../services/logger.service.js')
const { log } = require('../../middlewares/logger.middleware.js')

async function getCategories(req, res) {
  try {
    logger.debug('Getting categorys')
    const filterBy = {
      txt: req.query.txt || '',
    }
    const categories = await categoryService.query(filterBy)
    res.json(categories)
  } catch (err) {
    logger.error('Failed to get categorys', err)
    res.status(500).send({ err: 'Failed to get categorys' })
  }
}

async function getcategoryById(req, res) {
  try {
    const category = await categoryService.getById(req.params.id)
    res.json(category)
  } catch (err) {
    logger.error('Failed to get category', err)
    res.status(500).send({ err: 'Failed to get category' })
  }
}
async function getCategorycategorys(req, res) {
  try {
    const categorycategorys = await categoryService.getCategoryById(req.params.id)
    res.json(categorycategorys)
  } catch (err) {
    logger.error('Failed to get category', err)
    res.status(500).send({ err: 'Failed to get category' })
  }
}

async function addcategory(req, res) {
  const { loggedinUser } = req

  try {
    const category = req.body
    category.owner = loggedinUser
    const addedcategory = await categoryService.add(category)
    res.json(addedcategory)
  } catch (err) {
    logger.error('Failed to add category', err)
    res.status(500).send({ err: 'Failed to add category' })
  }
}

async function updatecategory(req, res) {
  try {
    const category = req.body
    const updatedcategory = await categoryService.update(category)
    res.json(updatedcategory)
  } catch (err) {
    logger.error('Failed to update category', err)
    res.status(500).send({ err: 'Failed to update category' })
  }
}

async function removecategory(req, res) {
  try {
    const categoryId = req.params.id
    const removedId = await categoryService.remove(categoryId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove category', err)
    res.status(500).send({ err: 'Failed to remove category' })
  }
}

async function addcategoryMsg(req, res) {
  const { loggedinUser } = req
  try {
    const categoryId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await categoryService.addcategoryMsg(categoryId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update category', err)
    res.status(500).send({ err: 'Failed to update category' })
  }
}

async function removecategoryMsg(req, res) {
  const { loggedinUser } = req
  try {
    const categoryId = req.params.id
    const { msgId } = req.params

    const removedId = await categoryService.removecategoryMsg(categoryId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove category msg', err)
    res.status(500).send({ err: 'Failed to remove category msg' })
  }
}

module.exports = {
  getCategories,
  getcategoryById,
  addcategory,
  updatecategory,
  removecategory,
  addcategoryMsg,
  removecategoryMsg,
  getCategorycategorys
}
