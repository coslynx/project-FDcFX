```javascript
const { MessageEmbed } = require('discord.js');
const musicPlayer = require('./musicPlayer');
const queueManager = require('./queueManager');
const playlistManager = require('./playlistManager');
const searchModule = require('./searchModule');

const prefix = process.env.BOT_PREFIX || '!';

module.exports = {
  parseCommand: (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    return { command, args };
  },

  executeCommand: async (message, command, args) => {
    try {
      switch (command) {
        case 'play':
          const query = args.join(' ');
          if (!query) {
            message.channel.send('Please provide a song or playlist to play.');
            return;
          }

          const voiceChannel = message.member.voice.channel;
          if (!voiceChannel) {
            message.channel.send('You need to be in a voice channel to play music.');
            return;
          }

          const searchResults = await searchModule.searchYouTube(query);
          if (searchResults.length === 0) {
            message.channel.send('No results found.');
            return;
          }

          const song = searchResults[0];
          const serverQueue = queueManager.getQueue(message.guild.id);

          if (!serverQueue) {
            const newQueue = queueManager.createQueue(message.guild.id, voiceChannel);
            queueManager.setQueue(message.guild.id, newQueue);
            musicPlayer.joinVoiceChannel(voiceChannel);
            queueManager.addSong(message.guild.id, song);
            musicPlayer.playMusic(message.guild.id);
          } else {
            queueManager.addSong(message.guild.id, song);
            message.channel.send(`Added ${song.title} to the queue.`);
          }
          break;

        case 'pause':
          const serverQueuePause = queueManager.getQueue(message.guild.id);
          if (!serverQueuePause) {
            message.channel.send('There is no song playing.');
            return;
          }
          musicPlayer.pauseMusic(message.guild.id);
          message.channel.send('Music paused.');
          break;

        case 'resume':
          const serverQueueResume = queueManager.getQueue(message.guild.id);
          if (!serverQueueResume) {
            message.channel.send('There is no song playing.');
            return;
          }
          musicPlayer.resumeMusic(message.guild.id);
          message.channel.send('Music resumed.');
          break;

        case 'skip':
          const serverQueueSkip = queueManager.getQueue(message.guild.id);
          if (!serverQueueSkip) {
            message.channel.send('There is no song playing.');
            return;
          }
          musicPlayer.skipMusic(message.guild.id);
          message.channel.send('Skipped to the next song.');
          break;

        case 'stop':
          const serverQueueStop = queueManager.getQueue(message.guild.id);
          if (!serverQueueStop) {
            message.channel.send('There is no song playing.');
            return;
          }
          musicPlayer.stopMusic(message.guild.id);
          message.channel.send('Music stopped.');
          break;

        case 'volume':
          const serverQueueVolume = queueManager.getQueue(message.guild.id);
          if (!serverQueueVolume) {
            message.channel.send('There is no song playing.');
            return;
          }
          const volume = parseInt(args[0]);
          if (isNaN(volume)) {
            message.channel.send('Please provide a valid volume number.');
            return;
          }
          musicPlayer.adjustVolume(message.guild.id, volume);
          message.channel.send(`Volume set to ${volume}%`);
          break;

        case 'queue':
          const serverQueueQueue = queueManager.getQueue(message.guild.id);
          if (!serverQueueQueue) {
            message.channel.send('There is no song in the queue.');
            return;
          }
          const queueEmbed = new MessageEmbed()
            .setTitle('Current Queue')
            .setDescription(serverQueueQueue.songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n'));
          message.channel.send({ embeds: [queueEmbed] });
          break;

        case 'createplaylist':
          if (!args[0]) {
            message.channel.send('Please provide a name for the playlist.');
            return;
          }
          const playlistName = args.join(' ');
          playlistManager.createPlaylist(message.author.id, playlistName)
            .then(playlist => {
              message.channel.send(`Playlist ${playlist.name} created successfully!`);
            })
            .catch(error => {
              message.channel.send(`Error creating playlist: ${error.message}`);
            });
          break;

        case 'addplaylist':
          if (!args[0] || !args[1]) {
            message.channel.send('Please provide a playlist name and a song to add.');
            return;
          }
          const playlistNameAdd = args[0];
          const songToAdd = args.slice(1).join(' ');
          playlistManager.addSongToPlaylist(message.author.id, playlistNameAdd, songToAdd)
            .then(playlist => {
              message.channel.send(`Song added to playlist ${playlistNameAdd}!`);
            })
            .catch(error => {
              message.channel.send(`Error adding song to playlist: ${error.message}`);
            });
          break;

        case 'removeplaylist':
          if (!args[0] || !args[1]) {
            message.channel.send('Please provide a playlist name and a song to remove.');
            return;
          }
          const playlistNameRemove = args[0];
          const songToRemove = args.slice(1).join(' ');
          playlistManager.removeSongFromPlaylist(message.author.id, playlistNameRemove, songToRemove)
            .then(playlist => {
              message.channel.send(`Song removed from playlist ${playlistNameRemove}!`);
            })
            .catch(error => {
              message.channel.send(`Error removing song from playlist: ${error.message}`);
            });
          break;

        case 'editplaylist':
          if (!args[0] || !args[1]) {
            message.channel.send('Please provide a playlist name and the new name/songs to edit.');
            return;
          }
          const playlistNameEdit = args[0];
          const newNameOrSongs = args.slice(1).join(' ');
          playlistManager.editPlaylist(message.author.id, playlistNameEdit, newNameOrSongs)
            .then(playlist => {
              message.channel.send(`Playlist ${playlistNameEdit} updated successfully!`);
            })
            .catch(error => {
              message.channel.send(`Error updating playlist: ${error.message}`);
            });
          break;

        case 'loadplaylist':
          if (!args[0]) {
            message.channel.send('Please provide the name of the playlist to load.');
            return;
          }
          const playlistToLoad = args.join(' ');
          playlistManager.loadPlaylist(message.author.id, playlistToLoad)
            .then(playlist => {
              message.channel.send(`Loading playlist ${playlist.name}...`);
              const voiceChannel = message.member.voice.channel;
              if (!voiceChannel) {
                message.channel.send('You need to be in a voice channel to play music.');
                return;
              }
              const serverQueuePlaylist = queueManager.getQueue(message.guild.id);
              if (!serverQueuePlaylist) {
                const newQueuePlaylist = queueManager.createQueue(message.guild.id, voiceChannel);
                queueManager.setQueue(message.guild.id, newQueuePlaylist);
                musicPlayer.joinVoiceChannel(voiceChannel);
                playlist.songs.forEach(song => {
                  queueManager.addSong(message.guild.id, song);
                });
                musicPlayer.playMusic(message.guild.id);
                message.channel.send(`Playlist ${playlist.name} loaded successfully!`);
              } else {
                playlist.songs.forEach(song => {
                  queueManager.addSong(message.guild.id, song);
                });
                message.channel.send(`Playlist ${playlist.name} added to the queue!`);
              }
            })
            .catch(error => {
              message.channel.send(`Error loading playlist: ${error.message}`);
            });
          break;

        case 'shareplaylist':
          if (!args[0]) {
            message.channel.send('Please provide the name of the playlist to share.');
            return;
          }
          const playlistToShare = args.join(' ');
          playlistManager.sharePlaylist(message.author.id, playlistToShare)
            .then(playlist => {
              message.channel.send(`Playlist ${playlistToShare} shared! You can use this link: ${playlist.shareLink}`);
            })
            .catch(error => {
              message.channel.send(`Error sharing playlist: ${error.message}`);
            });
          break;

        case 'join':
          const voiceChannelJoin = message.member.voice.channel;
          if (!voiceChannelJoin) {
            message.channel.send('You need to be in a voice channel first.');
            return;
          }
          musicPlayer.joinVoiceChannel(voiceChannelJoin);
          message.channel.send('Joined the voice channel!');
          break;

        case 'leave':
          const serverQueueLeave = queueManager.getQueue(message.guild.id);
          if (!serverQueueLeave) {
            message.channel.send('I am not in a voice channel.');
            return;
          }
          musicPlayer.leaveVoiceChannel(message.guild.id);
          message.channel.send('Left the voice channel.');
          break;

        default:
          message.channel.send('Invalid command.');
          break;
      }
    } catch (error) {
      message.channel.send(`An error occurred: ${error.message}`);
      console.error(error);
    }
  },
};

```