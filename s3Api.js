const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = {
    getObject: async (params) => new Promise((resolve, rejected) =>
        s3.getObject(params, (err, data) =>
            err ? rejected(err) : resolve(data))),


    putObject: async (params) =>
        new Promise((resolve, rejected) =>
            s3.putObject(params, (err, data) =>
                err ? rejected(err) : resolve(data)))
};