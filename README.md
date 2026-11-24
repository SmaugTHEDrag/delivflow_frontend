# DelivFlow Frontend

React, TypeScript, Vite, Tailwind CSS, and shadcn/ui frontend application.

## Development

```sh
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a local `.env` file when configuring the API client.
See `.env.example` for the expected variable. Environment files are ignored by
Git except for the example file.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```

The initial routes are `/`, `/login`, and `/register`; unknown paths display
the not-found page.
