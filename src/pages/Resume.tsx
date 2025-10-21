import React, { useState } from 'react';
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Resume: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(selectedSkill === skill ? null : skill);
  };

  const handleClassClick = (className: string) => {
    setSelectedClass(selectedClass === className ? null : className);
  };

  const getSkillDescription = (skill: string) => {
    const descriptions: { [key: string]: string } = {
      "Python": "Proficient in Python for data analysis, full stack application development, automation tasks, and simulation modeling. Experience with pandas, numpy, simpy, and matplotlib.",
      "R": "Statistical computing and data analysis using R. Experience with tidyverse, ggplot2, and various statistical modeling packages.",
      "SQL": "Database querying and management with PostgreSQL. Experience with complex queries, joins, and database optimization.",
      "MATLAB": "Numerical computing and simulation using MATLAB. Experience with signal processing, automation tasks, modeling packages, and data visualization.",
      "Statistical Analysis": "Hypothesis testing, advanced regression analysis, data massaging, experimental design, and statistical modeling for data-driven insights.",
      "Data Visualization": "Creating compelling visualizations using matplotlib, ggplot2, matlab auto powerpoint features, and Tableau for effective data communication.",
      "Big Data Engineering": "Managing terabytes of data",
    };
    return descriptions[skill] || "Click to learn more about this skill.";
  };

  const getClassDescription = (className: string) => {
    const descriptions: { [key: string]: string } = {
      "Introduction to Analytics Modeling": "An introduction to important and commonly used models in Analytics, as well as aspects of the modeling process. Topics include learning SVM, Classification, Advanced Regression, Advanced Data Preparation, Time Series Models, and Optimization",
      "Introduction to Computing for Data Analysis": "A hands-on introduction to programming techniques relevant to data analysis and machine learning.",
      "Engineering Computations": "MAE 2117",
      "Linear Algebra": "MATH 2184",
      "Multivariable Calculus": "MATH 2233",
      "Engineering Analysis III": "APSC 3115",
      "Methods of Engineering Experimentation": "MAE 3120",
      "Thermodynamics": "MAE 2131",
      "Fluid Dynamics": "MAE 3126",
      "Orbital Dynamics": "MAE 3145",
      "Linear System Dynamics": "MAE 3134"
    };
    return descriptions[className] || "Click to learn more about this class.";
  };

  const resumeData = {
    name: "Eric Saidnawey",
    title: "Data Analyst / Systems Engineer",
    email: "esaidnawey165@gmail.com",
    phone: "+1 (617) 999-2342",
    location: "New York City, NY | Los Angeles, CA",
    summary: "Passionate Data analyst with expertise in statistical analysis, data mining, and data visualization. Currently pursuing a graduate degree at Georgia Tech (sting em!).",
    experience: [
      {
        company: "Northrop Grumman Corporation - SBIRS Line-of-Sight (LOS)",
        position: "Systems Engineer",
        duration: "August 2022 - Present",
        description: "Lead data analysis projects and developed predictive models for program success.",
        achievements: [
          "Analyze and create critical trending packages using MATLAB and Python on SBIRS satellites. Perform weekly diagnostic analysis on big data metrics using high rate telemetry and report findings to the Chief Engineer",
          "Built and applied nonlinear regression models on 15+ components, identifying key performance trends that forecast an improved system reliability by 30% and reduce labor costs.",
          "Principal investigator of a root-cause investigation, delivering a semi-annual comprehensive report to a technical and non-technical customer base, helping the customer make data-driven mission decisions.",
          "Organized and hosted a satellite performance meeting for 60 people, including Space Force customers and NGC upper management. Presented data trend visualizations of the Line-Of-Sight performance to all attendees.",
          "Awards: 2x SBIRS Employee of the month, 1x Pathways Engineer of the month"
        ]
      },
      {
        company: "Northrop Grumman Corporation, Next-Generation OPIR Polar (NGP)",
        position: "Systems Engineer",
        duration: "June 2023 - Present",
        description: "Analyzed large datasets, created testing plans, and developed trending procesees .",
        achievements: [
          "Conducted data mining and trend analysis on engineering datasets, creating 6 diagnostic tools using algorithms such as k-means clustering that uncovered new system behaviors and streamlined analyst workflows",
          "Developing and debugging algorithms to perform quaternion calculations and optical projections. Created 3 new diagnostic trends and automated scripts to deliver all necessary analysis to the Responsible Engineer",
          "Responsible Engineer for Point Source Characterization, LOS Knowledge, and Encoder Calibration thermal vacuum (TVAC) testing. Assisted in design and tests with resiliency and efficiency, saving money and time."
        ]
      },
      {
        company: "Northrop Grumman Corporation, SBIRS Advanced Tool Developement Team (ATD) ",
        position: "Product Developer",
        duration: "June 2024 - Present",
        description: "Work on a team of 3 to create a full stack webapp to support analysts.",
        achievements: [
          "Designed an automated anomaly detection pipeline using Python, MATLAB, and PostgreSQL; built reporting dashboards in React + TypeScript, reducing daily detection time and analysis report time for engineers.",
          "Product Developer of automated anomaly report generator. Developing anomaly detection methods with MATLAB, logging occurrences in PostgreSQL databases, and hosting reports using React + Typescript.",
        ]
      }
    ],
    education: [
      {
        institution: "Georgia Institute of Technology",
        degree: "Master of Science in Data Science",
        year: "Est. 2027",
        gpa: "3.5/4.0",
        applicableClasses: [
          "Introduction to Analytics Modeling",
          "Introduction to Computing for Data Analysis"
        ]
      },
      {
        institution: "The George Washington University",
        degree: "Bachelor of Science in Mechanical Engineering",
        year: "2022",
        gpa: "3.5/4.0",
        applicableClasses: [
      "Engineering Computations",
      "Linear Algebra",
      "Multivariable Calculus",
      "Engineering Analysis III",
      "Methods of Engineering Experimentation",
      "Thermodynamics",
      "Fluid Dynamics",
      "Orbital Dynamics",
      "Linear System Dynamics"
        ]
      }
    ],
    skills: [
      "Python", "R", "SQL", "MATLAB", "Machine Learning",
      "Statistical Analysis", "Data Visualization", "PostgreSQL"
    ]
  };

  return (
    <div className="w-full px-6 py-12">
      {/* Header Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            {resumeData.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{resumeData.title}</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 mb-8">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {resumeData.email}
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              {resumeData.phone}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {resumeData.location}
            </div>
          </div>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Resume
          </a>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600 leading-relaxed">{resumeData.summary}</p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-light text-gray-900 mb-8">Experience</h2>
        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="border border-gray-200 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {exp.duration}
                </span>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-4 text-left">{exp.company}</p>
              <p className="text-gray-700 mb-4 text-left leading-relaxed">{exp.description}</p>
              <ul className="space-y-2">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-left">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-light text-gray-900 mb-8">Education</h2>
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="border border-gray-200 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <h3 className="text-xl font-medium text-gray-900">{edu.degree}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {edu.year}
                </span>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-4 text-left">{edu.institution}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                {edu.gpa && (
                  <span>GPA: {edu.gpa}</span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Relevent Coursework:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {edu.applicableClasses.map((className, classIndex) => (
                    <button
                      key={classIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => handleClassClick(className)}
                    >
                      {className}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-16">
        <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">Skills</h2>
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="flex flex-wrap justify-center gap-3">
            {resumeData.skills.map((skill, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors duration-200 rounded-full border border-gray-200"
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Description Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedSkill}</h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">{getSkillDescription(selectedSkill)}</p>
          </div>
        </div>
      )}

      {/* Class Description Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedClass}</h3>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">{getClassDescription(selectedClass)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;

