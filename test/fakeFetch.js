import { NUM_AVATARS, NUM_IMAGES, MESSAGES } from './message';

const INIT_TIME = new Date().getTime();
const imagePathMap = require('./images/*.jpg');


const getItem = (id) => {
    function pickRandom(a) {
        return a[Math.floor(Math.random() * a.length)];
    }

    return new Promise(function(resolve) {
        const item = {
            id: id,
            avatar: imagePathMap[`avatar${Math.floor(Math.random()*NUM_AVATARS)}`],
            self: Math.random() < 0.1,
            image: Math.random() < 1.0 / 20 ? imagePathMap[`image${Math.floor(Math.random()*NUM_IMAGES)}`] : '',
            time: new Date(Math.floor(INIT_TIME + id*20*1000 + Math.random()*20*1000)),
            message: pickRandom(MESSAGES)
        };

        if(item.image === '') {
            resolve(item);
        }
        const image = new Image();
        image.src = imagePathMap[item.image];
        image.addEventListener('load', function() {
            item.image = image;
            resolve(item);
        });
        image.addEventListener('error', function() {
            item.image = '';
            resolve(item);
        });
    });
};

let nextItem_ = 0;

const fakeFetch = (count) => {
    // Fetch at least 30 or count more objects for display.
    count = Math.max(30, count);
    return new Promise((resolve) => {
        // Assume 50 ms per item.
        setTimeout(function () {
            const items = [];

            for (let i = 0; i < Math.abs(count); i++) {
                items[i] = getItem(nextItem_++);
            }

            Promise.all(items)
                .then((list) => {
                    resolve({
                        hasMore: true,
                        list,
                    });
                });
        }, 1000 /* Simulated 1 second round trip time */);
    });
};

export default fakeFetch;
