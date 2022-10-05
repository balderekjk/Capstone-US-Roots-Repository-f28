let bookmarks = require('./db.json');

module.exports = {
  storeBookmarkObj: (req, res) => {
    const { id, page, sectionId } = req.body;
    if (bookmarks.findIndex((bookmark) => bookmark['id'] === id) === -1) {
      let newBookmark = {
        id: id,
        page: page,
        sectionId: sectionId,
      };
      bookmarks.push(newBookmark);
      res.status(200).send(bookmarks);
    } else {
      res.status(409).send('That bookmark already exists.');
    }
  },

  getBookmarks: (req, res) => {
    res.status(200).send(bookmarks);
  },

  deleteBookmark: (req, res) => {
    let index = bookmarks.findIndex((elem) => elem.id === req.params.id);
    bookmarks.splice(index, 1);
    res.status(200).send(bookmarks);
  },
};
