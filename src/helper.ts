var base64Img = require('base64-img');

export function getImageData(filename: string) {
    return base64Img.base64Sync(filename);
}
