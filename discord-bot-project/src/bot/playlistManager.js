```javascript
const mongoose = require('mongoose');
const Playlist = require('../database/models/Playlist');

module.exports = {
  async createPlaylist(guildId, userId, playlistName, initialSongs = []) {
    try {
      const newPlaylist = new Playlist({
        guildId,
        ownerId: userId,
        name: playlistName,
        songs: initialSongs,
      });

      await newPlaylist.save();
      return newPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },

  async addSongToPlaylist(playlistId, song) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      playlist.songs.push(song);
      await playlist.save();
      return playlist;
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      throw error;
    }
  },

  async removeSongFromPlaylist(playlistId, songIndex) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      playlist.songs.splice(songIndex, 1);
      await playlist.save();
      return playlist;
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      throw error;
    }
  },

  async editPlaylist(playlistId, newName, newSongs) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      playlist.name = newName || playlist.name;
      playlist.songs = newSongs || playlist.songs;
      await playlist.save();
      return playlist;
    } catch (error) {
      console.error('Error editing playlist:', error);
      throw error;
    }
  },

  async getPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return playlist;
    } catch (error) {
      console.error('Error getting playlist:', error);
      throw error;
    }
  },

  async getPlaylistsByUser(userId) {
    try {
      const playlists = await Playlist.find({ ownerId: userId });
      return playlists;
    } catch (error) {
      console.error('Error getting playlists by user:', error);
      throw error;
    }
  },

  async getPlaylistsByGuild(guildId) {
    try {
      const playlists = await Playlist.find({ guildId });
      return playlists;
    } catch (error) {
      console.error('Error getting playlists by guild:', error);
      throw error;
    }
  },

  async sharePlaylist(playlistId, sharedUserId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      if (!playlist.sharedWith.includes(sharedUserId)) {
        playlist.sharedWith.push(sharedUserId);
        await playlist.save();
      }

      return playlist;
    } catch (error) {
      console.error('Error sharing playlist:', error);
      throw error;
    }
  },

  async unsharePlaylist(playlistId, sharedUserId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      const index = playlist.sharedWith.indexOf(sharedUserId);
      if (index !== -1) {
        playlist.sharedWith.splice(index, 1);
        await playlist.save();
      }

      return playlist;
    } catch (error) {
      console.error('Error unsharing playlist:', error);
      throw error;
    }
  },

  async deletePlaylist(playlistId) {
    try {
      const playlist = await Playlist.findByIdAndDelete(playlistId);

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return playlist;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  },
};
```