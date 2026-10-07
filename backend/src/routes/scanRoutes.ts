import { Router } from 'express';
import { ScanController } from '../controllers/scanController';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Public scanner endpoint: uses optionalAuth so logged-in users get scans saved, guests don't
router.post('/analyze', optionalAuth, ScanController.analyze);

// Authenticated scan history and management
router.get('/', requireAuth, ScanController.getUserScans);
router.get('/:id', requireAuth, ScanController.getScanById);
router.delete('/:id', requireAuth, ScanController.deleteScan);

export default router;
