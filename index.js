const s3Api = require('./s3Api.js');
const path = require('./path.js');
const file = require('./file.js');
const ffmpeg = require('./ffmpeg.js');
const ffprobe = require('./ffprobe.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


exports.handler = async (event) => {

    console.log(`REQUEST: ${JSON.stringify(event)}`);

    let {Records: [{Sns: {Message}}]} = event;
    let {
        "in": {
            bucket: inBucket,
            key: inKey
        },
        out: {
            bucket: outBucket,
            key: outKey,
            codec
        }
    } = JSON.parse(Message);

    console.log(`Create base folder  ${path.base}`);
    await exec(`mkdir -p ${path.base}`);

    let Metadata;
    let incomingFile = s3Api.getObject({
        Bucket: inBucket,
        Key: inKey
    }).then(e => {
        Metadata = e.Metadata;
        return e;
    }).then(e => e.Body);

    await Promise.all([
        file.setup(incomingFile),
        ffmpeg.setup(),
        ffprobe.setup()
    ]);

    console.log('start transcoding');
    let Body = await ffmpeg.transcode(getCodecInfo(codec));
    let report = await ffprobe.report(getCodecInfo(codec));
    console.log(`report: ${report}`);
    let {streams: [{sample_rate}]} = report;
    console.log(`detected sample rate: ${JSON.stringify(sample_rate)}`);

    console.log('put transcoded file so s3');
    return s3Api.putObject({
        Bucket: outBucket,
        Key: outKey,
        Body,
        Metadata: {
            ...Metadata, ...{"sample-rate": sample_rate}
        }
    });
};

const getCodecInfo = (codec) => {
    switch (codec) {
        case "opus":
            return {
                codec: "libopus",
                extension: ".opus"
            };
        case "flac":
            return {
                codec: "flac",
                extension: ".flac"
            };
        default:
            throw "unknown codec"
    }
};