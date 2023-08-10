const dbService = require('../../services/db.service')
const httpService = require ('../../services/http.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const { log } = require('../../middlewares/logger.middleware')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy = { name: '' }) {
  try {
    const criteria = {
      name: { $regex: filterBy.txt, $options: 'i' },
    }
    const collection = await dbService.getCollection('home')
    var categories = await collection.find(criteria).toArray()
    return categories
  } catch (err) {
    logger.error('cannot find categorys', err)
    throw err
  }
}
async function getCategoryById(categoryId) {
  try {
    const categoryCategorys = await httpService.getSpotifyItems('categoryCategorys', categoryId)
    return categoryCategorys
  } catch (err) {
    logger.error(`cannot add category msg ${categoryId}`, err)
    throw err
  }
}

async function getById(categoryId) {
  try {
    const collection = await dbService.getCollection('category')
    let category = await collection.findOne({ spotifyId: categoryId })
    if (!category) {
      category = await httpService.getSpotifyItems('category', categoryId)
      category.tracks = await httpService.getSpotifyItems('tracks', categoryId)
      category.spotifyId = categoryId
      category = await add(category)
    }
    return category
  } catch (err) {
    logger.error(`while finding category ${spotifyId}`, err)
    throw err
  }
}

async function remove(categoryId) {
  try {
    const collection = await dbService.getCollection('category')
    await collection.deleteOne({ _id: ObjectId(categoryId) })
    return categoryId
  } catch (err) {
    logger.error(`cannot remove category ${categoryId}`, err)
    throw err
  }
}

async function add(category) {
  try {
    const collection = await dbService.getCollection('category')
    await collection.insertOne(category)
    return category
  } catch (err) {
    logger.error('cannot insert category', err)
    throw err
  }
}

async function update(category) {
  try {
    const categoryToSave = {
      spotifyId: category.spotifyId,
      name: category.name,
      description: category.description,
      image: category.image,
      tracks: category.tracks,
    }
    const collection = await dbService.getCollection('category')
    await collection.updateOne(
      { _id: ObjectId(category._id) },
      { $set: categoryToSave }
    )
    return category
  } catch (err) {
    logger.error(`cannot update category ${categoryId}`, err)
    throw err
  }
}

async function addCategoryMsg(categoryId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('category')
    await collection.updateOne(
      { _id: ObjectId(categoryId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add category msg ${categoryId}`, err)
    throw err
  }
}

async function removeCategoryMsg(categoryId, msgId) {
  try {
    const collection = await dbService.getCollection('category')
    await collection.updateOne(
      { _id: ObjectId(categoryId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add category msg ${categoryId}`, err)
    throw err
  }
}




module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addCategoryMsg,
  removeCategoryMsg,
  getCategoryById
}