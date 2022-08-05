import fs from "fs";
import S3 from "aws-sdk/clients/s3";
import formidable from "formidable";

const bucketName = process.env.AWS_BUCKET || "";
const region = process.env.AWS_DEFAULT_REGION || "";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const uploadFileToS3 = (file: formidable.File) => {
  const filestream = fs.createReadStream(file.filepath);

  return s3
    .upload({
      Bucket: bucketName,
      Body: filestream,
      Key: file.newFilename,
      //   ACL: "public-read", The bucket does not allow ACLs
    })
    .promise();
};

// media folder
