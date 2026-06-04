import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

/* =========================
   CREATE RESUME
========================= */
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        const newResume = await Resume.create({
            userId,
            title
        });

        return res.status(201).json({
            message: "Resume created successfully",
            resume: newResume
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

/* =========================
   DELETE RESUME
========================= */
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({
            _id: resumeId,
            userId
        });

        return res.status(200).json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

/* =========================
   GET RESUME BY ID
========================= */
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            _id: resumeId,
            userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            resume
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

/* =========================
   GET PUBLIC RESUME
========================= */
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            _id: resumeId,
            public: true
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            resume
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

/* =========================
   UPDATE RESUME (FIXED)
========================= */
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        // Parse resumeData safely
        let resumeDataCopy =
            typeof resumeData === "string"
                ? JSON.parse(resumeData)
                : resumeData;

        // Ensure personal_info exists
        if (!resumeDataCopy.personal_info) {
            resumeDataCopy.personal_info = {};
        }

        /* =========================
           IMAGE UPLOAD (optional)
        ========================= */
        if (image) {
            const imageBuffer = fs.createReadStream(image.path);

            const response = await imagekit.files.upload({
                file: imageBuffer,
                fileName: "resume.png",
                folder: "user-resumes",
                transformation: {
                    pre:
                        "w-300,h-300,fo-face,z-0.75" +
                        (removeBackground ? ",e-bgremove" : "")
                }
            });

            resumeDataCopy.personal_info.image = response.url;
        }

        /* =========================
           UPDATE IN MONGODB
        ========================= */
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId },
            { $set: resumeDataCopy },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({
                message: "Resume not found or unauthorized"
            });
        }

        return res.status(200).json({
            message: "Resume saved successfully",
            resume: updatedResume
        });

    } catch (error) {
        console.log("UPDATE ERROR:", error);
        return res.status(500).json({
            message: "Server error while updating resume"
        });
    }
};