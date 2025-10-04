import mongoose, { Schema } from 'mongoose';
import readingTime from 'reading-time';
import { IBlogPost } from '@/types';

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
    },
    metaDescription: {
      type: String,
      required: [true, 'Meta description is required'],
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
      minlength: [120, 'Meta description should be at least 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [100, 'Content should be at least 100 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    featuredImage: {
      url: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        required: false,
      },
      width: {
        type: Number,
        required: false,
      },
      height: {
        type: Number,
        required: false,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'trash'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    seoScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    canonicalUrl: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Canonical URL must be a valid HTTP/HTTPS URL',
      },
    },
    focusKeyphrase: {
      type: String,
      trim: true,
      maxlength: [100, 'Focus keyphrase cannot exceed 100 characters'],
    },
    trending: {
      isTrending: {
        type: Boolean,
        default: false,
      },
      trendingAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance and SEO
// Note: slug index is created automatically due to unique: true
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ author: 1, status: 1 });
BlogPostSchema.index({ categories: 1, status: 1 });
BlogPostSchema.index({ tags: 1, status: 1 });
BlogPostSchema.index({ views: -1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ 'title': 'text', 'content': 'text', 'tags': 'text' });

// Generate slug from title if not provided
BlogPostSchema.pre('save', function (next) {
  // Generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Calculate reading time
  if (this.content) {
    const stats = readingTime(this.content);
    this.readingTime = Math.ceil(stats.minutes);
  }

  // Generate excerpt if not provided
  if (!this.excerpt && this.content) {
    // Remove HTML tags and get first 150 characters
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }

  // Set publishedAt when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Clear publishedAt when status is not published
  if (this.status !== 'published') {
    this.publishedAt = undefined;
  }

  next();
});

// Update category post counts after save
BlogPostSchema.post('save', async function (doc) {
  if (doc.categories && doc.categories.length > 0) {
    const Category = mongoose.models.Category;
    if (Category) {
      for (const categoryId of doc.categories) {
        const count = await mongoose.models.BlogPost.countDocuments({
          categories: categoryId,
          status: 'published',
        });
        await Category.findByIdAndUpdate(categoryId, { postCount: count });
      }
    }
  }
});

// Update category post counts after remove
BlogPostSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.categories && doc.categories.length > 0) {
    const Category = mongoose.models.Category;
    if (Category) {
      for (const categoryId of doc.categories) {
        const count = await mongoose.models.BlogPost.countDocuments({
          categories: categoryId,
          status: 'published',
        });
        await Category.findByIdAndUpdate(categoryId, { postCount: count });
      }
    }
  }
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

