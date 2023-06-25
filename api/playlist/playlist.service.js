const dbService = require('../../services/db.service')
const httpService = require ('../../services/http.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const { log } = require('../../middlewares/logger.middleware')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy = { txt: '' }) {
  try {
    const criteria = {
      vendor: { $regex: filterBy.txt, $options: 'i' },
    }
    const collection = await dbService.getCollection('playlist')
    var playlists = await collection.find(criteria).toArray()
    return playlists
  } catch (err) {
    logger.error('cannot find playlists', err)
    throw err
  }
}
async function getCategoryById(categoryId) {
  try {
    const categoryPlaylists = await httpService.getSpotifyItems('categoryPlaylists', categoryId)
    return categoryPlaylists
  } catch (err) {
    logger.error(`cannot add playlist msg ${playlistId}`, err)
    throw err
  }
}

async function getById(playlistId) {
  try {
    const collection = await dbService.getCollection('playlist')
    let playlist = await collection.findOne({ spotifyId: playlistId })
    if (!playlist) {
      playlist = await httpService.getSpotifyItems('playlist', playlistId)
      playlist.tracks = await httpService.getSpotifyItems('tracks', playlistId)
      playlist.spotifyId = playlistId
      playlist = await add(playlist)
    }
    return playlist
  } catch (err) {
    logger.error(`while finding playlist ${spotifyId}`, err)
    throw err
  }
}

async function remove(playlistId) {
  try {
    const collection = await dbService.getCollection('playlist')
    await collection.deleteOne({ _id: ObjectId(playlistId) })
    return playlistId
  } catch (err) {
    logger.error(`cannot remove playlist ${playlistId}`, err)
    throw err
  }
}

async function add(playlist) {
  try {
    const collection = await dbService.getCollection('playlist')
    await collection.insertOne(playlist)
    return playlist
  } catch (err) {
    logger.error('cannot insert playlist', err)
    throw err
  }
}

async function update(playlist) {
  try {
    const playlistToSave = {
      vendor: playlist.vendor,
      price: playlist.price,
    }
    const collection = await dbService.getCollection('playlist')
    await collection.updateOne(
      { _id: ObjectId(playlist._id) },
      { $set: playlistToSave }
    )
    return playlist
  } catch (err) {
    logger.error(`cannot update playlist ${playlistId}`, err)
    throw err
  }
}

async function addPlaylistMsg(playlistId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('playlist')
    await collection.updateOne(
      { _id: ObjectId(playlistId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add playlist msg ${playlistId}`, err)
    throw err
  }
}

async function removePlaylistMsg(playlistId, msgId) {
  try {
    const collection = await dbService.getCollection('playlist')
    await collection.updateOne(
      { _id: ObjectId(playlistId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add playlist msg ${playlistId}`, err)
    throw err
  }
}




module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addPlaylistMsg,
  removePlaylistMsg,
  getCategoryById
}