import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experience, 
            position, 
            companyId 
        } = req.body;
        
        const userId = req.id; 

        // Validation for required fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false,
            });
        }

        // Type validation for numeric fields
        if (isNaN(Number(salary)) || Number(salary) <= 0) {
            return res.status(400).json({
                message: "Salary must be a positive number.",
                success: false,
            });
        }

        if (isNaN(Number(experience)) || Number(experience) < 0) {
            return res.status(400).json({
                message: "Experience level must be a non-negative number.",
                success: false,
            });
        }

        if (isNaN(Number(position)) || Number(position) <= 0) {
            return res.status(400).json({
                message: "Position must be a positive number.",
                success: false,
            });
        }

        // Convert fields to the correct type if needed
        const parsedSalary = Number(salary);
        const parsedExperience = Number(experience);
        const parsedPosition = Number(position);

        // Create the job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: parsedSalary,
            location,
            jobType,
            experienceLevel: parsedExperience,
            position: parsedPosition,
            company: companyId,
            created_by: userId,
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true,
        });
    } catch (error) {
        console.error(error);

        // Provide an error response
        return res.status(500).json({
            message: "An error occurred while creating the job.",
            error: error.message,
            success: false,
        });
    }
};

// student will see the all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// how many jobs are admin created
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
