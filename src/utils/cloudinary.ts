import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: File | Buffer | string,
  options: {
    folder?: string;
    transformation?: any[];
    public_id?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    const uploadOptions = {
      folder: options.folder || 'blog-images',
      transformation: options.transformation || [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
      public_id: options.public_id,
    };

    let uploadPromise;

    if (file instanceof File) {
      // Convert File to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    } else if (Buffer.isBuffer(file)) {
      uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file);
      });
    } else {
      // Assume it's a URL or base64 string
      uploadPromise = cloudinary.uploader.upload(file, uploadOptions);
    }

    const result = await uploadPromise as CloudinaryUploadResult;
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  const transformation = [];

  if (options.width || options.height) {
    const cropMode = options.crop || 'fill';
    transformation.push(`c_${cropMode}`);
    
    if (options.width) transformation.push(`w_${options.width}`);
    if (options.height) transformation.push(`h_${options.height}`);
  }

  if (options.quality) {
    transformation.push(`q_${options.quality}`);
  } else {
    transformation.push('q_auto');
  }

  if (options.format) {
    transformation.push(`f_${options.format}`);
  } else {
    transformation.push('f_auto');
  }

  const transformationString = transformation.join(',');
  
  return cloudinary.url(publicId, {
    transformation: transformationString,
    secure: true,
  });
}

export function generateImageSizes(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150, crop: 'thumb' }),
    small: getOptimizedImageUrl(publicId, { width: 400, height: 300 }),
    medium: getOptimizedImageUrl(publicId, { width: 800, height: 600 }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 900 }),
    og: getOptimizedImageUrl(publicId, { width: 1200, height: 630, crop: 'fill' }),
  };
}

export default cloudinary;

