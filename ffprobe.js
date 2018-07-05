process.env['FFPROBE_PATH'] = '/tmp/ffprobe';
process.env['PATH'] = `${process.env['PATH']}:/tmp/:${process.env['LAMBDA_TASK_ROOT']}`;

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(require('fs').readFile);

const path = require('./path.js');

module.exports = {

    setup: async () => {
        console.log("cp ffprobe");
        return exec(`cp /var/task/bin/ffprobe /tmp/.; chmod 755 /tmp/ffprobe;`)
    },

    report: async (incomingFilePromise, {codec, extension} = {}) => {
        console.log('generate report');
        await exec(`/tmp/ffprobe -v quiet -print_format json -show_format -show_streams ${path.out}${extension} > ${path.report}`);
        console.log('... and read report');
        return JSON.parse(await readFile(path.report));
    }
};