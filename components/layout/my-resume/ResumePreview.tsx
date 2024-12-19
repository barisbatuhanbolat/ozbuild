import { useFormContext } from "@/lib/context/FormProvider";
import React from "react";
import PersonalDetailsPreview from "./previews/PersonalDetailsPreview";
import SkillsPreview from "./previews/SkillsPreview";
import SummaryPreview from "./previews/SummaryPreview";
import ExperiencePreview from "./previews/ExperiencePreview";
import EducationalPreview from "./previews/EducationalPreview";
import { themeColors } from "@/lib/utils";
import { Mail, MapPin, Phone } from "lucide-react";

const ResumePreview = ({ resumeDesign = 1 }) => {
  const { formData } = useFormContext();
  
  if (Object.keys(formData || {}).length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-[210mm] min-h-[297mm] rounded-sm shadow-lg skeleton" />
      </div>
    );
  }

  if(resumeDesign === 1) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="shadow-lg p-14 border-t-[20px] bg-white w-[210mm] min-h-[297mm] print:shadow-none"
          style={{
            borderColor: formData?.themeColor || themeColors[0],
          }}
        >
          <PersonalDetailsPreview />
          <SummaryPreview />
          {formData?.experience?.length > 0 && <ExperiencePreview />}
          {formData?.education?.length > 0 && <EducationalPreview />}
          {formData?.skills?.length > 0 && <SkillsPreview />}
        </div>
      </div>
    );
  }
  else if (resumeDesign === 2) {
    return (
      <div className="flex items-center justify-center">
        <div className="shadow-lg bg-white w-[210mm] min-h-[297mm] print:shadow-none">
          <div className="grid grid-cols-3 h-full">
            {/* Dark Sidebar */}
            <div 
              className="text-white p-8"
              style={{
                backgroundColor: formData?.themeColor || themeColors[0],
              }}
            >
              <div className="flex justify-center mb-8">
                <img
                  src={formData?.profileImage || "/img/default-profile.png"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover"
                />
              </div>

              {/* Profile Section */}
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">PROFILE</h2>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {formData?.summary}
                </p>
              </div>

              {/* Contact Section */}
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">CONTACT ME</h2>
                <div className="space-y-3 text-zinc-300">
                  <div className="flex items-center gap-3">
                    <Phone size={16} />
                    <span className="text-sm">{formData?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} />
                    <span className="text-sm break-words">{formData?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} />
                    <span className="text-sm">{formData?.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-2 p-8 bg-gray-100">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-2">
                  {formData?.firstName} {formData?.lastName}
                </h1>
                <h2 className="text-xl text-zinc-600 italic">{formData?.jobTitle}</h2>
              </div>

              {/* Education Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-zinc-400">▶</span> EDUCATION
                </h2>
                {formData?.education.map((edu: any, index: number) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-bold">{edu.universityName}</h3>
                    <p className="text-zinc-600">
                      {edu.degree} {edu.major && `in ${edu.major}`}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-zinc-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Experience Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-zinc-400">▶</span> EXPERIENCE
                </h2>
                {formData?.experience?.map((exp: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-bold">{exp.title}</h3>
                    <h4 className="text-zinc-600 font-medium">
                      {exp.companyName}
                      {exp.city && `, ${exp.city}`}
                      {exp.state && `, ${exp.state}`}
                    </h4>
                    <p className="text-sm text-zinc-500 mb-2">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                    {exp?.workSummary && (
                      <div
                        className="text-sm text-zinc-600"
                        dangerouslySetInnerHTML={{
                          __html: exp.workSummary,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-zinc-400">▶</span> SKILLS
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {formData?.skills.map((skill: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 items-center justify-between gap-3"
                    >
                      <h2 className="text-xs">{skill.name}</h2>
                      <div className="h-2 bg-gray-200 w-full rounded-full col-span-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: formData?.themeColor || themeColors[0],
                            width: (skill?.rating || 1) * 20 + "%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ResumePreview;