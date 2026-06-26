import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { defaultMenu, type MenuItem } from '@/data/menu';

const region = process.env.AWS_REGION;
const bucket = process.env.S3_MENU_BUCKET;
const key = process.env.S3_MENU_KEY || 'menu.json';

const s3 = new S3Client({ region });

// The Kitchen Dashboard's source of truth for item availability. Falls back
// to the bundled seed menu if the object doesn't exist yet (first run) or
// the bucket is briefly unreachable, so the storefront never hard-fails.
export async function getMenuFromS3(): Promise<MenuItem[]> {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await res.Body?.transformToString();
    return body ? JSON.parse(body) : defaultMenu;
  } catch {
    return defaultMenu;
  }
}

export async function putMenuToS3(menu: MenuItem[]): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(menu, null, 2),
      ContentType: 'application/json',
    })
  );
}
