const path = require('./path.js');

module.exports = {
    setup: async (incomingFilePromise) => {
        console.log(`write incoming file to ${path.in}`);
        return writeFile(path.in, await incomingFilePromise);
    }
};