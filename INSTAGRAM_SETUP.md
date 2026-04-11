# Instagram Setup

This project can auto-publish Reels to Instagram through Meta's Graph API.

## Required setup

1. Convert the Instagram account to a Professional account.
2. Link that Instagram Professional account to a Facebook Page you control.
3. Use a Meta app with Instagram publishing access.
4. Use a valid Page access token plus the linked `instagram_business_account` id.
5. Expose each rendered MP4 at a public HTTPS URL before Instagram publish.

## `.env` values

```env
ENABLE_INSTAGRAM_UPLOAD=1
INSTAGRAM_ACCESS_TOKEN=your_meta_page_access_token
INSTAGRAM_USER_ID=your_instagram_business_account_id
INSTAGRAM_API_VERSION=v24.0

# Choose one of these public URL strategies:
INSTAGRAM_PUBLIC_VIDEO_BASE_URL=https://your-domain.example/reels
# or
INSTAGRAM_VIDEO_URL_TEMPLATE=https://your-domain.example/reels/{filename}

# Optional: copy rendered MP4s into a folder already served by your public host
INSTAGRAM_PUBLIC_VIDEO_OUTPUT_DIR=D:\public-reels
```

## Quick test

```powershell
npm run instagram:test
```

This validates the token and Instagram account id. It does not publish a Reel.

## Launch commands

Scheduled day using the already-validated pack:

```powershell
npm run daily:locked:both
```

Immediate batch with fresh pack regeneration:

```powershell
npm run daily:auto:both:now
```

## Notes

- The uploader now uses Meta's public `video_url` Reel publishing flow.
- If no public video URL configuration is present, Instagram upload will fail fast with a clear error instead of silently misbehaving.
- Instagram publishing remains opt-in through `--instagram` or `ENABLE_INSTAGRAM_UPLOAD=1`.
