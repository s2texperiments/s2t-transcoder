const path = require('./path.js');
const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);

module.exports = {
    setup: async (incomingFilePromise) => {
        console.log(`write incoming file to ${path.in}`);
        return writeFile(path.in, await incomingFilePromise);
    }
};