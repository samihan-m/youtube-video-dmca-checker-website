//Check for a <yt-formatted-string> with content "Music in this video"
function checkForClaimedMusic(URL, callback) {
  //Get the page data from the URL.
  $.get(`/scrape?url=${URL}`, function(page) { 
      //Assumes there is DMCA music by default --> plays it safe.
      var hasDMCA = true;
      //Assumes the title of the video is empty.
      var title = "";
      //Assumes the thumbnail of the video is null.
      var thumbnail_url = "";

      //The "Music in this video:" box in the description. This is indicative of a claimed song in the video. Avoid this.
      var dmcaIndicator = '{"metadataRowHeaderRenderer":{"content":{"simpleText":"Music in this video"},"hasDividerLine":true}}';

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
            //There is no DMCA music.
            hasDMCA = false;
        }
      }
      catch {
        console.log("The DMCA check process has broken.")
      }

      //Output message
      //console.log("Has DMCA?", hasDMCA);

      videoDetails = {'hasDMCA': hasDMCA, 'title': title, 'thumbnail_url': thumbnail_url};

      callback(videoDetails);
  });
}
