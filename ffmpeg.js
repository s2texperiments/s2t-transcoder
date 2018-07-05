process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
process.env['PATH'] = `${process.env['PATH']}:/tmp/:${process.env['LAMBDA_TASK_ROOT']}`;

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(require('fs').readFile);
const path = require('./path.js');

module.exports = {

    setup: async () => {
        console.log("cp ffmpeg");
        return exec(`cp /var/task/bin/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;`)
    },

    transcode: async ({codec, extension} = {}) => {
        console.log('transcode file...');
        await exec(`/tmp/ffmpeg -y -i ${path.in} -acodec ${codec} -mode mono -ac 1 ${path.out}${extension}`);
        console.log('... and read outgoing file');
        return readFile(`${path.out}${extension}`);
    }
};