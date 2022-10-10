const linksShell = document.getElementById('links-shell');
const contentShell = document.querySelector('.content-shell');
const bookmarksContentShell = document.querySelector(
  '.bookmarks-content-shell'
);
const stateSubmit = document.getElementById('us-state-select');
const statesSelect = document.getElementById('states-select');
const pageName = document.getElementById('page-name');
const bookmarkToggle = document.getElementById('bookmark-toggle');
const bookmarkViewer = document.getElementById('bookmark-viewer');
const regionsBrowser = document.getElementById('regions-browser');
const bookmarksListBox = document.getElementById('bookmarks-list-box');
const bookmarkTitle = document.getElementById('bookmark-title');
const usMap = document.querySelector('img');
const aliasButton = document.getElementById('alias-btn');
const aliasInput = document.getElementById('alias-input');
const aliasSuccess = document.getElementById('alias-success');
const home = document.getElementById('home');
const baseURL = 'https://en.wikipedia.org/w/api.php';
const localBaseURL = 'https://us-roots-repository-server.herokuapp.com/api';

let pageAlert = '';
let parsedStorage = null;
let bookmarkVisible = false;
let currentAlias = '';
let counter = 0;
let sectionNACounter = 0;
let bookmarkId = 0;
let currentState = '';
let currentCounty = '';

const populateLocalAPI = () => {
  let itemVals = Object.keys(localStorage);
  itemVals.forEach((item) => {
    parsedStorage = JSON.parse(localStorage.getItem(item));
    if (parsedStorage.alias === currentAlias) {
      storeBookmarkObj(parsedStorage);
    }
  });
};

home.addEventListener('click', () => {
  bookmarkVisible = false;
  bookmarkViewer.classList.add('hidden');
  regionsBrowser.classList.remove('hidden');
});

bookmarkToggle.addEventListener('click', () => {
  if (bookmarkVisible === false) {
    getBookmarks();
    bookmarkViewer.classList.remove('hidden');
    regionsBrowser.classList.add('hidden');
  } else {
    bookmarkViewer.classList.add('hidden');
    regionsBrowser.classList.remove('hidden');
  }
  bookmarkVisible = !bookmarkVisible;
});

stateSubmit.addEventListener('submit', (e) => {
  if (!usMap.classList.contains('hidden')) usMap.classList.add('hidden');
  linksShell.textContent = '';
  linksShell.classList.remove('hidden');
  contentShell.classList.add('hidden');
  currentState = statesSelect.value;
  counter = 0;
  sectionNACounter = 0;
  e.preventDefault();
  printWikiGrouping(
    'List of counties by U.S. state and territory',
    'links',
    '',
    currentState,
    currentState
  );
});

const submitAlias = () => {
  if (aliasInput.value.length >= 4) {
    currentAlias = aliasInput.value;
    populateLocalAPI();
    populateLocalStorage();
    aliasSuccess.textContent = `Status: Now viewing/storing "${aliasInput.value}'s" bookmarks`;
    aliasInput.value = '';
  } else {
    aliasSuccess.textContent = `Status: Please enter at least 3 characters`;
  }
};

aliasButton.addEventListener('click', (e) => {
  submitAlias();
  getBookmarks();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const event = new Event('click');
    aliasButton.dispatchEvent(event);
  }
});

const populateLocalStorage = () => {
  axios.get(`${localBaseURL}/bookmarks`).then((res) => {
    res = res.data;
    res.forEach((bookmark) => {
      if (bookmark.alias === currentAlias) {
        localStorage.setItem(bookmark.id, JSON.stringify(bookmark));
      }
    });
    return;
  });
};

//sectionQueryString i.e. section=3&; if none empty string ''
const getWikiGrouping = (page, propTypes, sectionQueryString) => {
  return axios
    .get(
      `${baseURL}?action=parse&format=json&page=${page}&${sectionQueryString}prop=${propTypes}&disabletoc=1&origin=*`
    )
    .then((res) => {
      return res.data.parse[propTypes];
    });
};

const deleteBookmark = (id) => {
  localStorage.removeItem(id);
  axios
    .delete(`${localBaseURL}/bookmarks/${id}`)
    .then(() => {
      getBookmarks();
    })
    .catch((err) => console.log(err));
};

