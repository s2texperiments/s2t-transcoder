process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
process.env['PATH'] = `${process.env['PATH']}:/tmp/:${process.env['LAMBDA_TASK_ROOT']}`;

const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(require('fs').writeFile);
const readFile = util.promisify(require('fs').readFile);

const dataPath = "/tmp/data";
const storeInPath = `${dataPath}/in`;
const storeOutPath = `${dataPath}/out`;

module.exports = {


    transcode: async (incomingFilePromise,{ codec, extension} = {}) => {

        console.log('create data folder');
        await exec(`mkdir -p ${dataPath}`);

        console.log('write incoming file to disk and copy ffmpeg to tmp folder');
        await Promise.all([
            writeFile(storeInPath, await incomingFilePromise),
            exec(`cp /var/task/ffmpeg/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;`)
        ]);
        console.log('transcode file...');
        await exec(`/tmp/ffmpeg -y -i ${storeInPath} -acodec ${codec} -mode mono -ac 1 ${storeOutPath}${extension}`);
        console.log('... and read outgoing file');
        return readFile(storeOutPath + extension);
    }
};