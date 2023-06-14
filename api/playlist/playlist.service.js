const axios = require('axios')
require('dotenv').config()

const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const { getPlaylists } = require('./playlist.controller')
const { log } = require('../../middlewares/logger.middleware')
const ObjectId = require('mongodb').ObjectId

let gAccessToken = _setAccessToken()

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

async function getById(spotifyId) {
  try {
    const collection = await dbService.getCollection('playlist')
    let playlist = collection.findOne({ spotifyId: spotifyId })
    if (!playlist) {
      playlist = await _getSpotifyPlaylist(spotifyId)
      
      console.log('playlist', playlist)
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

async function _setAccessToken() {
  try {
    return await _getAccessToken()
  } catch (err) {
    logger.error(err)
    throw err
  }
}

async function _getAccessToken() {
  try {
    // Encode client credentials (Client ID and Client Secret)
    const credentials = `${process.env.clientId}:${process.env.clientSecret}`
    const encodedCredentials = Buffer.from(credentials).toString('base64')

    // Make a POST request to the token endpoint
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    )

    // Extract and return the access token from the response
    const { data } = response
    const accessToken = data.access_token
    const expiresIn = data.expires_in
    console.log('accessToken', accessToken)
    return { accessToken, expiresIn }
  } catch (error) {
    console.error(
      'Error retrieving access token:',
      error.response ? error.response.data : error.message
    )
    throw error
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
}
