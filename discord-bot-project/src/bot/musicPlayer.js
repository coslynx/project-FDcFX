```javascript
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { default: axios } = require('axios');

module.exports = {
  // Function to join a voice channel
  joinVoiceChannel: async (interaction, guild, channelId) => {
    try {
      const channel = guild.channels.cache.get(channelId);
      if (!channel) {
        return interaction.reply({ content: 'Invalid voice channel provided.', ephemeral: true });
      }

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });
      return connection;
    } catch (error) {
      console.error('Error joining voice channel:', error);
      return interaction.reply({ content: 'Failed to join voice channel.', ephemeral: true });
    }
  },

  // Function to play music
  playMusic: async (interaction, connection, queue, musicPlayer, track) => {
    try {
      const audioPlayer = musicPlayer.player;
      const queueManager = queue.queueManager;

      // Download and create audio resource
      const audioResource = createAudioResource(
        await ytdl(track.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }),
        {
          inputType: StreamType.Opus,
          inlineVolume: true,
        }
      );

      // Set volume for the audio resource
      audioResource.volume.setVolume(musicPlayer.volume);

      // Handle playback end event
      audioPlayer.on('stateChange', (oldState, newState) => {
        if (newState.status === 'idle' && queueManager.current === track) {
          queueManager.nextSong();
          this.playMusic(interaction, connection, queue, musicPlayer, queueManager.current);
        }
      });

      // Handle error event
      audioPlayer.on('error', (error) => {
        console.error('Error playing music:', error);
        interaction.reply({ content: 'Error playing music. Please try again.', ephemeral: true });
      });

      // Play the music
      audioPlayer.play(audioResource);
      connection.subscribe(audioPlayer);
    } catch (error) {
      console.error('Error playing music:', error);
      return interaction.reply({ content: 'Failed to play music.', ephemeral: true });
    }
  },

  // Function to pause the music
  pauseMusic: async (interaction, musicPlayer) => {
    try {
      const audioPlayer = musicPlayer.player;
      audioPlayer.pause();
      interaction.reply({ content: 'Music paused.' });
    } catch (error) {
      console.error('Error pausing music:', error);
      return interaction.reply({ content: 'Failed to pause music.', ephemeral: true });
    }
  },

  // Function to resume the music
  resumeMusic: async (interaction, musicPlayer) => {
    try {
      const audioPlayer = musicPlayer.player;
      audioPlayer.unpause();
      interaction.reply({ content: 'Music resumed.' });
    } catch (error) {
      console.error('Error resuming music:', error);
      return interaction.reply({ content: 'Failed to resume music.', ephemeral: true });
    }
  },

  // Function to skip to the next song
  skipMusic: async (interaction, queue, musicPlayer) => {
    try {
      const queueManager = queue.queueManager;
      queueManager.nextSong();
      const currentTrack = queueManager.current;
      if (currentTrack) {
        this.playMusic(interaction, queueManager.connection, queue, musicPlayer, currentTrack);
        interaction.reply({ content: `Skipped to the next song: ${currentTrack.title}` });
      } else {
        interaction.reply({ content: 'No more songs in the queue.' });
      }
    } catch (error) {
      console.error('Error skipping music:', error);
      return interaction.reply({ content: 'Failed to skip music.', ephemeral: true });
    }
  },

  // Function to stop the music
  stopMusic: async (interaction, queue, musicPlayer) => {
    try {
      const audioPlayer = musicPlayer.player;
      audioPlayer.stop();
      const queueManager = queue.queueManager;
      queueManager.clearQueue();
      interaction.reply({ content: 'Music stopped and queue cleared.' });
    } catch (error) {
      console.error('Error stopping music:', error);
      return interaction.reply({ content: 'Failed to stop music.', ephemeral: true });
    }
  },

  // Function to adjust the volume
  adjustVolume: async (interaction, musicPlayer, volume) => {
    try {
      musicPlayer.volume = volume;
      const audioPlayer = musicPlayer.player;
      audioPlayer.volume.setVolume(volume / 100);
      interaction.reply({ content: `Volume set to ${volume}%` });
    } catch (error) {
      console.error('Error adjusting volume:', error);
      return interaction.reply({ content: 'Failed to adjust volume.', ephemeral: true });
    }
  },

  // Function to get track information from YouTube
  getTrackInfo: async (url) => {
    try {
      const info = await ytdl.getInfo(url);
      return {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        thumbnail: info.videoDetails.thumbnails[0].url,
        url: info.videoDetails.video_url,
      };
    } catch (error) {
      console.error('Error getting track info:', error);
      return null;
    }
  },

  // Function to get track information from Spotify
  getSpotifyTrackInfo: async (trackId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      });
      return {
        title: response.data.name,
        author: response.data.artists[0].name,
        url: response.data.external_urls.spotify,
      };
    } catch (error) {
      console.error('Error getting Spotify track info:', error);
      return null;
    }
  },
};

```