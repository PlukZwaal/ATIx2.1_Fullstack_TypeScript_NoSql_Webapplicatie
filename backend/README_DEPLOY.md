# Backend Deploy Notes

## Belangrijkste environment variabelen (Azure App Service > Configuration)
- MONGODB_URI = <connection string>
- JWT_SECRET = <random lang geheim>
- (PORT niet zetten; Azure levert deze zelf)

## Hoe Azure start
1. GitHub Action bouwt TypeScript: `npm run build` -> output `dist/index.js`.
2. Action kopieert `package.json`, `package-lock.json`, `dist/` naar `backend/deploy`.
3. Azure OneDeploy pakt dat uit en draait `npm install --production` (of `npm ci`).
4. Start script: `npm start` -> `node dist/index.js`.

## Health check
GET /api/health (geeft JSON status, dbConnected etc.)

## Veelvoorkomende fouten
- 403 Site Disabled: App crashte meteen (env ontbrak) of geen startbestand. Check logs.
- Cannot find module: dist leeg -> build stap faalde (zie GitHub Actions logs).
- DB niet beschikbaar: controleer firewall / connection string / user rights.

## Lokale test
```
npm ci
npm run build
npm start
curl http://localhost:4000/api/health
```
