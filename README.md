# Hetzner Object Storage for Payload CMS

> **DEPRECATED:** This package is no longer maintained. Please use the official [`@payloadcms/storage-s3`](https://github.com/payloadcms/payload/tree/main/packages/storage-s3) plugin instead, which works with Hetzner Object Storage out of the box. See the [migration guide](#migrating-to-payloadcmsstorage-s3) below.

## Why is this package deprecated?

This package was created to fill a gap when the official Payload S3 adapter did not work well with Hetzner Object Storage. Since then, the official `@payloadcms/storage-s3` plugin has matured and now handles Hetzner's S3-compatible API without issues.

Additionally:

- **Payload 3.70.0+ compatibility is broken.** Payload moved the external upload process from `beforeChange` to `afterChange` hooks ([v3.70.0 release notes](https://github.com/payloadcms/payload/releases/tag/v3.70.0)), and this plugin has not been updated to reflect that change.
- **The only remaining differentiator was `cacheControl` header support**, which has been proposed upstream ([payloadcms/payload#14412](https://github.com/payloadcms/payload/pull/14412)).
- **Consolidating around the official plugin** benefits the whole community; bugs are fixed faster, compatibility is maintained automatically, and there is one less dependency to manage.

Thank you to everyone who used this package and reported issues. Your feedback directly informed the decision to sunset it.

## Migrating to `@payloadcms/storage-s3`

### 1. Install the official plugin

```sh
# Remove this package
npm uninstall @joneslloyd/payload-storage-hetzner

# Install the official S3 adapter
npm install @payloadcms/storage-s3
```

### 2. Update your Payload config

**Before** (this package):

```ts
import { hetznerStorage } from '@joneslloyd/payload-storage-hetzner'

export default buildConfig({
  plugins: [
    hetznerStorage({
      bucket: process.env.HETZNER_BUCKET,
      region: 'fsn1',
      credentials: {
        accessKeyId: process.env.HETZNER_ACCESS_KEY_ID,
        secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY,
      },
      collections: {
        media: true,
        'media-with-prefix': {
          prefix: 'uploads',
        },
      },
      acl: 'public-read',
      cacheControl: 'max-age=31536000',
      clientUploads: true,
    }),
  ],
})
```

**After** (`@payloadcms/storage-s3`):

```ts
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    s3Storage({
      bucket: process.env.HETZNER_BUCKET,
      config: {
        endpoint: `https://${process.env.HETZNER_REGION}.your-objectstorage.com`,
        credentials: {
          accessKeyId: process.env.HETZNER_ACCESS_KEY_ID,
          secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY,
        },
        region: process.env.HETZNER_REGION, // 'fsn1', 'nbg1', or 'hel1'
      },
      collections: {
        media: true,
        'media-with-prefix': {
          prefix: 'uploads',
        },
      },
      // acl: 'public-read', — set via S3 bucket policy or per-collection config
      clientUploads: true,
    }),
  ],
})
```

### 3. Option mapping reference

| This package | `@payloadcms/storage-s3` | Notes |
|---|---|---|
| `bucket` | `bucket` | Same. |
| `region` | `config.region` | Same value (`fsn1`, `nbg1`, `hel1`), but passed inside the `config` object. |
| *(implicit endpoint)* | `config.endpoint` | You must set this explicitly: `https://{region}.your-objectstorage.com`. |
| `credentials` | `config.credentials` | Same shape; moved inside the `config` object. |
| `collections` | `collections` | Same. `true` or `{ prefix }` per collection slug. |
| `acl` | `acl` | Available per collection in the official plugin. |
| `cacheControl` | *(not yet available)* | PR open: [payloadcms/payload#14412](https://github.com/payloadcms/payload/pull/14412). Use a bucket lifecycle policy or CDN headers as a workaround. |
| `clientUploads` | `clientUploads` | Same. |
| `disablePayloadAccessControl` | `disablePayloadAccessControl` | Same. Set per collection. |
| `disableLocalStorage` | `disableLocalStorage` | Same; defaults to `true` in both plugins. |
| `enabled` | `enabled` | Same. |

### 4. CORS configuration

CORS bucket configuration for client uploads is unchanged. The same `cors.json` and `aws s3api put-bucket-cors` command apply to both plugins. See the [Payload S3 storage docs](https://payloadcms.com/docs/upload/storage-adapters#s3-storage) for details.

### 5. Verify

After migrating, test the following:

- Uploading a new file (server-side and client-side if enabled).
- Viewing existing files and thumbnails in the admin panel.
- Deleting a file.
- Access control behaviour (if `disablePayloadAccessControl` is set).

Existing files in your bucket do not need to be moved or renamed; the URL structure is the same.

---

## Legacy Documentation

The original documentation for this package is preserved below for reference by users on pinned versions.

---

### Features

- Store media files in Hetzner Object Storage instead of local disk
- Support for client-side direct uploads to bypass server upload limits
- Full support for Payload's image resizing
- Compatible with Payload's access control for non-public files
- Built on the AWS SDK to interface with Hetzner's S3-compatible API

### Installation

```sh
npm install @joneslloyd/payload-storage-hetzner

# or with yarn
yarn add @joneslloyd/payload-storage-hetzner

# or with pnpm
pnpm add @joneslloyd/payload-storage-hetzner
```

### Usage

```ts
import { buildConfig } from 'payload'
import { hetznerStorage } from '@joneslloyd/payload-storage-hetzner'

export default buildConfig({
  collections: [
    // Your collections that use uploads
    {
      slug: 'media',
      upload: {
        // Payload upload configuration
      },
    },
  ],
  plugins: [
    hetznerStorage({
      collections: {
        media: true, // Enable for the 'media' collection
        // Or with prefix
        'media-with-prefix': {
          prefix: 'custom-folder', // Files will be stored in 'custom-folder/'
        },
      },
      bucket: process.env.HETZNER_BUCKET,
      region: 'fsn1', // 'fsn1', 'nbg1', or 'hel1'
      credentials: {
        accessKeyId: process.env.HETZNER_ACCESS_KEY_ID,
        secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY,
      },
      // Optional: enable client-side uploads to bypass server limits
      clientUploads: true,
      // Optional: set ACL for uploaded files
      acl: 'public-read',
      // Optional: set Cache-Control header for uploaded files
      cacheControl: 'max-age=31536000', // 1 year cache
    }),
  ],
})
```

### Configuration Options

| Option                | Type                                               | Description                                                                 |
| --------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `bucket`\*            | `string`                                           | The name of your Hetzner Object Storage bucket                              |
| `region`\*            | `'fsn1'` \| `'nbg1'` \| `'hel1'`                   | The region of your bucket (Falkenstein, Nuremberg, or Helsinki)             |
| `credentials`\*       | `{ accessKeyId: string, secretAccessKey: string }` | Your Hetzner Object Storage credentials                                     |
| `collections`\*       | `Record<string, CollectionOptions \| true>`        | Object with keys matching collection slugs where you want to enable storage |
| `acl`                 | `'private'` \| `'public-read'`                     | Access control list for uploads. Default: none                              |
| `cacheControl`        | `string`                                           | Cache-Control header value for uploaded files. Default: none                |
| `clientUploads`       | `boolean` \| `object`                              | Enable client-side uploads. Default: `false`                                |
| `disableLocalStorage` | `boolean`                                          | If files should not be stored locally. Default: `true`                      |
| `enabled`             | `boolean`                                          | Whether to enable this plugin. Default: `true`                              |

\* Required options

### Access Control

By default, this plugin maintains Payload's access control. Your file URLs will remain the same (`/:collectionSlug/file/:filename`), and Payload will apply its access control policies when files are requested.

If you want to disable this behavior and use direct URLs to Hetzner Object Storage, you can set `disablePayloadAccessControl: true` in the collection options:

```ts
hetznerStorage({
  collections: {
    media: {
      disablePayloadAccessControl: true,
    },
  },
  // other options...
})
```

When disabling Payload's access control, make sure to set your bucket visibility in Hetzner to `public` if you want files to be publicly accessible.

You can also set Cache-Control headers on uploaded files to improve performance:

```ts
hetznerStorage({
  // ...
  cacheControl: 'max-age=31536000', // Cache for 1 year
})
```

Common values: `max-age=31536000` (1 year), `max-age=86400` (1 day), `no-cache` (always revalidate). This applies to both server-side and client-side uploads.

### Client-Side Uploads

To allow larger file uploads that might exceed server limits (especially on serverless platforms), you can enable client-side uploads directly to Hetzner Object Storage:

```ts
hetznerStorage({
  // ...
  clientUploads: true,
})
```

When enabling client uploads, make sure to configure CORS on your Hetzner Object Storage bucket to allow PUT requests from your domain:

1. Install the AWS CLI and configure it with your Hetzner credentials
2. Create a CORS configuration file (`cors.json`):

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.com"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

3. Apply the CORS configuration:

```sh
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration file://cors.json --endpoint-url https://your-region.your-objectstorage.com
```

### Custom Domains

Hetzner currently doesn't support custom domain names for buckets directly. If you want to use a custom domain, you'll need to set up domain forwarding. See the [Hetzner documentation](https://docs.hetzner.com/storage/object-storage) for more information.

### Limitations

This adapter is built on Hetzner's S3-compatible API. Hetzner supports most but not all S3 features. Notable limitations:

- No support for custom domains for buckets
- Limited encryption support (only SSE-C)
- No support for some S3 features like request-payment, notifications, website hosting, etc.

Refer to the [Hetzner documentation](https://docs.hetzner.com/storage/object-storage/supported-actions) for a full list of supported actions.

## License

MIT
