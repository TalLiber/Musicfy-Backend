const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getCategoryPlaylists, getPlaylists, getPlaylistById, addPlaylist, updatePlaylist, removePlaylist, addPlaylistMsg, removePlaylistMsg } = require('./playlist.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getPlaylists)
router.get('/category/:id',getCategoryPlaylists)
router.get('/:id', getPlaylistById)
router.post('/', addPlaylist)
// router.post('/', requireAuth, addPlaylist)
router.put('/:id', updatePlaylist)
// router.put('/:id', requireAuth, updatePlaylist)
// router.delete('/:id', requireAuth, removePlaylist)
router.delete('/:id', removePlaylist)
// router.delete('/:id', requireAuth, requireAdmin, removePlaylist)

// router.post('/:id/msg', requireAuth, addPlaylistMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removePlaylistMsg)

module.exports = router