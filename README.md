# Pandit Ji – Admin Panel

Standalone admin dashboard for managing leads, services, testimonials, and website settings.

## How to Run Locally

```bash
npm install
npm run dev
# Opens at http://localhost:5200
```

## How to Build for Deployment

```bash
npm run build
# Output goes to the `dist/` folder — upload that to any static host
```

## How to Deploy Separately

### Option A – Netlify (Recommended)
1. Go to https://app.netlify.com → "Add new site" → "Deploy manually"
2. Drag-and-drop the `dist/` folder
3. Done — you'll get a URL like `https://panditji-admin.netlify.app`

### Option B – Vercel
```bash
npx vercel --prod
```

### Option C – Firebase Hosting (separate site)
1. `firebase init hosting` inside this folder
2. Set public directory to `dist`
3. `firebase deploy`

## Login Credentials
Use the Firebase email/password you set up in the Firebase console under Authentication.

## Firebase Security
Make sure your `firestore.rules` in the Firebase console allow:
- **leads** → public create, authenticated read/update/delete
- **services, testimonials, settings** → public read, authenticated write
