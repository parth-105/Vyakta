# Deployment Guide

This guide covers deploying your Blog Site Claude platform to various hosting providers.

## 🚀 Quick Start

1. **Prepare your environment variables**
2. **Choose your hosting platform**
3. **Deploy your application**
4. **Set up your database**
5. **Configure your domain**

## 📋 Environment Variables

Create these environment variables in your hosting platform:

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-site-claude
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Blog Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your blog description
```

### Optional Variables
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_SEARCH_CONSOLE_ID=your-search-console-id
INDEXNOW_API_KEY=your-indexnow-key
```

## 🌐 Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications.

### Step 1: Connect Repository
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository

### Step 2: Configure Build Settings
Vercel will automatically detect Next.js. No configuration needed.

### Step 3: Add Environment Variables
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required environment variables
3. Make sure to add them for Production, Preview, and Development

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a `.vercel.app` domain

### Step 5: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/blog-site-claude
      - JWT_SECRET=your-jwt-secret
      - CLOUDINARY_CLOUD_NAME=your-cloudinary-name
      - CLOUDINARY_API_KEY=your-cloudinary-key
      - CLOUDINARY_API_SECRET=your-cloudinary-secret
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## ☁️ Other Hosting Platforms

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

### Railway
1. Connect your GitHub repository
2. Railway will auto-detect Next.js
3. Add environment variables
4. Deploy

### DigitalOcean App Platform
1. Create new app from GitHub
2. Select your repository
3. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
4. Add environment variables
5. Deploy

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [mongodb.com](https://mongodb.com)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update `MONGODB_URI` environment variable

### Self-hosted MongoDB
If you prefer to host MongoDB yourself:
1. Set up MongoDB server
2. Configure security (authentication, firewall)
3. Create database and user
4. Update connection string

## 🔧 Post-Deployment Setup


# If you have access to the server



curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
 
```

### 2. Configure SEO
1. Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`
2. Submit sitemap to Bing Webmaster Tools
3. Set up Google Analytics (if using)
4. Configure social media meta tags

### 3. Performance Monitoring
1. Set up error tracking (Sentry, LogRocket)
2. Monitor Core Web Vitals
3. Set up uptime monitoring
4. Configure backup strategy

## 🔒 Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure security headers
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Environment variables security

## 📊 Analytics Setup

### Google Analytics 4
1. Create GA4 property
2. Get Measurement ID
3. Add to `NEXT_PUBLIC_GA_ID` environment variable

### Google Search Console
1. Add property for your domain
2. Verify ownership
3. Submit sitemap
4. Monitor search performance

## 🚨 Troubleshooting

### Common Issues

**Build Errors**
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check environment variables

**Database Connection**
- Verify MongoDB URI
- Check network access
- Confirm database credentials

**Image Upload Issues**
- Verify Cloudinary credentials
- Check file size limits
- Confirm upload permissions

**SEO Issues**
- Verify meta tags are rendering
- Check sitemap accessibility
- Confirm robots.txt is correct

### Performance Issues
- Enable compression (gzip/brotli)
- Optimize images
- Use CDN for static assets
- Monitor Core Web Vitals

## 📞 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify environment variables
3. Test locally first
4. Check database connectivity
5. Review security settings

## 🔄 Updates and Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor security advisories
- Backup database regularly
- Review analytics and performance
- Update content regularly for SEO

### Scaling Considerations
- Database indexing optimization
- CDN configuration
- Caching strategies
- Load balancing (if needed)
- Database sharding (for large scale)

---

Your Blog Site Claude platform is now ready for production! 🎉

