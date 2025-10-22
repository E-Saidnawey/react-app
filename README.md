# Simple Personal Portfolio

A clean, simple portfolio website with three sections: Resume, Data Analysis Projects, and Plant Monitor.

## What it does

- **Resume Page**: Shows your resume with download link
- **Analysis Page**: Displays your data analysis projects with links to notebooks
- **Plant Monitor**: Shows plant sensor data (currently with sample data)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

## For Production

1. **Host it**: Deploy to any static hosting (Netlify, Vercel, etc.)
2. **Connect database**: Replace the sample data in `PlantMonitor.tsx` with real database calls
3. **Add your projects**: Edit the projects array in `Analysis.tsx`
4. **Add your resume**: Replace `public/resume.pdf` with your actual resume

That's it! No complex setup needed.

## Files to Edit

- `src/pages/Resume.tsx` - Update your personal information
- `src/pages/Analysis.tsx` - Add your data analysis projects
- `src/pages/PlantMonitor.tsx` - Connect to your database (optional)
- `public/resume.pdf` - Add your actual resume
- `public/notebooks/` - Add your analysis notebooks

## Tech Stack

- React + TypeScript
- TailwindCSS for styling
- React Router for navigation
- Vite for building

Simple and clean!