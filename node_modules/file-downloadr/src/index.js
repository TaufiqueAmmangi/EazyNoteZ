/**
 * file-downloadr 
 * A Simple library to download file and save to disk
 * Author : Sarath TK <Saratonite>
 * https://sarath.tk  / https://saratonite.github.io
 * 
 */
const fs = require('fs');
const request = require('request');

/**
 * 
 * @param {*} url 
 * @param {*} outputFile 
 * @param {*} options 
 */
async function download(url, outputFile, options) {
    if (!url) return Error('Download url not provided')
    if (!outputFile) return Error('Output file path not provide')

    const _defaultOptions = {
        method: 'GET',
        url: url,
        timeout: 10000 // 10 Sec
    }

    const _customOptions = options || {};

    const reqOptions = Object.assign(_defaultOptions, _customOptions)

    const ws = fs.createWriteStream(outputFile);
    return await new Promise((resolve, reject) => {

        let req = request(reqOptions, (err, res, body) => {

                if (err) {
                    reject(err);
                }
            })
            .pipe(ws);

        ws.on('finish', () => {
            resolve(req);

        })

        ws.on('error', (err) => {
            reject(err);
        })

    })

}



module.exports = download;