const getBookmarks = () => {
  axios.get(`${localBaseURL}/bookmarks`).then((res) => {
    res = res.data;
    let displayList = res.filter(
      (bookmark) => bookmark['alias'] === currentAlias
    );
    bookmarksContentShell.classList.remove('containerize');
    bookmarksListBox.textContent = '';
    bookmarksContentShell.textContent = '';
    bookmarkTitle.textContent = '';
    displayList.forEach((rep) => {
      let bookmark = document.createElement('li');
      bookmark.append(rep['page']);
      bookmark.addEventListener('click', () => {
        getWikiGrouping(
          rep['page'],
          'text',
          `section=${rep['sectionId']}&`
        ).then((res) => {
          bookmarkTitle.innerHTML = `<h2>${rep['page']}<br>History</h2> <h4>Feel free to remove bookmark</h4>`;
          bookmarksContentShell.innerHTML = `<div id='bookmark-div'><div><a id='wiki-link-a' href='https://en.wikipedia.org/wiki/${rep['page']}#History' target='_blank' rel='noreferrer noopener'>Visit Wiki Page</a></div><i id="unbookmark" class="fa fa-bookmark-o"></i></div>${res['*']}`;
          bookmarksContentShell.classList.add('containerize');
          let unbookmark = document.getElementById('unbookmark');
          unbookmark.addEventListener('click', () => {
            deleteBookmark(rep['id']);
          });
        });
      });
      bookmarksListBox.append(bookmark);
    });
  });
};

const storeBookmarkObj = (body) => {
  if (currentAlias.length >= 4) {
    axios
      .post(`${localBaseURL}/bookmarks`, body)
      .then((res) => {
        if (pageAlert) {
          pageAlert.textContent = "Nice! View this snippet at 'Bookmarks'";
        }
      })
      .catch((err) => {
        console.log(err);
        if (pageAlert) {
          pageAlert.textContent = 'This mark is already in the book';
        }
      });
  } else {
    pageAlert.textContent = 'Oops... enter an alias first';
  }
};

const createBookmarkObj = (page, sectionId, alias) => {
  let bookmarkData = {
    id: page.concat(alias),
    page: page,
    sectionId: sectionId,
    alias: alias,
  };

  localStorage.setItem(page.concat(alias), JSON.stringify(bookmarkData));
  storeBookmarkObj(bookmarkData);
};

