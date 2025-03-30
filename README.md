# BriefFast

BriefFast is an application for creating and sharing professional briefs.

## Redis Database Setup

BriefFast now uses Redis for data storage instead of PostgreSQL. Follow these steps to set up Redis:

1. Create a Redis instance on Railway (https://railway.app/)
2. Copy your Redis connection URL - it should look like this:
   ```
   redis://default:password@hostname:port
   ```
3. Update your `.env` file with the Redis URL:
   ```
   REDIS_URL="your-redis-connection-url"
   ```

## Migrating from PostgreSQL

If you have existing data in PostgreSQL that you want to migrate to Redis, follow these steps:

1. Make sure both `DATABASE_URL` and `REDIS_URL` are in your `.env` file
2. Run the migration script:
   ```
   npm run migrate:redis
   ```

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

# Security Configuration

BriefFast uses API key authentication to protect API endpoints. To configure this:

1. Add the following to your `.env.local` file:

   ```
   # API key for server-side verification
   API_KEY="your-random-secure-key"

   # Same key for client-side access
   NEXT_PUBLIC_API_KEY="your-random-secure-key"
   ```

2. For production, generate a strong random key (at least 32 characters)
3. Keep these keys secret and don't commit them to version control
4. The middleware automatically allows public access to shared briefing links (/b/[uuid])

When making API requests from custom clients, include the API key in the header:

```
x-api-key: your-api-key
```
