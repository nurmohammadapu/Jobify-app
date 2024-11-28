import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteRecruiterAccount, getPendingApprovals,getApprovedRecruiters , handleApproval } from "../controllers/adminController.js";

const router = express.Router();

// Protected routes for super-admin only
router.get("/pending-approvals", isAuthenticated,  getPendingApprovals);
router.get("/approved-recruiters", isAuthenticated, getApprovedRecruiters);
router.post("/handle-approval", isAuthenticated,  handleApproval);
router.post("/deleteRecruiterAccount", isAuthenticated,  deleteRecruiterAccount);

export default router;