// term applies to term of section to display immediately or filter through first
// optional linkTermFilter is second term to find and display only the links that includes that term
const printWikiGrouping = (
  page,
  propTypes,
  sectionQueryString,
  term,
  linkTermFilter
) => {
  pageName.textContent = '';
  linksShell.style.display = 'none';
  if (counter !== 1) {
    linksShell.style.display = 'grid';
  }
  contentShell.textContent = '';
  let propAttr = '';
  let linkPropType = false;
  let sectionId = 0;

  if (propTypes === 'links' && sectionId === 0) {
    linksShell.style.display = 'none';
    linkPropType = true;
    propTypes = 'sections';
  }

  getWikiGrouping(page, propTypes, sectionQueryString).then((res) => {
    if (propTypes === 'wikitext' || propTypes === 'text') {
      res = res['*'];
      if (counter === 1) {
        contentShell.classList.remove('hidden');
        pageName.innerHTML = `<h2>${page}<br>History</h2> <h4 id="page-alert">Please bookmark if you'd like to revisit</h4>`;
        contentShell.innerHTML = `<div id='bookmark-div'><div id="back-button">\<</div><div><a id='wiki-link-a' href='https://en.wikipedia.org/wiki/${page}#History' target='_blank' rel='noreferrer noopener'>Visit Wiki Page</a></div><i id="bookmark" class="fa fa-bookmark-o"></i></div>${res}`;
        let bookmark = document.getElementById('bookmark');
        let backButton = document.getElementById('back-button');
        pageAlert = document.getElementById('page-alert');
        bookmark.addEventListener('click', () => {
          bookmark.classList.add('activated');
          createBookmarkObj(page, bookmarkId, currentAlias);
        });
        backButton.addEventListener('click', () => {
          if (sectionNACounter < 3) {
            counter = 1;
          } else {
            counter = 0;
          }
          sectionNACounter = 0;
          linksShell.style.display = 'grid';
          contentShell.classList.add('hidden');
          pageName.innerHTML = `<h2>${currentCounty}</h2> <h4>Click location name to view its history</h4>`;
        });
        if (contentShell.textContent.includes('Redirect to')) {
          let slice1 = contentShell.textContent.indexOf(':') + 1;
          let slice2 = 0;
          if (contentShell.textContent.indexOf('.mw') !== -1) {
            slice2 = contentShell.textContent.indexOf('.mw');
          } else if (contentShell.textContent.indexOf('From') !== -1) {
            let substr = contentShell.textContent.substring(slice1);
            let addValue = substr.indexOf('From ') - 1;
            slice2 = slice1 + addValue;
          } else if (contentShell.textContent.indexOf('To ') !== -1) {
            let substr = contentShell.textContent.substring(slice1);
            let addValue = substr.indexOf('To ') - 1;
            slice2 = slice1 + addValue;
          } else {
            slice2 = contentShell.textContent.length - 1;
          }
          let sliced = contentShell.textContent.slice(slice1, slice2);
          printWikiGrouping(sliced, 'sections', '', 'History', '');
        }
      } else {
        contentShell.innerHTML = res;
      }
      contentShell.classList.add('containerize');
    } else if (propTypes === 'sections') {
      propAttr = 'line';
    }
    if (propTypes === 'sections') {
      sectionId =
        res.findIndex((propType) => propType[propAttr].includes(term)) + 1;
      bookmarkId = sectionId;
      if (linkPropType === false) {
        printWikiGrouping(page, 'text', `section=${sectionId}&`, '', '');
      } else if (linkPropType === true) {
        if (counter === 0) {
        }
        propAttr = '*';
        if (sectionId === 0 && sectionNACounter === 0) {
          sectionNACounter = 1;
          printWikiGrouping(page, 'links', '', 'Localities', '');
          return;
        } else if (sectionId === 0 && sectionNACounter === 1) {
          sectionNACounter = 2;
          printWikiGrouping(page, 'links', '', 'Municipalities', '');
          return;
        } else if (sectionId === 0 && sectionNACounter === 2) {
          printWikiGrouping(page, 'sections', '', 'History', '');
          sectionNACounter = 3;
          return;
        }
        getWikiGrouping(page, 'links', `section=${sectionId}&`).then((res) => {
          if (counter === 0) {
            pageName.innerHTML = `<h2>${page}</h2> <h4>Click county name to view its communities</h4>`;
          } else if (counter === 1 && sectionNACounter !== 3) {
            currentCounty = page;
            pageName.innerHTML = `<h2>${page}</h2> <h4>Click location name to view its history</h4>`;
          }
          if (sectionNACounter !== 3) {
            linksShell.textContent = '';
            res.forEach((link) => {
              if (
                !link[propAttr].includes('unicipalit') &&
                !link[propAttr].includes('onsolidated') &&
                !link[propAttr].includes('quivalent') &&
                !link[propAttr].includes('orporated') &&
                !link[propAttr].includes('reservation') &&
                !link[propAttr].includes('ensus') &&
                !link[propAttr].includes('nclaves') &&
                !link[propAttr].includes('town') &&
                !link[propAttr].includes('identifier') &&
                !link[propAttr].includes('List') &&
                !link[propAttr].includes(' code') &&
                !link[propAttr].includes(':') &&
                !link[propAttr].includes('xpedition') &&
                !link[propAttr].includes('township') &&
                !link[propAttr].includes('United States') &&
                link[propAttr] !== 'County' &&
                link[propAttr] !== currentState &&
                link[propAttr] !== `${currentState} (state)` &&
                link['exists'] === ''
              ) {
                if (link[propAttr].includes('Sainte')) {
                  link[propAttr] = link[propAttr].replace('Sainte', 'Ste.');
                }
                if (link[propAttr].includes('Saint')) {
                  link[propAttr] = link[propAttr].replace('Saint', 'St.');
                }
                if (currentState === 'New Hampshire') {
                  if (link[propAttr].includes('Coos ')) {
                    link[propAttr] = link[propAttr].replace('Coos', 'Coös');
                  }
                }
                if (currentState === 'Florida') {
                  if (link[propAttr].includes('Miami-Dade')) {
                    link[propAttr] = link[propAttr].replace(
                      'Miami-Dade County, Florida',
                      'List of communities in Miami-Dade County, Florida'
                    );
                  }
                }
                let propTypeText = document.createElement('p');
                propTypeText.textContent = link[propAttr];
                propTypeText.addEventListener('click', (e) => {
                  if (counter === 0) {
                    printWikiGrouping(
                      e.target.childNodes[0].data,
                      'links',
                      '',
                      'Communities',
                      ''
                    );
                    counter = 1;
                  } else if (counter === 1) {
                    printWikiGrouping(
                      e.target.childNodes[0].data,
                      'sections',
                      '',
                      'History',
                      ''
                    );
                  }
                });
                linksShell.style.display = 'grid';
                linksShell.append(propTypeText);
                linksShell.classList.add('containerize');
              }
            });
          }
        });
      }
    }
  });
};
