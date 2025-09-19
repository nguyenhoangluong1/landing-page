# Luxury Wedding Landing Page

A comprehensive, production-ready wedding website built with Next.js, TypeScript, and Tailwind CSS. Features a luxury minimalist design with full admin panel for content management.

## 🌟 Features

### Frontend
- **Luxury Minimalist Design**: American wedding aesthetics with soft whites, champagne, sage green, and gold accents
- **Responsive Design**: Mobile-first approach with smooth animations
- **Interactive Sections**:
  - Hero with background video/image support
  - Our Story timeline with milestones
  - Photo gallery with lightbox and categories
  - Wedding details with map integration
  - RSVP form with validation
  - Gift registry with QR codes

### Admin Dashboard
- **Secure Authentication**: JWT-based admin login
- **Content Management**: Edit couple info, story, venue details
- **Media Management**: Upload, organize, and edit images
- **Real-time Preview**: See changes instantly
- **Drag & Drop**: Reorder gallery and story sections

### Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury theme
- **Database**: Vercel Postgres
- **File Storage**: Vercel Blob Storage
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Authentication**: JWT with bcrypt

### Integrations
- **Google Sheets**: RSVP responses storage
- **Maps**: Google Maps integration for venues
- **QR Codes**: Digital payment options
- **SEO**: Optimized meta tags and structure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env.local
```

3. **Configure environment variables** in `.env.local`:
```env
POSTGRES_URL="your_postgres_connection_string"
JWT_SECRET="your-secure-secret-key"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

4. **Run development server**:
```bash
npm run dev
```

5. **Initialize database** (after deployment):
```bash
curl -X POST https://your-site.vercel.app/api/init -d '{"action":"init"}'
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── content/      # Content management
│   │   ├── media/        # File upload & management
│   │   ├── story/        # Story milestones
│   │   └── rsvp/         # RSVP & Google Sheets
│   ├── admin/            # Admin dashboard
│   └── globals.css       # Global styles
├── components/
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities & configurations
└── types/               # TypeScript interfaces
```

## 🎨 Customization

### Design System
The site uses a custom Tailwind theme with wedding-specific colors:
- **Champagne**: Warm golden tones
- **Sage**: Soft green accents  
- **Cream**: Elegant neutral backgrounds

### Content Management
Access the admin panel at `/admin` with default credentials:
- **Email**: `admin@wedding.com`
- **Password**: `admin123`

## 🔧 Configuration

### Database Schema
The application automatically creates these tables:
- `users` - Admin authentication
- `wedding_content` - Dynamic content storage
- `media` - File metadata
- `story_milestones` - Timeline events
- `family_members` - Wedding party info

### Google Sheets Integration
For RSVP responses, configure:
1. Create a Google Service Account
2. Share your spreadsheet with the service account email
3. Add credentials to environment variables

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

#### Required Environment Variables for Production:
- `POSTGRES_URL`
- `BLOB_READ_WRITE_TOKEN` 
- `JWT_SECRET`
- `GOOGLE_CLIENT_EMAIL` (optional)
- `GOOGLE_SHEETS_ID` (optional)

## 🚀 Deployment Checklist

- [ ] Set up Vercel Postgres database
- [ ] Configure Vercel Blob Storage  
- [ ] Add all environment variables
- [ ] Initialize database via `/api/init`
- [ ] Test admin login and functionality
- [ ] Verify RSVP form submission
- [ ] Check media upload functionality

## 🎯 Performance Features

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based splitting
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Core Web Vitals**: Optimized for Google's performance metrics

## 🛠️ Development

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server  
- `npm run lint` - ESLint checking
- `npm run type-check` - TypeScript validation

### Adding New Features
1. Create components in appropriate directories
2. Add API routes for data management  
3. Update TypeScript interfaces
4. Test admin functionality

## 📱 Mobile Responsiveness

The site is fully responsive with:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized images and loading
- Smooth animations on all devices

## 🔒 Security Features

- **JWT Authentication**: Secure admin sessions
- **Password Hashing**: bcrypt with salt rounds
- **API Protection**: Middleware-based route protection
- **Input Validation**: Server-side validation for all forms
- **CORS Configuration**: Secure cross-origin requests

## 💍 Perfect For

- Modern couples wanting a professional wedding website
- Wedding planners offering digital services
- Developers creating wedding site templates
- Anyone needing a content-managed event website

---

**Built with ❤️ for celebrating love stories**
```
