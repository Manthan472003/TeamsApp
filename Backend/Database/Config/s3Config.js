// s3Config.js
const AWS = require('aws-sdk');
const awsConfig = require('./awsConfig.json'); // Adjust path as needed

const s3 = new AWS.S3({
    accessKeyId: awsConfig.aws.accessKeyId,
    secretAccessKey: awsConfig.aws.secretAccessKey,
    region: awsConfig.aws.region
});

module.exports = s3;