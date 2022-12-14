# Capstone-US-Roots-Repository-f28

### Short Description
* With this app users can basically paginate through communities by U.S. counties,
and see the history of the community they are interested in seeing right within
the app. Users can visit the wiki page where it is sourced from. Users can also enter an alias and bookmark the history snippet for later viewing, as long as they are "logged in" as that alias. Bookmarks can be removed in the Bookmarks tab. This was made possible via the Wikipedia Action API.

### How to use

#### Option 1:
1. Visit the website [here](https://us-roots-repository.netlify.app/)

#### Option 2:
1. Clone repository to local system
2. Install dependencies
3. Modify in client index.js 'localBaseURL' to run locally
3. Run app on local server with node/nodemon

#### Upon successful load of the app:
* (Optional to view/store bookmarks) Enter an alias name
* Select a state with dropdown and run "Show State Counties"
* Select a county to view communities
* Select a community to view its history
* Visit wikipedia page via 'Visit Wiki Page' or Bookmark via bookmark icon
* View Bookmarks via top-right 'Bookmarks' tab
* In left panel of bookmarks tab click a bookmark link and card info
will load in right panel
* From bookmark tab, bookmark is removable by clicking bookmark icon
5. Have fun viewing communities, most U.S. communities are available to view info
aside from those not properly listed through Action API.

### Tech stack
1. Javascript - DOM Manipulation galore
2. HTML - Populate page with elements
3. CSS - Makes a servicable looking page, makes good use of display:none
4. Node.js - Enables server hosting
5. Express.js - Enables back-end requests, and cors
6. Axios - Making CRUD easier

### View Demo Image and (Pre-Alias-Feature) Video
<a href="https://player.vimeo.com/video/757356941?h=ac16bdbf5d
" target="_blank"><img src="https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1521223353-a8fbfc5f216fc748e8a45663c542cbc1eb5ee21cf131963689de3aaa3a5e8f4f-d_200x150&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png" 
alt="U.S. Roots Repository Image Link to Demo Video" width="200" height="150" border="10" /></a>
