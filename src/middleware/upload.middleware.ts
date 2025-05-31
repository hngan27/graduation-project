import express from 'express';
import upload from '../config/multer-config'; // Cấu hình multer
import uploadImageToCloudinary from '../utils/cloudinaryUpload'; // Hàm upload ảnh
import fs from 'fs';

const router = express.Router();

// Route xử lý việc tải lên ảnh
router.post('/upload', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const result = await uploadImageToCloudinary(req.file.path);
    fs.unlinkSync(req.file.path); // Xóa tệp tạm sau khi upload thành công
    res
      .status(200)
      .json({ message: 'File uploaded successfully', file: result });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

export default router;
