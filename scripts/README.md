# Scripts de migration Sanity

## Seed Biography Sections

Ce script permet de créer automatiquement toutes les sections de biographie dans Sanity.

### Prérequis

1. Créer un token Sanity avec les permissions d'écriture :
   - Aller sur https://www.sanity.io/manage
   - Sélectionner votre projet
   - Aller dans "API" > "Tokens"
   - Créer un nouveau token avec les permissions "Editor"

2. Définir la variable d'environnement :
   ```bash
   export SANITY_API_TOKEN="votre_token_ici"
   ```
   
   Ou créer un fichier `.env.local` :
   ```
   SANITY_API_TOKEN=votre_token_ici
   ```

### Utilisation

```bash
# Avec tsx (recommandé)
npx tsx scripts/seed-biography-sections.ts

# Ou avec ts-node
npx ts-node scripts/seed-biography-sections.ts
```

### Données

Les données détaillées sont stockées dans `data/biography-sections-data.json`. Ce fichier contient :
- Le contenu textuel de chaque section
- Les URLs des vidéos YouTube
- Les URLs des images (à télécharger et uploader manuellement dans Sanity)

### Images

Les images doivent être ajoutées manuellement via Sanity Studio car elles nécessitent d'être uploadées. Les URLs sont disponibles dans le fichier JSON.

Pour ajouter les images :
1. Ouvrir Sanity Studio (`/studio`)
2. Aller dans "Biography Section"
3. Sélectionner une section
4. Dans le champ "Images", uploader les images depuis les URLs fournies

### Vidéos

Les vidéos YouTube sont automatiquement ajoutées au contenu via le type `videoEmbed`.

