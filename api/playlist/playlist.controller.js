const playlistService = require('./playlist.service.js')

const logger = require('../../services/logger.service.js')
const { log } = require('../../middlewares/logger.middleware.js')

async function getPlaylists(req, res) {
  try {
    logger.debug('Getting Playlists')
    const filterBy = {
      txt: req.query.txt || '',
    }
    const playlists = await playlistService.query(filterBy)
    res.json(playlists)
  } catch (err) {
    logger.error('Failed to get playlists', err)
    res.status(500).send({ err: 'Failed to get playlists' })
  }
}

async function getPlaylistById(req, res) {
  try {
    const playlist = await playlistService.getById(req.params.id)
    res.json(playlist)
  } catch (err) {
    logger.error('Failed to get playlist', err)
    res.status(500).send({ err: 'Failed to get playlist' })
  }
}
async function getCategoryPlaylists(req, res) {
  try {
    const categoryPlaylists = await playlistService.getCategoryById(req.params.id)
    res.json(categoryPlaylists)
  } catch (err) {
    logger.error('Failed to get playlist', err)
    res.status(500).send({ err: 'Failed to get playlist' })
  }
}
async function searchItems(req, res) {
  const {searchKey, searchType} = req.body
  try {
    const resItems = await playlistService.getSearchItems(searchKey, searchType)
    res.json(resItems)
  } catch (err) {
    logger.error('Failed to get playlist', err)
    res.status(500).send({ err: 'Failed to get playlist' })
  }
}

async function addPlaylist(req, res) {
  const { loggedinUser } = req

  try {
    const playlist = req.body
    playlist.owner = loggedinUser
    const addedPlaylist = await playlistService.add(playlist)
    res.json(addedPlaylist)
  } catch (err) {
    logger.error('Failed to add playlist', err)
    res.status(500).send({ err: 'Failed to add playlist' })
  }
}

async function updatePlaylist(req, res) {
  try {
    const playlist = req.body
    const updatedPlaylist = await playlistService.update(playlist)
    res.json(updatedPlaylist)
  } catch (err) {
    logger.error('Failed to update playlist', err)
    res.status(500).send({ err: 'Failed to update playlist' })
  }
}

async function removePlaylist(req, res) {
  try {
    const playlistId = req.params.id
    const removedId = await playlistService.remove(playlistId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove playlist', err)
    res.status(500).send({ err: 'Failed to remove playlist' })
  }
}

async function addPlaylistMsg(req, res) {
  const { loggedinUser } = req
  try {
    const playlistId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await playlistService.addPlaylistMsg(playlistId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update playlist', err)
    res.status(500).send({ err: 'Failed to update playlist' })
  }
}

async function removePlaylistMsg(req, res) {
  const { loggedinUser } = req
  try {
    const playlistId = req.params.id
    const { msgId } = req.params

    const removedId = await playlistService.removePlaylistMsg(playlistId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove playlist msg', err)
    res.status(500).send({ err: 'Failed to remove playlist msg' })
  }
}

module.exports = {
  getPlaylists,
  getPlaylistById,
  addPlaylist,
  updatePlaylist,
  removePlaylist,
  addPlaylistMsg,
  removePlaylistMsg,
  getCategoryPlaylists,
  searchItems
}
