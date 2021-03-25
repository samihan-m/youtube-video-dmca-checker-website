async function checkForClaimedMusic(URL, callback) {
  //YouTube API doesn't actually tell you anything about copyright. The licensedContent boolean doesn't mean what I thought it did. The old version is still the useful version.
  /*
  //The new version which uses YouTube's API and checks for licensedContent boolean. This check is accurate for auto-generated videos as well.

  //Setting API key.
  var apiKey = "AIzaSyCqJpNU68t5Hu7EXO5bV0S5YcH4_HVkNig";

  //Setting the response object to null as default.
  var youtubeResponse = null;

  //Ripped Google's sample API code
  function loadClient() {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails,statistics"
      ],
      "id": [
        videoID
      ]
    })
    .then(function(response) {
            //Handle the results here (response.result has the parsed body).
            //Get the first video in the result.items array (an array of all videos with the given videoID - that means just 1 video will be returned, and it's the one we need)
            youtubeResponse = response.result.items[0];
            console.log(response.result);
          },
          function(err) {
              console.error("Execute error", err); 
          });
  }

  //Prepare api object with auth key
  await loadClient();
  //Perform api call
  await execute();
  //youtubeResponse now holds the response.

  //Get information from the response.
  try {
    //A variable that is passed to the web browser, stating if this process broke or not.
    var broken = false;

    //First, check if a valid response returned.
    if(youtubeResponse == null) {
      //Bad response. Throw an error to alert user the check broke.
      throw "Bad response. Not your fault, YouTube's fault :)";
    }

    //Grab video details from response object.
    var videoDetails = youtubeResponse.snippet;
    var title = videoDetails.title;
    var thumbnailURL = videoDetails.thumbnails.standard.url;

    //Check if video has licensed music.
    var hasLicensedContent =  youtubeResponse.contentDetails.licensedContent;
  }
  catch (e){
    console.log("The DMCA check process has broken.")
    //Log the error
    console.log(e);
    //Set the broken variable to true. This is checked by the html page to see if the data should be trusted.
    broken = true;
  }

  //Output message
  //console.log("Has DMCA?", hasDMCA);

  videoDetails = {'hasDMCA': hasLicensedContent, 'title': title, 'thumbnail_url': thumbnailURL, 'broken': broken};

  callback(videoDetails);
  */

  //The old version which scanned the raw html for indicators
  //Check for a <yt-formatted-string> with content "Music in this video"
  //Get the page data from the URL.
  $.get(`/scrape?url=${URL}`, function(page) { 
      //Assumes there is DMCA music by default --> plays it safe.
      var hasDMCA = true;
      //A variable to see if the test process broke along the way.
      var broken = false;
      //Assumes the title of the video is empty.
      var title = "";
      //Assumes the thumbnail of the video is null.
      var thumbnail_url = "";

      //The "Music in this video:" box in the description. This is indicative of a claimed song in the video. Avoid this.
      //var dmcaIndicator = '{"metadataRowHeaderRenderer":{"content":{"simpleText":"Music in this video"},"hasDividerLine":true}}';
      var dmcaIndicator = '":"Music in this video"'

      try {
        //Find where the title is based on the location of the indicators
        let titleStartIndicator = '<title>';
        let titleEndIndicator = '</title>';
        //titleStartPosition is incremented by the length of titleStartIndicator to exclude the titleStartIndicator
        let titleStartPosition = page.indexOf(titleStartIndicator) + titleStartIndicator.length;
        let titleEndPosition = page.indexOf(titleEndIndicator);

        //Scrape the title
        title = page.substring(titleStartPosition, titleEndPosition);

        //Generate the thumbnail link
        //Find where the videoID is based on the location of the indicator
        var thumbnailURLIndicator = '"videoDetails":{"videoId":"';
        //videoIDPosition is incremented by thumbnailURLIndicator.length to exclude the thumbnailURLIndicator
        let videoIDPosition = page.indexOf(thumbnailURLIndicator) + thumbnailURLIndicator.length;
        //The videoID is 11 characters long.
        let videoIDLength = 11;
        //Scrape the videoID
        let videoID = page.substring(videoIDPosition, videoIDPosition + videoIDLength)
        //Fill in the default URL with the videoID 
        //thumbnail_url = `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`;
        thumbnail_url = `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`;

        //Search for the dmcaIndicator
        let dmcaIndicatorPosition = page.indexOf(dmcaIndicator);
        //Check if the dmcaIndicator is on the page.
        if(dmcaIndicatorPosition == -1) {
            //Check if the channel is an auto-generated by YouTube channel.
            //Those do not contain the "Music in this video:" header, so they require separate checks.

            //Check for EITHER/OR of these indicators. They appear in most topic channels.
            let providedMusicIndicator = "Provided to YouTube by "
            let autoGeneratedChannelIndicator = "Auto-generated by YouTube."

            //If neither of those indicators are present, assume the video is safe from DMCA.
            if(page.indexOf(providedMusicIndicator) == -1 && page.indexOf(autoGeneratedChannelIndicator) == -1) {
              //There is no DMCA music.
              hasDMCA = false;
            }
        }
      }
      catch {
        console.log("The DMCA check process has broken.")
        //Set the broken variable to true. This is checked by the html page to see if the data should be trusted.
        broken = true;
      }

      //Output message
      //console.log("Has DMCA?", hasDMCA);

      videoDetails = {'hasDMCA': hasDMCA, 'title': title, 'thumbnail_url': thumbnail_url, 'broken': broken};

      callback(videoDetails);
  });
}
