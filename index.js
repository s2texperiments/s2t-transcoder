const ffmpeg = require('./ffmpeg.js');
const s3Api = require('./s3Api.js');

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

    console.log('start transcoding');
    let meta;
    let outgoingFile = await ffmpeg.transcode(s3Api.getObject({
            Bucket: inBucket,
            Key: inKey
        }).then(e => {
            meta = e.Metadata;
            return e;
        }).then(e => e.Body),
        getCodecInfo(codec));

    console.log('put transcoded file so s3');
    await s3Api.putObject({
        Bucket: outBucket,
        Key: outKey,
        Body: outgoingFile,
        Metadata:meta
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
                extension:".flac"
            };
        default:
            throw "unknown codec"
    }
};