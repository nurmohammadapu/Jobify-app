import { User } from "../models/user.model.js";
import { recruiterApprovalConfirmation, recruiterDenial } from "../mail/templates/instructorApprovalConfirmation.js";
import mailSender from "../utils/mailSender.js";

// Fetch accounts needing approval
export const getPendingApprovals = async (req, res) => {
    try {
        const pendingUsers = await User.find({ role: "recruiter", approved: false });

        // Check if there are any pending users
        if (pendingUsers.length === 0) {
            return res.status(200).json({
                message: "No recruiters pending approval.",
                success: true,
                data: [],
            });
        }

        return res.status(200).json({
            message: "Pending approvals fetched successfully.",
            success: true,
            data: pendingUsers,
        });
    } catch (error) {
        console.log("Error fetching pending approvals:", error);
        return res.status(500).json({
            message: "An error occurred while fetching pending approvals.",
            success: false,
        });
    }
};


export const handleApproval = async (req, res) => {
    try {
        const { userId, action } = req.body; // Expecting userId and action (approve/deny)

        // Validate input
        if (!userId || !["approve", "deny"].includes(action)) {
            return res.status(400).json({
                message: "Invalid input. Please provide a valid userId and action (approve/deny).",
                success: false,
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user || user.role !== "recruiter") {
            return res.status(404).json({
                message: "User not found or invalid user role.",
                success: false,
            });
        }

        if (action === "approve") {
            // Approve the user
            user.approved = true;
            await user.save();

            // Send approval email
            const emailBody = recruiterApprovalConfirmation(user.fullname);
            await mailSender(user.email, "Your Account Has Been Approved", emailBody);

            return res.status(200).json({
                message: `User ${user.fullname} has been approved successfully.`,
                success: true,
            });
        } else if (action === "deny") {
            // Deny the user
            await User.findByIdAndDelete(userId);

            // Send denial email
            const emailBody = recruiterDenial(user.fullname);
            await mailSender(user.email, "Your Application Has Been Denied", emailBody);

            return res.status(200).json({
                message: `User ${user.fullname} has been denied and removed.`,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error handling approval:", error);
        return res.status(500).json({
            message: "An error occurred while handling the approval.",
            success: false,
        });
    }
};

export const getApprovedRecruiters = async (req, res) => {
    try {
        // Fetch all approved recruiters
        const approvedRecruiters = await User.find({ role: "recruiter", approved: true });

        if (!approvedRecruiters.length) {
            return res.status(200).json({
                message: "No approved recruiters found.",
                success: true, // Indicate success even if no data is available
                data: [],
            });
        }

        return res.status(200).json({
            message: "Approved recruiters fetched successfully.",
            success: true,
            data: approvedRecruiters, // Returns the array of approved recruiters
        });
    } catch (error) {
        console.log("Error fetching approved recruiters:", error);
        return res.status(500).json({
            message: "An error occurred while fetching approved recruiters.",
            success: false,
        });
    }
};


export const deleteRecruiterAccount = async (req, res) => {
    try {
        const { recruiterId } = req.body; // ID of the recruiter to be deleted

        // Validate input
        if (!recruiterId) {
            return res.status(400).json({
                message: "Recruiter ID is required.",
                success: false,
            });
        }



        // Find the recruiter to be deleted
        const recruiterToDelete = await User.findById(recruiterId);
        if (!recruiterToDelete || recruiterToDelete.role !== "recruiter") {
            return res.status(404).json({
                message: "Recruiter account not found or the user is not a recruiter.",
                success: false,
            });
        }

        // Delete the recruiter account
        await User.findByIdAndDelete(recruiterId);

        return res.status(200).json({
            message: `Recruiter account ${recruiterToDelete.fullname} has been deleted successfully.`,
            success: true,
        });
    } catch (error) {
        console.log("Error deleting recruiter account:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the recruiter account.",
            success: false,
        });
    }
};
