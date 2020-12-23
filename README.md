# youtube-video-dmca-checker-website
<b>Try it out free here!</b>
https://dmcachecker.com

 A free-to-use website that checks if a given video is marked by YouTube as containing claimed music, which could lead to a DMCA takedown if played during a livestream on a platform like Twitch.
 
 <b>The Method the Site Uses To Confirm/Deny DMCA Music</b>
 
Assumes that the presence of the "Music in this video:" header means that YouTube has identified claimed music (I think this is a fair assumption).

Also assumes that the lack of the "Music in this video:" header means that YouTube views the video as free of music that could lead to DMCA. (Not as certain. Pretty certain, but not entirely).

So, the website checks the YouTube page for that header, and if it is present, then it tells the user the video has DMCA music. If no header is found, then it tells the user the video is safe.

 <b>Other Information</b>
 
Uses NodeJS. Whenever a YouTube URL is searched by the user, the website creates a HTTP request to read the source-view of the YouTube page with that URL. It scans for title, thumbnail, and the "Music in this video:" header in the video's description.

