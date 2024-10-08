// s3Config.js
const { S3 } = require('@aws-sdk/client-s3');
const awsConfig = require('./awsConfig.json'); // Adjust path as needed

const s3 = new S3({
    accessKeyId: awsConfig.aws.accessKeyId,
    secretAccessKey: awsConfig.aws.secretAccessKey,
    region: awsConfig.aws.region
});

module.exports = s3;