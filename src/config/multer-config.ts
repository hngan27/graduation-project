import multer from 'multer';
import path from 'path';

// Cấu hình lưu trữ tạm thời
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu tạm thời
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Chỉ chấp nhận file ảnh và video
const upload = multer({
  storage,
  // @ts-ignore: ignore callback signature overload issues
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      // @ts-ignore: allow Error in callback despite type overload
      cb(new Error('Only image and video files are allowed'), false);
    }
  },
});

export default upload;
