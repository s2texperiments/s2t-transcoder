process.env.PATH = process.env.PATH + ':/tmp/';
process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
const BIN_PATH = process.env['LAMBDA_TASK_ROOT'];
process.env['PATH'] = process.env['PATH'] + ':' + BIN_PATH;

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(require('fs').writeFile);
const readFile = util.promisify(require('fs').readFile);

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const readS3 = async (params) =>
    new Promise((resolve, rejected) =>
        s3.getObject(params, (err, data) =>
            err ? rejected(err) : resolve(data)));

const putS3 = async (params) =>
    new Promise((resolve, rejected) =>
        s3.putObject(params, (err, data) =>
            err ? rejected(err) : resolve(data)));


const collectFFMpegCodec = (codec) => {
    switch (codec) {
        case "opus":
            return "libopus"
        default:
            throw "unknown codec"
    }
}

const dataPath = "/tmp/data";
const storeInPath = `${dataPath}/in`;
const storeOutPath = `${dataPath}/out`;

exports.handler = async (event, context, callback) => {

    await exec(`mkdir -p ${dataPath}`);

    //    let result = await readS3({ Bucket: event.in.bucket, Key: event.in.key });
    let s3In = await readS3({ Bucket: event.in.bucket, Key: event.in.key });
    await writeFile(storeInPath, s3In.Body);

    //ffmpeg mock
    await exec(`cp /var/task/ffmpeg/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;`);
    await exec(`/tmp/ffmpeg -y -i ${storeInPath} -acodec ${collectFFMpegCodec(event.out.codec)} -mode mono -ac 1 ${storeOutPath}.opus`);

    let s3Out = await readFile(storeOutPath+'.opus');
    await putS3({ Bucket: event.out.bucket, Key: event.out.key, Body: s3Out });


    callback(null, null);
};
