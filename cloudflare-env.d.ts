declare namespace Cloudflare {
  interface Env {
    LEGACY_OWNER_EMAIL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
