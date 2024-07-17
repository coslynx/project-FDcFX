# Discord Music Bot

This project aims to create a Discord bot capable of playing music for users. The bot will be an essential addition to Discord servers, providing a user-friendly way to listen to music together.

## Features:

* **Music Playback:**
    * Play, pause, resume, skip, stop, and adjust volume.
    * Voice channel integration.
* **Playlist Management:**
    * Create, edit, and delete playlists.
    * Share playlists with other users.
* **Queue System:**
    * Add, remove, and reorder songs in the queue.
* **Search Functionality:**
    * Search for music on YouTube and Spotify.
* **Looping and Repeat:**
    * Loop a song or repeat a playlist.
* **User Permissions:**
    * Role-based control to limit access to commands.
* **Integration with Music Platforms:**
    * Spotify and YouTube integration for music playback.
* **Customization Options:**
    * Playback quality settings and equalizer adjustments.
* **Web Interface:**
    * Optional web interface for playlist management and settings.

## Tech Stack:

* **Programming Language:** JavaScript (Node.js)
* **Framework:** Discord.js
* **Database:** MongoDB (using Mongoose)
* **Packages:**
    * discord.js
    * ytdl-core
    * dotenv
    * express
    * cors
    * node-spotify-api
    * @types/node
    * @types/express
    * @types/cors
* **APIs:**
    * Discord API
    * Spotify API
    * YouTube Data API

## Installation:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/discord-music-bot.git
   ```
2. **Install dependencies:**
   ```bash
   cd discord-music-bot
   npm install
   ```
3. **Create a .env file:**
   - Copy the `.env.example` file to `.env`.
   - Fill in the required environment variables (Discord bot token, Spotify API credentials, MongoDB URI).
4. **Start the bot:**
   ```bash
   npm start
   ```

## Usage:

* **Commands:**
    * `/play <song name>`: Plays a song.
    * `/pause`: Pauses the current song.
    * `/resume`: Resumes the current song.
    * `/skip`: Skips to the next song in the queue.
    * `/stop`: Stops the current song and clears the queue.
    * `/volume <number>`: Adjusts the volume (0-100).
    * `/queue`: Displays the current song queue.
    * `/playlist <command>`: Manage playlists (create, add, remove, etc.).
    * `/search <query>`: Searches for music on YouTube and Spotify.
    * `/loop`: Toggles song looping.
    * `/repeat`: Toggles playlist repetition.
* **Web Interface:**
    - (Optional) Access the web interface to manage playlists and settings.

## Contribution:

Contributions are welcome! Please open an issue or submit a pull request.

## License:

This project is licensed under the MIT License.

## Disclaimer:

This project is for educational purposes and should not be used for any commercial purposes.
