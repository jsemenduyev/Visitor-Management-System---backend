import AWS from "aws-sdk";
import dotenv from "dotenv";
import path from "path";

// Configure S3 for DigitalOcean Spaces
// This module is imported before index.ts executes dotenv.config(), so load the
// local environment before resolving the public and infrastructure endpoints.
dotenv.config();

const spacesBucket = process.env.DO_SPACES_BUCKET || "swiped-bucket";
const spacesEndpoint =
  process.env.DO_SPACES_ENDPOINT || "https://nyc3.digitaloceanspaces.com";
const assetPublicBaseUrl = (
  process.env.ASSET_PUBLIC_BASE_URL ||
  `https://${spacesBucket}.nyc3.digitaloceanspaces.com`
).replace(/\/$/, "");

export default async (req, res) => {
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    region: "us-east-1", // required for signing
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    signatureVersion: "v4", // required for presigned URLs
  });

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing file" });
    }

    const safeFileName = path
      .basename(req.file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${Date.now()}_${safeFileName || "upload"}`;

    const params = {
      Bucket: spacesBucket,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype || "application/octet-stream",
      ACL: "public-read",
    };

    await s3.upload(params).promise();

    // Keep DigitalOcean infrastructure behind a custom public asset domain.
    const publicUrl = `${assetPublicBaseUrl}/${key}`;

    res.status(200).json({ publicUrl });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
};
