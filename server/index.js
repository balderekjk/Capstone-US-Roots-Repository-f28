const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));

const PORT = process.env.PORT || 4000;

const {
  storeBookmarkObj,
  getBookmarks,
  deleteBookmark,
} = require('./controller');

app.post('/api/bookmarks', storeBookmarkObj);
app.get('/api/bookmarks', getBookmarks);
app.delete('/api/bookmarks/:id', deleteBookmark);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
