const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl }  = require("@aws-sdk/s3-request-presigner");

const s3CLient = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY
    }
})

async function getObject(key) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_PRIVATE_BUCKET_NAME,
        Key: key
    })

    const signedUrl = await getSignedUrl(s3CLient, command, { expiresIn: 30 });
    return signedUrl;
}

async function init() {
    console.log("Signed URL for image", await getObject('SamsungTV.png'))
}

init();