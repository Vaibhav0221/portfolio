# Portfolio Website

A modern, responsive portfolio website built with React and Vite.

## Features

- 🎨 Modern, clean UI design
- 📱 Fully responsive layout
- ⚡ Fast performance with Vite
- 🎯 Smooth scrolling navigation
- 💼 Portfolio sections: About, Skills, Projects, Contact

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Customization

### Update Personal Information

1. **Hero Section** (`src/components/Hero.jsx`): Update name and title
2. **About Section** (`src/components/About.jsx`): Update bio and stats
3. **Skills Section** (`src/components/Skills.jsx`): Update skill categories and technologies
4. **Projects Section** (`src/components/Projects.jsx`): Update project information
5. **Contact Section** (`src/components/Contact.jsx`): Update contact information
6. **Footer** (`src/components/Footer.jsx`): Update copyright name and social links

### Styling

- Global styles: `src/index.css`
- Color scheme: CSS variables in `src/index.css` (root)
- Component styles: Individual CSS files in `src/components/`

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Technologies Used

- React 18
- Vite
- CSS3 (Custom properties, Flexbox, Grid)

## License

MIT
