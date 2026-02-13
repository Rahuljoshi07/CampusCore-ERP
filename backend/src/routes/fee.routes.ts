import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as feeController from '../controllers/fee.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Fee structures
router.get('/structures', feeController.getAllFeeStructures);
router.post('/structures', feeController.createFeeStructure);

// Student fees
router.get('/student/:studentId', feeController.getStudentFees);
router.post('/payment', feeController.createFeePayment);
router.post('/payment/:id/process', feeController.processPayment);

// Reports
router.get('/reports/pending', feeController.getPendingFeesReport);
router.get('/reports/collection', feeController.getFeeCollectionReport);

export default router;
