import AWS from "aws-sdk";

// Configure S3 for DigitalOcean Spaces

export default async (req, res) => {
  const s3 = new AWS.S3({
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "us-east-1", // required for signing
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    signatureVersion: "v4", // required for presigned URLs
  });

  try {
    const { filename, filetype } = req.body;

    if (!filename || !filetype) {
      return res.status(400).json({ error: "Missing filename or filetype" });
    }

    // Generate unique file key
    const key = `uploads/${Date.now()}_${filename}`;

    // Pre-signed URL parameters
    const params = {
      Bucket: "swiped-bucket", // your bucket name
      Key: key,
      ContentType: filetype,
      ACL: "public-read", // optional: makes file public
      Expires: 60, // URL expires in 60 seconds
    };

    // Get signed URL
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    // Public URL for access
    const publicUrl = `https://${params.Bucket}.nyc3.digitaloceanspaces.com/${key}`;

    res.json({ signedUrl, publicUrl });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
};
