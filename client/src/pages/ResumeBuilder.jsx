import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
    ArrowLeftIcon,
    Briefcase,
    FileText,
    FolderIcon,
    GraduationCap,
    Share2Icon,
    Sparkles,
    User,
    EyeIcon,
    EyeOffIcon,
    DownloadIcon
} from 'lucide-react'

import emailjs from "@emailjs/browser"

import PersonalInfoForm from '../components/PersonalInfoForm'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import SkillsForm from '../components/SkillsForm'

import api from '../configs/api'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const ResumeBuilder = () => {

    const { resumeId } = useParams()
    const { token } = useSelector(state => state.auth)

    const [resumeData, setResumeData] = useState({
        _id: '',
        title: '',
        personal_info: {},
        professional_summary: "",
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: "classic",
        accent_color: "#3B82F6",
        public: false,
    })

    const [activeSectionIndex, setActiveSectionIndex] = useState(0)
    const [removeBackground, setRemoveBackground] = useState(false)

    const sections = [
        { id: "personal", name: "Personal Info", icon: User },
        { id: "summary", name: "Summary", icon: FileText },
        { id: "experience", name: "Experience", icon: Briefcase },
        { id: "education", name: "Education", icon: GraduationCap },
        { id: "projects", name: "Projects", icon: FolderIcon },
        { id: "skills", name: "Skills", icon: Sparkles },
    ]

    const activeSection = sections[activeSectionIndex]

    /* LOAD RESUME */
    const loadExistingResume = async () => {
        try {
            const { data } = await api.get(
                `/api/resumes/get/${resumeId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data?.resume) {
                setResumeData(data.resume)
                document.title = data.resume.title || "Resume Builder"
            }

        } catch (error) {
            console.log(error?.response?.data || error.message)
            toast.error("Failed to load resume")
        }
    }

    useEffect(() => {
        if (token && resumeId) loadExistingResume()
    }, [token, resumeId])

    /* VISIBILITY */
    const changeResumeVisibility = async () => {
        try {
            const { data } = await api.put(
                '/api/resumes/update',
                {
                    resumeId,
                    resumeData: JSON.stringify({
                        public: !resumeData.public
                    })
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setResumeData(prev => ({
                ...prev,
                public: !prev.public
            }))

            toast.success(data.message || "Updated")

        } catch (error) {
            console.error(error)
            toast.error("Failed to update visibility")
        }
    }

    /* SAVE */
    const saveResume = async () => {
        try {
            const updatedResumeData =
                typeof structuredClone === "function"
                    ? structuredClone(resumeData)
                    : JSON.parse(JSON.stringify(resumeData))

            if (!updatedResumeData.personal_info) {
                updatedResumeData.personal_info = {}
            }

            const formData = new FormData()
            formData.append("resumeId", resumeId)
            formData.append("resumeData", JSON.stringify(updatedResumeData))

            if (removeBackground) {
                formData.append("removeBackground", "yes")
            }

            if (typeof resumeData.personal_info?.image === 'object') {
                formData.append("image", resumeData.personal_info.image)
            }

            const { data } = await api.put(
                '/api/resumes/update',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setResumeData(data.resume)
            toast.success(data.message || "Saved")

        } catch (error) {
            console.error(error)
            toast.error("Save failed")
        }
    }

    /* SHARE */
    const handleShare = () => {
        const url = `${window.location.origin}/view/${resumeId}`

        if (navigator.share) {
            navigator.share({ url, text: "My Resume" })
        } else {
            navigator.clipboard.writeText(url)
            toast.success("Link copied")
        }
    }

    const downloadResume = () => {
        window.print()
    }

    /* ✅ EMAILJS FUNCTION */
    const sendEmail = async () => {
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    name: resumeData.personal_info?.fullName || "User",
                    email: resumeData.personal_info?.email || "",
                    message: "Your resume has been created/updated successfully!"
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )

            toast.success("Email sent successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Email failed")
        }
    }

    const ActiveIcon = activeSection.icon

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">

            <Link to="/app" className="text-gray-500">
                <ArrowLeftIcon className="inline size-4" /> Back
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 mt-6">

                {/* LEFT */}
                <div className="lg:col-span-5">

                    <div className="flex flex-wrap gap-2 mb-4">
                        {sections.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSectionIndex(i)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded border ${
                                        i === activeSectionIndex
                                            ? "bg-black text-white"
                                            : "bg-white"
                                    }`}
                                >
                                    <Icon className="size-4" />
                                    {s.name}
                                </button>
                            )
                        })}
                    </div>

                    <div className="bg-white p-6 border rounded-lg">

                        <TemplateSelector
                            selectedTemplate={resumeData.template}
                            onChange={(t) =>
                                setResumeData(p => ({ ...p, template: t }))
                            }
                        />

                        <ColorPicker
                            selectedColor={resumeData.accent_color}
                            onChange={(c) =>
                                setResumeData(p => ({ ...p, accent_color: c }))
                            }
                        />

                        <h2 className="font-bold mt-4 flex items-center gap-2">
                            <ActiveIcon className="size-4" />
                            {activeSection.name}
                        </h2>

                        <div className="mt-4">
                            {activeSection.id === "personal" && (
                                <PersonalInfoForm
                                    data={resumeData.personal_info}
                                    onChange={(d) =>
                                        setResumeData(p => ({ ...p, personal_info: d }))
                                    }
                                    removeBackground={removeBackground}
                                    setRemoveBackground={setRemoveBackground}
                                />
                            )}

                            {activeSection.id === "summary" && (
                                <ProfessionalSummaryForm
                                    data={resumeData.professional_summary}
                                    onChange={(d) =>
                                        setResumeData(p => ({ ...p, professional_summary: d }))
                                    }
                                />
                            )}

                            {activeSection.id === "experience" && (
                                <ExperienceForm
                                    data={resumeData.experience}
                                    onChange={(d) =>
                                        setResumeData(p => ({ ...p, experience: d }))
                                    }
                                />
                            )}

                            {activeSection.id === "education" && (
                                <EducationForm
                                    data={resumeData.education}
                                    onChange={(d) =>
                                        setResumeData(p => ({ ...p, education: d }))
                                    }
                                />
                            )}

                            {activeSection.id === "projects" && (
                                <ProjectForm
                                    data={resumeData.project}
                                    onChange={(d) =>
                                        setResumeData(p => ({ ...p, project: d }))
                                    }
                                />
                            )}

                            {activeSection.id === "skills" && (
                                <SkillsForm
                                    data={resumeData.skills}
                                    onChange={(d) =>
                                        setResumeData(p => ({ ...p, skills: d }))
                                    }
                                />
                            )}
                        </div>

                        <button
                            onClick={() =>
                                toast.promise(saveResume(), {
                                    loading: "Saving...",
                                    success: "Saved!",
                                    error: "Error saving"
                                })
                            }
                            className="mt-6 px-4 py-2 bg-green-200 rounded"
                        >
                            Save Changes
                        </button>

                        {/* ✅ EMAIL BUTTON */}
                        <button
                            onClick={sendEmail}
                            className="mt-3 px-4 py-2 bg-blue-200 rounded w-full"
                        >
                            Send Email
                        </button>

                    </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-7">

                    <h1 className="text-2xl font-bold">Resume Preview</h1>

                    <div className="flex gap-3 mt-2">

                        <button onClick={changeResumeVisibility}>
                            {resumeData.public ? <EyeIcon /> : <EyeOffIcon />}
                            {resumeData.public ? "Public" : "Private"}
                        </button>

                        <button onClick={handleShare}>
                            <Share2Icon className="size-4" /> Share
                        </button>

                        <button onClick={downloadResume}>
                            <DownloadIcon className="size-4" /> Download
                        </button>

                    </div>

                    <ResumePreview
                        data={resumeData}
                        template={resumeData.template}
                        accentColor={resumeData.accent_color}
                    />
                </div>

            </div>
        </div>
    )
}

export default ResumeBuilder