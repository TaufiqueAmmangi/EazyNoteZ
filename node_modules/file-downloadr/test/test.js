const assert = require('assert');
const path = require('path')
const fdownload = require('../src/index')


const downloadUrlFood = 'http://lorempixel.com/500/500/food/';

describe('Download test ', () => {

    it('should download the file using promise api', (done) => {

        fdownload(downloadUrlFood, path.join(__dirname, 'food.jpg')).then((res) => {


                done();
            })
            .catch(err => {
                done(err);
            })

    })


    it('should download file usinc async/await ', async function () {

        let result = await fdownload(downloadUrlFood, path.join(__dirname, 'food1.jpg'))

    })
})