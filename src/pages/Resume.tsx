import React from 'react';
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Resume: React.FC = () => {
  const resumeData = {
    name: "Eric Saidnawey",
    title: "Data Analyst & Plant Enthusiast",
    email: "eric@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary: "Passionate data analyst with expertise in statistical analysis, machine learning, and data visualization. Combining technical skills with a love for plant monitoring and environmental data analysis.",
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Data Analyst",
        duration: "2022 - Present",
        description: "Lead data analysis projects and develop predictive models for business insights.",
        achievements: [
          "Improved forecasting accuracy by 25% through advanced statistical modeling",
          "Developed automated reporting system reducing manual work by 60%",
          "Mentored 3 junior analysts and established best practices"
        ]
      },
      {
        company: "DataCorp Analytics",
        position: "Data Analyst",
        duration: "2020 - 2022",
        description: "Analyzed large datasets and created visualizations for client presentations.",
        achievements: [
          "Created interactive dashboards used by 50+ clients",
          "Reduced data processing time by 40% through optimization",
          "Collaborated with cross-functional teams on 15+ projects"
        ]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Master of Science in Data Science",
        year: "2020",
        gpa: "3.8/4.0"
      },
      {
        institution: "Stanford University",
        degree: "Bachelor of Science in Statistics",
        year: "2018",
        gpa: "3.6/4.0"
      }
    ],
    skills: [
      "Python", "R", "SQL", "Tableau", "Power BI", "Machine Learning",
      "Statistical Analysis", "Data Visualization", "PostgreSQL", "MongoDB"
    ],
    certifications: [
      "Google Data Analytics Professional Certificate",
      "AWS Certified Data Analytics - Specialty",
      "Tableau Desktop Specialist"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {resumeData.name}
            </h1>
            <p className="text-xl text-blue-600 mb-4">{resumeData.title}</p>
            <div className="flex flex-wrap gap-4 text-gray-600">
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
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </a>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Experience</h2>
        <div className="space-y-8">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {exp.duration}
                </span>
              </div>
              <p className="text-blue-600 font-medium mb-3">{exp.company}</p>
              <p className="text-gray-700 mb-4">{exp.description}</p>
              <ul className="list-disc list-inside space-y-1">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="text-gray-600">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Education</h2>
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600 font-medium">{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                )}
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 md:mt-0">
                {edu.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Certifications</h2>
          <ul className="space-y-3">
            {resumeData.certifications.map((cert, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Resume;
