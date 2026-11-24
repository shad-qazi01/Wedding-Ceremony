# The Royal Nikah

A mobile-first, interactive wedding invitation book built with React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Personalizing the invitation

Edit [`src/config/weddingConfig.ts`](./src/config/weddingConfig.ts). Personal details and image paths are intentionally empty until supplied.

- Set the couple’s names, wedding date (`YYYY-MM-DD`), optional local start/end times (`HH:mm`), and IANA timezone. The timezone defaults to `Asia/Kolkata`.
- Add the groom’s and bride’s parents’ names, plus an optional family closing line.
- Set an optional couple photo, venue name/address/city, direct Google Maps URL, and venue photograph.
- Add up to eight real couple photographs with captions to `galleryImages`.
- Add an optional user-provided MP3 to `backgroundMusic`. Playback starts only when a guest presses the music control.
- The save-the-date calendar invitation is available only when the date and couple names are configured. Without times it is an all-day calendar item; with both times it uses the configured timezone.
- Venue directions use `googleMapsUrl` when set, otherwise a Google Maps directions search is built from the configured address and city. Address copying copies only the configured address.

## Development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run build
npm run lint
```
# Wedding-Ceremony
