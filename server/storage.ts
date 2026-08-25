import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { ENV } from "./_core/env";

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    throw new Error("Stockage Manus non configuré : renseignez BUILT_IN_FORGE_API_URL et BUILT_IN_FORGE_API_KEY.");
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function hasAnyS3Config() {
  return Boolean(ENV.s3Endpoint || ENV.s3Bucket || ENV.s3AccessKeyId || ENV.s3SecretAccessKey);
}

function getS3Config() {
  if (!ENV.s3Bucket || !ENV.s3AccessKeyId || !ENV.s3SecretAccessKey) {
    throw new Error("Stockage S3 incomplet : renseignez S3_BUCKET, S3_ACCESS_KEY_ID et S3_SECRET_ACCESS_KEY.");
  }

  return {
    bucket: ENV.s3Bucket,
    publicUrl: ENV.s3PublicUrl.replace(/\/+$/, ""),
    client: new S3Client({
      region: ENV.s3Region || "auto",
      endpoint: ENV.s3Endpoint || undefined,
      forcePathStyle: Boolean(ENV.s3Endpoint),
      credentials: {
        accessKeyId: ENV.s3AccessKeyId,
        secretAccessKey: ENV.s3SecretAccessKey,
      },
    }),
  };
}

function canUseLocalStorage() {
  return !ENV.isProduction && !hasAnyS3Config() && (!ENV.forgeApiUrl || !ENV.forgeApiKey);
}

async function localStoragePut(key: string, data: Buffer | Uint8Array | string, contentType: string) {
  const safeKey = normalizeKey(key).replace(/\.\.[\\/]/g, "_");
  const filePath = path.resolve(process.cwd(), "local-uploads", safeKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, data);
  return { key: safeKey, url: `/local-uploads/${safeKey}`, contentType };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

function publicS3Url(publicUrl: string, key: string) {
  if (!publicUrl) return undefined;
  return `${publicUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));

  if (hasAnyS3Config()) {
    const { bucket, client, publicUrl } = getS3Config();
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: data, ContentType: contentType }));
    const url = publicS3Url(publicUrl, key);
    if (!url) throw new Error("S3_PUBLIC_URL est requis pour afficher les images publiquement.");
    return { key, url };
  }

  if (canUseLocalStorage()) return localStoragePut(key, data, contentType);

  const { forgeUrl, forgeKey } = getForgeConfig();
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);
  const presignResp = await fetch(presignUrl, { headers: { Authorization: `Bearer ${forgeKey}` } });
  if (!presignResp.ok) throw new Error(`Storage presign failed (${presignResp.status}): ${await presignResp.text().catch(() => presignResp.statusText)}`);
  const { url: s3Url } = (await presignResp.json()) as { url: string };
  if (!s3Url) throw new Error("Forge returned empty presign URL");
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data as any], { type: contentType });
  const uploadResp = await fetch(s3Url, { method: "PUT", headers: { "Content-Type": contentType }, body: blob });
  if (!uploadResp.ok) throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  return { key, url: `/manus-storage/${key}` };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  if (hasAnyS3Config()) {
    const { bucket, publicUrl } = getS3Config();
    const url = publicS3Url(publicUrl, key);
    if (!url) throw new Error("S3_PUBLIC_URL est requis pour afficher les images publiquement.");
    return { key, url };
  }
  if (canUseLocalStorage()) return { key, url: `/local-uploads/${key}` };
  return { key, url: `/manus-storage/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const key = normalizeKey(relKey);
  if (hasAnyS3Config()) {
    const { bucket, client } = getS3Config();
    return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 900 });
  }
  const { forgeUrl, forgeKey } = getForgeConfig();
  const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
  getUrl.searchParams.set("path", key);
  const resp = await fetch(getUrl, { headers: { Authorization: `Bearer ${forgeKey}` } });
  if (!resp.ok) throw new Error(`Storage signed URL failed (${resp.status}): ${await resp.text().catch(() => resp.statusText)}`);
  const { url } = (await resp.json()) as { url: string };
  return url;
}
