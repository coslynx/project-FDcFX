```javascript
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: Object,
      required: true,
    },
  ],
  sharedWith: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Playlist', playlistSchema);

```