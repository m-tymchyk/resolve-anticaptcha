// var base64Img = require('base64-img');
const fs = require('fs');

export function getImageData(filename: string) {
    const data = fs.readFileSync(filename);
    return data.toString('base64');

    // return base64Img.base64Sync(filename);
}
