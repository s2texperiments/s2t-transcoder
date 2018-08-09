process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
process.env['PATH'] = `${process.env['PATH']}:/tmp/:${process.env['LAMBDA_TASK_ROOT']}`;

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(require('fs').readFile);
const path = require('./path.js');
const moment = require('./moment.js');

function createTimeStamp(ms) {
    let dur = moment.duration(ms);
    return `${
        dur.hours() > 9 ? dur.hours() : '0' + dur.hours()
        }:${
        dur.minutes() > 9 ? dur.minutes() : '0' + dur.minutes()
        }:${
        dur.seconds() > 9 ? dur.seconds() : '0' + dur.seconds()
        }`;
}


function getTrimParameter({trimEnabled = false, trimFrom, trimTo}) {
    if (!trimEnabled) {
        return '';
    }
    return `-ss ${createTimeStamp(trimFrom*1000)} -to ${createTimeStamp(trimTo*1000)} -c copy`;
}

module.exports = {

    setup: async () => {
        console.log("cp ffmpeg");
        return exec(`cp /var/task/bin/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;`)
    },

    //todo: trim
    transcode: async ({codec, extension, trimEnabled = false, trimFrom=0, trimTo=0} = {}) => {
        console.log('transcode file...');

        await exec(`/tmp/ffmpeg -y -i ${path.in} ${getTrimParameter({
            trimEnabled,
            trimFrom,
            trimTo
        })} -acodec ${codec} -mode mono -ac 1 ${path.out}${extension}`);
        console.log('... and read outgoing file');
        return readFile(`${path.out}${extension}`);
    }
};