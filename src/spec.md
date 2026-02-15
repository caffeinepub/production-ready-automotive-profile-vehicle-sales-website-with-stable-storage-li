# Specification

## Summary
**Goal:** Fix Admin Media Library image loading failures caused by the Internet Computer 2MB response-size limit by returning paginated media listings and storing/retrieving images via compact URLs instead of embedded base64 data URLs.

**Planned changes:**
- Update backend `getMediaAssets(sessionToken, offset, limit)` to return a deterministic, paginated slice of media assets so responses remain under the IC 2MB limit.
- Update backend `createMediaAsset` to store uploaded image bytes in canister storage and persist/return a compact retrievable URL/path in `MediaAsset.url` (while keeping the existing frontend upload payload unchanged).
- Maintain backward compatibility for legacy media records containing `data:` URLs by lazily converting them to stored bytes + compact URL during listing/retrieval, ensuring listings stay small.
- Add minimal backend diagnostic logging (`Debug.print`) for media listing and upload paths (offset/limit/returned count; media id/mime type/byte size), without logging sensitive data or raw image bytes.

**User-visible outcome:** The `/admin/media` page loads successfully without IC0504 payload-size errors, and both newly uploaded and legacy images display in the Media Library using compact URLs.
