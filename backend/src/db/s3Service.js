const AWS = require('aws-sdk');

class S3Service {
  constructor() {
    this.initialized = false;
    this.connection = null;
  }

  async initialize() {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    this.connection = s3;
    this.initialized = true;
  }

  async uploadFile(file) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${file.originalname}_${Date.now()}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    try {
      const data = await this.connection.upload(params).promise();
      return { url: data.Location };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}

module.exports = S3Service;