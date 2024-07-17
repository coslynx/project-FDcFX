```javascript
const { Collection } = require('discord.js');

module.exports = class QueueManager {
  constructor() {
    this.queues = new Collection();
  }

  getQueue(guildId) {
    return this.queues.get(guildId);
  }

  createQueue(guildId, voiceChannel) {
    const queue = {
      guildId,
      voiceChannel,
      songs: [],
      playing: false,
      volume: 100,
      repeat: false,
      loop: false,
      currentSong: null,
      connection: null
    };

    this.queues.set(guildId, queue);
    return queue;
  }

  async addSong(guildId, song) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    queue.songs.push(song);
    return queue;
  }

  async removeSong(guildId, songIndex) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    if (songIndex > queue.songs.length || songIndex < 0) return;

    queue.songs.splice(songIndex, 1);
    return queue;
  }

  async clearQueue(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    queue.songs = [];
    return queue;
  }

  async getNextSong(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    if (queue.repeat && queue.songs.length > 0) {
      return queue.songs[0];
    } else if (queue.loop && queue.currentSong) {
      return queue.currentSong;
    } else if (queue.songs.length > 0) {
      return queue.songs.shift();
    } else {
      return null;
    }
  }

  async shuffleQueue(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    for (let i = queue.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue.songs[i], queue.songs[j]] = [queue.songs[j], queue.songs[i]];
    }

    return queue;
  }

  async setVolume(guildId, volume) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    if (volume < 0 || volume > 100) return;

    queue.volume = volume;
    return queue;
  }

  async toggleRepeat(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    queue.repeat = !queue.repeat;
    return queue;
  }

  async toggleLoop(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue) return;

    queue.loop = !queue.loop;
    return queue;
  }
};
```