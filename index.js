const {readFile} = require('fs').promises;
const express = require('express');
const app = express();
const port = 3000;

//Used to fetch external site pages.
const fetch = require('node-fetch');

//File location for sendFile
//Files need to be in a separate folder- they cannot be in the root directory, or strange behavior with URL forwarding happens.
const page_root = __dirname + '/pages/'

//Making it so that page file extensions (html) don't show up in the URL
app.use(express.static('.', {
    extensions: ['html', 'htm']
}));

//Formerly used this so that youtube videoIDs retained case sensitivity when using them for routing.
//Not using this anymore because I am not routing based on the videoID anymore.
//app.set('case sensitive routing', true);

var pageVisitCount = 0;

//The home page.
app.get('/', async (request, response) => {
    //console.log("HOME PAGE");

    //Counting the number of visits
    pageVisitCount++;
    console.log(`Visit count: ${pageVisitCount}`);

    //Show the main page.
    response.sendFile('home.html', {root: page_root});

    //readFile does not work here. If used, the page hangs indefinitely.
});

//Disabled the watch page because I'd rather people watch the video on YouTube.
/*
//The watch page.
app.get('/watch', async (request, response) => {
    //console.log("WATCH PAGE")
    
    let videoID = request.query.v;

    //No search term given - redirect to main page.
    if(videoID == null) {
        response.redirect(307, '/')
    }
    //Load the page.
    else {
        response.sendFile('view_video.html', {root: page_root});
    } 
});
*/

//Allows client to read pages from other sites without any CORS errors.
app.get('/scrape', async (request, response) => {
    let URL = request.query.url;

    //No URL given - redirect to main page.
    if(URL == null) {
        response.redirect(307, '/')
    }
    //Load the given page.
    else {
        fetch(URL)
        .then(response => response.text())
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.send(err);
        });
    }
});


//testing example
app.get('/example', async (request, response) => {

    response.sendFile('example.html', {root: page_root});
})


//Catch all other URLs and redirect to main page.
app.get('*', async (request, response) => {
    //console.log("CATCH-ALL REDIRECT")

    //Need to subtract visit count by 1 or else it procs the pageVisitCount++ in the app.get('/')
    pageVisitCount--;

    //Redirect to the main page.
    response.redirect(307, '/')
})

app.listen(process.env.PORT || port, () => console.log(`App available on http://localhost:${port}`));