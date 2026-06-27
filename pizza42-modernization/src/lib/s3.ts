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

// Orders only carry item names + quantities (not ids), so we match on name
// to bump each item's running order count for the Menu Analytics page.
export async function recordOrderedItems(items: { name: string; qty: number }[]): Promise<void> {
  const menu = await getMenuFromS3();

  // TEMPORARY DEBUG: confirm every ordered item actually matches a menu
  // entry by name. Remove once we've root-caused the undercount.
  const menuNames = new Set(menu.map((m) => m.name));
  const unmatched = items.filter((item) => !menuNames.has(item.name));
  console.log('[recordOrderedItems] ordered:', items);
  console.log('[recordOrderedItems] menu item count from S3:', menu.length);
  console.log('[recordOrderedItems] unmatched items (will NOT be counted):', unmatched);

  const updatedMenu = menu.map((menuItem) => {
    const ordered = items.find((item) => item.name === menuItem.name);
    return ordered ? { ...menuItem, totalOrdered: menuItem.totalOrdered + ordered.qty } : menuItem;
  });
  await putMenuToS3(updatedMenu);
}
