# Blog Site Claude

A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic through advanced technical SEO implementation.

## 🚀 Features

### Core Features
- **Next.js 14+ with App Router**: Modern React framework with server components
- **MongoDB with Mongoose**: Scalable NoSQL database with ODM
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **Cloudinary Integration**: Optimized image storage and delivery

### SEO Optimization
- **Technical SEO Foundation**: Meta tags, schema markup, sitemap generation
- **Core Web Vitals Optimization**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Structured Data**: Article, Organization, Website, and Breadcrumb schemas
- **Dynamic Sitemap**: Auto-generated XML sitemap with proper priorities
- **RSS Feed**: Automatic RSS feed generation
- **Open Graph & Twitter Cards**: Social media optimization
- **Canonical URLs**: Proper URL canonicalization

### Performance Features
- **Incremental Static Regeneration (ISR)**: Fast page loads with fresh content
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Font Optimization**: Automatic font loading optimization
- **Code Splitting**: Automatic bundle optimization
- **Edge Caching**: Optimized for CDN delivery



## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Cloudinary account (for image storage)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-site-claude
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blog-site-claude
   JWT_SECRET=secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB Atlas cluster.

5. **Seed the database**
   ```bash
   npm run seed
   ```


6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── 
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├──
│   ├── Blog/              # Blog-related components
│   ├── Layout/            # Layout components
│   ├── SEO/               # SEO components
│   └── UI/                # Reusable UI components
├── lib/                   # Utility libraries
├── models/                # MongoDB schemas
├── scripts/               # Database scripts
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🎯 Usage



### Content Management

- **Create Posts**: Rich text editor with image upload
- **Categories**: Organize content with categories
- **Tags**: Add tags for better content discovery
- **SEO Settings**: Optimize meta descriptions, titles, and focus keyphrases

### SEO Features

- **Automatic Sitemap**: Available at `/sitemap.xml`
- **RSS Feed**: Available at `/rss.xml`
- **Robots.txt**: Available at `/robots.txt`
- **Structured Data**: Automatically generated for all content

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Connect to Vercel**: Import your project in Vercel
3. **Set Environment Variables**: Add all environment variables in Vercel dashboard
4. **Deploy**: Vercel will automatically deploy your application

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Blog Name
```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 SEO Performance

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1

### SEO Features Implemented
- ✅ Dynamic meta tags and Open Graph
- ✅ Structured data (JSON-LD)
- ✅ XML sitemap generation
- ✅ RSS feed
- ✅ Canonical URLs
- ✅ Image optimization
- ✅ Font optimization
- ✅ Mobile-first responsive design
- ✅ Fast loading times
- ✅ Proper heading hierarchy
- ✅ Internal linking structure

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Security headers
- Input sanitization
- Rate limiting ready

## 📈 Analytics Integration

The platform is ready for analytics integration:
- Google Analytics 4
- Google Search Console
- Custom tracking events
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for custom design tokens
- Update `src/app/globals.css` for global styles
- Customize components in `src/components/`

### SEO Configuration
- Update site metadata in `src/app/layout.tsx`
- Modify SEO utilities in `src/utils/seo.ts`
- Customize structured data schemas

### Content Types
- Extend MongoDB schemas in `src/models/`
- Add new API routes in `src/app/api/`
- Create corresponding UI components

---

Built with ❤️ using Next.js 14, MongoDB, and modern web technologies.