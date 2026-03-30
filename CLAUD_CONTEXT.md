# CLAUDE CONTEXT — JUST BACKOFFICE

## Projet
Backoffice admin de l’application JUST.
Permet de gérer les données Supabase via une interface web.

## Stack
- Next.js (App Router)
- React
- Supabase (DB + Auth)
- Vercel (déploiement)

## Objectif principal
Créer un dashboard admin stable permettant :
- authentification admin
- lecture des données Supabase
- modification des données
- gestion des contenus (biens, véhicules, etc.)

## Architecture

### Front
- `app/admin/` → pages admin
- `components/` → UI du dashboard

### Backend (via Supabase)
- requêtes directes depuis front sécurisé
- ou via `/api/admin/`

## Authentification
- login admin via `/admin/login`
- middleware protège les routes admin
- session ou token à vérifier

## Fichiers importants
- `app/admin/page.jsx`
- `app/admin/login/page.jsx`
- `components/BackOffice.jsx`
- `components/AdminTopbar.jsx`
- `middleware.js`

## Règles STRICTES
- ne pas casser le routing Next.js
- toujours donner du code COMPLET quand tu modifies un fichier
- ne jamais inventer des variables inexistantes
- respecter la structure actuelle
- privilégier des solutions simples et robustes

## Bugs actuels
- connexion Supabase à stabiliser
- certaines données non affichées
- auth admin à sécuriser

## Objectif actuel
Faire fonctionner correctement :
- connexion admin
- affichage des données Supabase
- interaction CRUD
