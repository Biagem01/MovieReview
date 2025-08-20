# 🎬 MovieReview

MovieReview è una piattaforma **full-stack** dedicata agli appassionati di film e serie TV, che permette agli utenti di scoprire, recensire e gestire contenuti preferiti.

Progetto sviluppato a scopo formativo per mettere in pratica tecnologie frontend e backend moderne, pattern REST, autenticazione JWT e integrazione con API esterne (TMDb).

---

# DEMO 

https://movie-review-alpha-red.vercel.app/

## 🚀 Funzionalità principali

- Ricerca film e serie TV via **TMDb API**
- Pagina dettaglio completa con **cast, trailer e stagioni/episodi**
- Sistema di **recensioni (CRUD)** + *“Mi piace”*
- Sezione **Preferiti** e **Watchlist personale**
- **Pagina profilo utente**
- 📬 **Notifiche real time** per azioni social ( Ad esempio quando qualcuno mette mi piace a un tuo commento spunta la notifica su profile)
- Home con caroselli dinamici (Trending, Now Playing, Upcoming…)
- **Navbar responsive** + hamburger mobile
- Backend RESTful Node/Express + Database MySQL

---

## 🛠️ Tecnologie utilizzate

| Area               | Stack                                 |
|--------------------|----------------------------------------|
| Frontend (SPA)     | React.js, React Router, Context API     |
| Backend API        | Node.js, Express.js                    |
| Database           | MySQL                                  |                   |
| API esterne        | **The Movie Database** (TMDb)          |
| Extra              | Upload file immagine profilo + Notifiche|

---

#Installazione

1. Clona il progetto
2. Configura il backend e il frontend
   -  npm install
3. Crea un file .env (uno per il backend nella root del progetto, e uno per il frontend all'interno della cartella frontend con PORT differente ovviamente)
   - DB_HOST=localhost
     DB_USER=root
     DB_PORT=
     DB_PASSWORD=yourpassword
     DB_DATABASE=moviereview

     PORT=""


      TMDB_API_KEY=""
    JWT_SECRET=your_jwt_secret

4. importa migration.sql nel tuo MySQL per creare le tabelle.
5. Sposta il progetto su htdocs all'interno di MAMP
6. Fai partire MAMP
7. Fai Partire il backend --> cd MovieReview --> node index.js
8. Fai partire il frontend --> cd MovieReview --> cd frontend --> npm start

# 👨‍💻 Autore
Biagio Cubisino — Full Stack Student Developer
start2impact University
biagio.99cubisino@gmail.com



