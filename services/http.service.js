const axios = require('axios')
require('dotenv').config()

let gAccessToken = null

_setAccessToken()

async function getSpotifyItems(reqType, id) {
  const endpoints = {
    categoryPlaylists: `https://api.spotify.com/v1/browse/categories/${id}/playlists`,
    playlist: `https://api.spotify.com/v1/playlists/${id}`,
    tracks: `https://api.spotify.com/v1/playlists/${id}/tracks`,
  }

  try {
    // Make a GET request to the Spotify API endpoint
    const response = await axios.get(endpoints[reqType], {
      headers: {
        Authorization: `Bearer ${gAccessToken}`,
      },
    })

    // Return the playlist data from the response
    let cleanData
    switch (reqType) {
      case 'categoryPlaylists':
        cleanData = _cleanCategoryPlaylistsData(response.data)
        break
      case 'playlist':
        cleanData = _cleanPlaylistsData(response.data)
        break
      case 'tracks':
        cleanData = _cleanPlaylistsTracksData(response.data)
        break
    }

    return cleanData
  } catch (error) {
    console.error(
      'Error retrieving data:',
      error.response ? error.response.data : error.message
    )
    throw error
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
    gAccessToken = data.access_token
    // return { accessToken, expiresIn }
  } catch (error) {
    console.error(
      'Error retrieving access token:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

function _cleanCategoryPlaylistsData(data) {
  return data.playlists.items.map((categoryPlaylist) => {
    return {
      spotifyId: categoryPlaylist.id,
      name: categoryPlaylist.name,
      description: categoryPlaylist.description,
      image: categoryPlaylist.images[0].url,
    }
  })
}

function _cleanPlaylistsData(data) {
    return {
      name: data.name,
      description: data.description,
      image: data.images[0].url,
    }
}

function _cleanPlaylistsTracksData(data) {
  return data.items.map((item) => {
    return {
      addedAt: item.added_at,
      id: item.track.id,
      title: item.track.name,
      artists: _cleanArtists(item.track.artists),
      imgUrl: item.track.album.images[0].url,
      formalDuration: item.track.duration_ms,
      album: item.track.album.name,
      youtubeId: '',
    }
  })
}

function _cleanArtists(artists) {
  return artists.map((artist) => artist.name)
}

module.exports = {
  getSpotifyItems,
}
