const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
  origin: 'https://us-roots-repository-server.herokuapp.com/',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

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
