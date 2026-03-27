const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Cloudinary Storage cho Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user-avatars", // Thư mục lưu trữ avatar
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"], // Định dạng file cho phép
    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
        format: "jpg",
      },
    ], // Tự động resize và optimize
  },
});

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Giới hạn 20MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép upload file ảnh!"), false);
    }
  },
});

// Upload avatar middleware
const uploadAvatar = upload.single("avatar");

class CloudinaryService {
  // Xóa ảnh cũ từ Cloudinary
  static async deleteImage(publicId) {
    try {
      if (!publicId) return { success: true };

      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Delete image result:", result);
      return { success: true, result };
    } catch (error) {
      console.error("Delete image error:", error);
      return { success: false, error: error.message };
    }
  }

  // Lấy thông tin ảnh
  static async getImageInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return { success: true, data: result };
    } catch (error) {
      console.error("Get image info error:", error);
      return { success: false, error: error.message };
    }
  }

  // Upload ảnh từ base64 (nếu cần)
  static async uploadBase64(base64String, options = {}) {
    try {
      const uploadOptions = {
        folder: "user-avatars",
        transformation: [
          {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "face",
            quality: "auto:good",
            format: "jpg",
          },
        ],
        ...options,
      };

      const result = await cloudinary.uploader.upload(
        base64String,
        uploadOptions
      );

      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
      };
    } catch (error) {
      console.error("Upload base64 error:", error);
      return { success: false, error: error.message };
    }
  }

  // Tạo URL với transformation
  static generateUrl(publicId, transformations = {}) {
    try {
      const url = cloudinary.url(publicId, {
        transformation: transformations,
        secure: true,
        quality: "auto:good",
      });
      return { success: true, url };
    } catch (error) {
      console.error("Generate URL error:", error);
      return { success: false, error: error.message };
    }
  }

  // Test kết nối Cloudinary
  static async testConnection() {
    try {
      const result = await cloudinary.api.ping();
      console.log("✅ Cloudinary connection successful:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Cloudinary connection failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Lấy thông tin sử dụng Cloudinary
  static async getUsage() {
    try {
      const result = await cloudinary.api.usage();
      return { success: true, data: result };
    } catch (error) {
      console.error("Get usage error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = {
  uploadAvatar,
  deleteImage: CloudinaryService.deleteImage,
  getImageInfo: CloudinaryService.getImageInfo,
  uploadBase64: CloudinaryService.uploadBase64,
  generateUrl: CloudinaryService.generateUrl,
  testConnection: CloudinaryService.testConnection,
  getUsage: CloudinaryService.getUsage,
};
