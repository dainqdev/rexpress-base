const jwtSecretKey = process.env.JWT_KEY;

const S3_BUCKET = 'k3-upload';
let endpoint = 'https://frhdmwvcxvcfvsixvnqg.supabase.co/storage/v1/s3';
if (endpoint.endsWith('/s3')) {
  endpoint = endpoint.slice(0, -3);
}
const S3_CONFIGS = {
  endpoint: `${endpoint}/s3`,
  publicUrl: `${endpoint}/object/public/${S3_BUCKET}`,
  bucket: S3_BUCKET,
};

export { jwtSecretKey, S3_CONFIGS };
