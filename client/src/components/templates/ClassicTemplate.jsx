import React from 'react'

const ClassicTemplate = ({ data, accentColor }) => {

    return (

        <div className="bg-white min-h-[1123px] p-8">

            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-6">

                <h1
                    className="text-3xl font-bold"
                    style={{ color: accentColor }}
                >
                    {data.personal_info?.fullName || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-gray-600">

                    {data.personal_info?.email && (
                        <span>{data.personal_info.email}</span>
                    )}

                    {data.personal_info?.phone && (
                        <span>{data.personal_info.phone}</span>
                    )}

                    {data.personal_info?.location && (
                        <span>{data.personal_info.location}</span>
                    )}

                </div>

            </div>

            {/* Professional Summary */}
            {data.professional_summary && (

                <div className="mt-6">

                    <h2
                        className="text-xl font-bold border-b border-gray-200 pb-2 mb-3"
                        style={{ color: accentColor }}
                    >
                        Professional Summary
                    </h2>

                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {data.professional_summary}
                    </p>

                </div>

            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (

                <div className="mt-6">

                    <h2
                        className="text-xl font-bold border-b border-gray-200 pb-2 mb-4"
                        style={{ color: accentColor }}
                    >
                        Experience
                    </h2>

                    <div className="space-y-5">

                        {data.experience.map((experience, index) => (

                            <div
                                key={index}
                                className="pb-4 border-b border-gray-100"
                            >

                                <div className="flex justify-between items-start gap-4">

                                    <div>

                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {experience.position || "Job Title"}
                                        </h3>

                                        <p className="text-gray-700 font-medium">
                                            {experience.company || "Company Name"}
                                        </p>

                                    </div>

                                    <div className="text-sm text-gray-500 whitespace-nowrap">

                                        {experience.start_date || "Start Date"}

                                        {" - "}

                                        {experience.is_current
                                            ? "Present"
                                            : experience.end_date || "End Date"}

                                    </div>

                                </div>

                                {experience.description && (

                                    <p className="text-sm text-gray-600 mt-3 whitespace-pre-line leading-relaxed">
                                        {experience.description}
                                    </p>

                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (

                <div className="mt-6">

                    <h2
                        className="text-xl font-bold border-b border-gray-200 pb-2 mb-4"
                        style={{ color: accentColor }}
                    >
                        Education
                    </h2>

                    <div className="space-y-4">

                        {data.education.map((education, index) => (

                            <div key={index} className="pb-3 border-b border-gray-100">

                                <div className="flex justify-between items-start gap-4">

                                    <div>

                                        <h3 className="font-semibold text-gray-900">
                                            {education.degree || "Degree"}
                                        </h3>

                                        <p className="text-gray-700">
                                            {education.institution || "Institution"}
                                        </p>

                                        <p className="text-gray-600 text-sm">
                                            {education.field || "Field of Study"}
                                        </p>

                                        {education.gpa && (
                                            <p className="text-gray-500 text-sm">
                                                GPA: {education.gpa}
                                            </p>
                                        )}

                                    </div>

                                    <div className="text-sm text-gray-500 whitespace-nowrap">

                                        {education.graduation_date || "Date"}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

            {/* Projects (FIXED) */}
            {data.project && data.project.length > 0 && (

                <div className="mt-6">

                    <h2
                        className="text-xl font-bold border-b border-gray-200 pb-2 mb-4"
                        style={{ color: accentColor }}
                    >
                        Projects
                    </h2>

                    <div className="space-y-4">

                        {data.project.map((project, index) => (

                            <div key={index} className="pb-3 border-b border-gray-100">

                                <h3 className="font-semibold text-gray-900">
                                    {project.name || "Project Name"}
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    {project.type || "Project Type"}
                                </p>

                                {project.description && (
                                    <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">
                                        {project.description}
                                    </p>
                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (

                <div className="mt-6">

                    <h2
                        className="text-xl font-bold border-b border-gray-200 pb-2 mb-4"
                        style={{ color: accentColor }}
                    >
                        Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">

                        {data.skills.map((skill, index) => (

                            <span
                                key={index}
                                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700"
                            >
                                {skill}
                            </span>

                        ))}

                    </div>

                </div>

            )}

        </div>

    )
}

export default ClassicTemplate