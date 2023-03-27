const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';

https.get(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    const originObj =  JSON.parse(data)
    const wallpapers = originObj.images
    const firstWallpaper = wallpapers.length > 0 ? wallpapers[0] : null
    const imageUrl = `https://www.bing.com${firstWallpaper?.url}`;
    const filename = path.basename(`${firstWallpaper?.title}${firstWallpaper?.fullstartdate}.jpg`);

    https.get(imageUrl, (response) => {
      response.pipe(fs.createWriteStream(filename));
    });
  });
}).on('error', (error) => {
  console.error(error);
});
