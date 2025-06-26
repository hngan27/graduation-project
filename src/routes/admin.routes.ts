import express from 'express';
import * as adminController from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/requireAdmin';
import upload from '../config/multer-config';

const router = express.Router();

router.use(requireAdmin);

router.get('/', adminController.getDashboard);

router.get('/list-instructors', adminController.showInstructors);

router.get('/list-students', adminController.showStudents);

router.get('/students/:id/edit', adminController.studentUpdateGet);

router.post(
  '/students/:id/edit',
  upload.single('avatar'),
  adminController.studentUpdatePost
);

router.post('/students/:id/delete', adminController.deleteStudent);

// Toggle active status for student
router.post('/students/:id/toggle-active', adminController.toggleStudentActive);

router.get('/student-detail/:id', adminController.getStudentDetails);

router.get('/list-courses', adminController.showCourses);

router.get('/instructor-detail/:id', adminController.getInstructorDetails);

router.get('/instructors/:id/edit', adminController.instructorUpdateGet);

router.post(
  '/instructors/:id/edit',
  upload.single('avatar'),
  adminController.instructorUpdatePost
);

router.post('/instructors/:id/delete', adminController.deleteInstructor);

// Toggle active status for instructor
router.post('/instructors/:id/toggle-active', adminController.toggleInstructorActive);

router.get('/users/create', adminController.renderCreateUserForm);
router.post('/users/create', adminController.createUser);

export default router;
