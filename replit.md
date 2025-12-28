# CineNova - Movie Experience Website

## Overview

CineNova is a Spanish-language movie showcase website that displays film information in a Netflix-inspired dark theme interface. The project is a static frontend application that presents movie data including titles, ratings, images, and overviews in a visually appealing cinema-themed design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML, CSS, and JavaScript - no framework dependencies
- **Design Pattern**: Static single-page application with DOM manipulation
- **Styling Approach**: CSS custom properties (CSS variables) for theming with a dark cinema aesthetic
- **External Libraries**:
  - Font Awesome 6.0.0 for icons (CDN)
  - AOS (Animate On Scroll) for scroll animations (CDN)

### Data Management
- **Movie Data**: Currently hardcoded as a JavaScript array in `script.js`
- **Image Sources**: Uses TMDB (The Movie Database) CDN URLs for movie posters and backdrops
- **Data Structure**: Each movie object contains id, title, image URL, backdrop URL, rating, overview, and year

### UI Components
- **Header**: Fixed navigation with scroll-based background transition
- **Color Scheme**: Netflix-inspired palette with red primary (#e50914), dark background (#141414), and white text
- **Responsive Design**: Container-based layout with max-width constraints

### Design Decisions
- **No Build System**: Chose simplicity over complexity - direct browser execution without compilation
- **CDN Dependencies**: External libraries loaded via CDN to minimize local file management
- **CSS Variables**: Centralized theming for easy customization of colors and transitions

## External Dependencies

### Content Delivery Networks
- **Font Awesome** (cdnjs.cloudflare.com): Icon library for UI elements
- **AOS Library** (unpkg.com): Scroll-based animation effects

### Image Resources
- **TMDB API Images** (image.tmdb.org): Movie poster and backdrop images
  - Poster format: `https://image.tmdb.org/t/p/w500/{image_id}.jpg`
  - Backdrop format: `https://image.tmdb.org/t/p/original/{image_id}.jpg`

### Notes
- The code comments suggest the original plan was to use a movie API, but currently uses static fallback data
- No backend server or database - purely client-side rendering
- No authentication or user management system