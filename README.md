# Avans Modules - Fullstack TypeScript Webapplicatie

Moderne fullstack webapplicatie voor het beheren van onderwijsmodules.

## 🚀 Features

- **Authenticatie** - JWT-based login/register
- **CRUD Modules** - Aanmaken, bewerken, verwijderen
- **Favorieten** - Modules markeren met hartjes
- **Zoekfunctie** - Real-time filteren op naam
- **Comments** - Discussies onder modules
- **Responsive** - Werkt op alle apparaten

## 🛠️ Tech Stack

**Frontend:** Vue 3, TypeScript, Pinia, Vue Router, Tailwind CSS, Vite  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT

## ⚙️ Setup

### Vereisten
- Node.js 20.x
- MongoDB database

### Installatie

**Backend:**
```bash
cd backend
npm install
# Kopieer example.env naar .env en vul waarden in
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
# Kopieer example.env naar .env en vul VITE_API_URL in
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## � Structuur

```
├── frontend/    # Vue 3 app (components, views, stores)
└── backend/     # Express API (controllers, services, models)
```

## 📝 Gebruik

1. Registreer een account
2. Log in
3. Bekijk, zoek en maak modules aan
4. Markeer favorieten en plaats comments

Voor deployment: zie `backend/README_DEPLOY.md`
