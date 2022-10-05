const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));

const {
  storeBookmarkObj,
  getBookmarks,
  deleteBookmark,
} = require('./controller');

app.post('/api/bookmarks', storeBookmarkObj);
app.get('/api/bookmarks', getBookmarks);
app.delete('/api/bookmarks/:id', deleteBookmark);

app.listen(4000, () => console.log('Server running on 4000'));
