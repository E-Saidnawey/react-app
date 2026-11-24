import React, { useState } from 'react';
import { Mail, Phone, MapPin, Rocket, GraduationCap, Sparkles, Download} from "lucide-react";
import MissionLog from "../components/space/MissionLog";
import SkillConstellation from "../components/space/SkillConstellation";
import BackToSystem from "../components/BackToSystem";

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
      "Machine Learning": "Machine Learning"
    };
    return descriptions[skill] || "Click to learn more about this skill.";
  };

  const getClassDescription = (className: string) => {
    const descriptions: { [key: string]: string } = {
      "Introduction to Analytics Modeling": "An introduction to important and commonly used models in Analytics, as well as aspects of the modeling process. Topics include learning SVM, Classification, Advanced Regression, Advanced Data Preparation, Time Series Models, and Optimization. This course is designed to gain an intuitive understanding of fundamental models and methods of analytics and practice how to implement them using common industry tools like R and Python",
      "Introduction to Computing for Data Analysis": "A hands-on introduction to programming techniques relevant to data analysis and machine learning.",
      "Engineering Computations": "Computational thinking: modeling and simulation practices. Numerical derivatives. Initial-value problems. Solving differential equations, direction fields, the phase plane. Geometry of linear algebra; eigenvalues and eigenvectors. Fourier analysis",
      "Linear Algebra": "Linear equations, matrices, inverses, and determinants. Vector spaces, rank, eigenvalues, and diagonalization. Applications to geometry and ordinary differential equations",
      "Multivariable Calculus": "Partial derivatives and multiple integrals. Vector-valued functions. Line and surface integrals and the theorems of Gauss, Green, and Stokes.",
      "Engineering Analysis III": "Analytical methods for the solution of engineering problems using probability and statistics concepts: probability distributions, random variables, expectations, confidence intervals, sampling, hypothesis testing, correlation, and regression.",
      "Methods of Engineering Experimentation": "Acquisition and analysis of experimental data. Laws of modeling and simulation. Report formulation and presentation. Basic principles of measuring instruments and sensors. Fundamentals of digital data acquisition and use of computer-based data systems",
      "Thermodynamics": "Fundamentals of equilibrium thermodynamics; Zeroth, First, and Second Laws. Work, heat, internal energy, enthalpy, thermodynamic potential functions; heat transfer mechanisms, phase diagrams, equations of state and property tables, power systems, refrigeration, heat pump systems. Reversible and irreversible processes, Carnot cycle, entropy, exergy",
      "Fluid Mechanics": "Fluid properties, fluid statics, integral and differential formulations of conservation of mass, momentum, and energy. Bernoulli’s equation. Dimensional analysis and similitude. Inviscid flow. Viscous flow. Experimental and computational methods in fluid mechanics. Prerequisite: APSC 2058. (Fall, Every year)",
      "Orbital Mechanics and Spacecraft Dynamics": "Coordinate systems and transformations, rocket equation, two-body problem, orbit transfers, orbit perturbations, attitude dynamics and stability of symmetric spacecraft, environmental and control torques.",
      "Linear System Dynamics": "Modeling of linear mechanical, electrical, and fluid systems as transfer functions and in state space. Linearization, discretization. Laplace and z-transforms. Natural frequencies and damping, free vibration, forced vibration. Measurement techniques, parameter estimation, and computer simulation. Time and frequency domain analysis."
    };
    return descriptions[className] || "Click to learn more about this class.";
  };

  const resumeData = {
    name: "Eric Saidnawey",
    title: "Data Analyst / Systems Engineer",
    email: "esaidnawey165@gmail.com",
    phone: "+1 (617) 999-2342",
    location: "New York City, NY | Los Angeles, CA",
    about: {
      title: "About Me",
      work_text: `Hi! I’m a Data Analyst and Systems Engineer passionate about building data-driven solutions 
      that improve technical performance and decision-making. I have 3+ years experience building analytical systems — from predictive modeling and anomaly detection to full-stack web development.`,
      personal_text: `Outside of work I enjoy cooking (where I track every ingredient to the gram... can't escape data) and spending time outdoors. Recently that has taken the shape of biking, camping, and skiing :) `
    },
    experience: [
      {
        company: "Northrop Grumman Corporation, SBIRS Advanced Tool Developement Team (ATD) ",
        position: "Product Developer",
        duration: "June 2024 - Present",
        description: "Product Developer on a team of 3 to create a full stack webapp to support analysts.",
        achievements: [
          "Architected and deployed automated analysis pipeline integrating Python, MATLAB, and PostgreSQL, automating anomaly detection workflow and reducing engineer response time by 85% (from 1 week to 1 day)",
          "Product Developer of automated anomaly report generator. Developing anomaly detection methods with MATLAB and creating user friendly way to log occurrences of sensative data in PostgreSQL databases.",
          "Product Representative between System Performance, Chief Engineer, Management, and Product developers."
        ]
      },
      {
        company: "Northrop Grumman Corporation, Next-Generation OPIR Polar (NGP)",
        position: "Systems Engineer",
        duration: "June 2023 - Present",
        description: "Analyzed large datasets, created testing plans, and developed trending procesees .",
        achievements: [
          "Conducted data mining and trend analysis on engineering datasets, creating tools and checklists for junior engineers to verify against data.",
          "Applied unsupervised ML (K-means, DBSCAN) to 10M+ telemetry records, improving outlier detection precision by 40%, and the model reported accuracy by 20%.",
          "Responsible Engineer for Point Source Characterization, LOS Knowledge, and Encoder Calibration thermal vacuum (TVAC) testing. Assisted in design and tests with resiliency and efficiency, saving money and time."
        ]
      },
      {
        company: "Northrop Grumman Corporation - SBIRS Line-of-Sight (LOS)",
        position: "Systems Engineer",
        duration: "August 2022 - Present",
        description: "Lead data analysis projects and developed predictive models for program success.",
        achievements: [
          "Principal investigator of a root-cause investigation about a sensative topic. Host a semi-annual working group and deliver a comprehensive report to technical and non-technical customers, helping the customer make data-driven mission decisions.",
          "Analyze and create critical trending packages using MATLAB and Python on SBIRS satellites. Perform weekly root-cause analysis on high rate telemetry and report findings to the Chief Engineer",
          "Built and applied nonlinear regression models on 15+ components, identifying key performance trends that forecast an improved system reliability by 30% and reduce labor costs.",
          "Organized and hosted a satellite performance meeting for 60 people, including Space Force customers and NGC upper management. Presented data trend visualizations of the Line-Of-Sight performance to all attendees.",
          "Awards: 2x SBIRS Employee of the month, 1x Pathways Engineer of the month"
        ]
      }
    ],
    education: [
      {
        institution: "Georgia Institute of Technology",
        degree: "Master of Science in Data Science",
        year: "Est. 2027",
        gpa: "4.0/4.0",
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
  <div className="dark space-bg min-h-screen pb-12 pt-6 text-foreground">
    <div className="container mx-auto max-w-4xl px-4">
      <BackToSystem className="mb-6" />
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-foreground">{resumeData.name}</h1>
        <p className="text-lg text-muted-foreground">{resumeData.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <Mail className="inline w-4 h-4 mr-1 text-foreground" /> {resumeData.email} &nbsp;|&nbsp;
          <Phone className="inline w-4 h-4 mr-1 text-foreground" /> {resumeData.phone} &nbsp;|&nbsp;
          <MapPin className="inline w-4 h-4 mr-1 text-foreground" /> {resumeData.location}
        </p>

        {/* Download Button */}
<div className="mt-6">
  <a
    href="/EricSaidnaweyResume.pdf"
    download="EricSaidnaweyResume.pdf"
    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-medium rounded-full hover:bg-indigo-100 transition-colors shadow-[0_0_24px_rgba(165,180,252,0.35)]"
  >
    <Download className="w-5 h-5" />
    Download Resume
  </a>
</div>
      </header>

      {/* About */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">{resumeData.about.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{resumeData.about.work_text}</p>
        <br/>
        <p className="text-muted-foreground leading-relaxed">{resumeData.about.personal_text}</p>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-indigo-300" />
          <h2 className="text-2xl font-semibold text-foreground">Mission Log</h2>
        </div>
        <MissionLog entries={resumeData.experience} />
      </section>

      {/* Education */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-300" />
          <h2 className="text-2xl font-semibold text-foreground">Education</h2>
        </div>
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-sm p-6 text-left hover:border-indigo-300/40 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                <span className="text-sm text-muted-foreground">{edu.year}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-3">{edu.institution}</p>
              {edu.gpa && (
                <p className="text-sm text-muted-foreground mb-3">GPA: {edu.gpa}</p>
              )}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Relevant Coursework:</p>
                <div className="flex flex-wrap gap-2">
                  {edu.applicableClasses.map((className, i) => (
                    <button
                      key={i}
                      onClick={() => handleClassClick(className)}
                      className="px-3 py-1 border border-white/15 text-white/80 text-xs font-medium rounded-full hover:border-indigo-300/60 hover:text-white transition"
                    >
                      {className}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-300" />
          <h2 className="text-2xl font-semibold text-foreground">Skills Constellation</h2>
        </div>
        <SkillConstellation skills={resumeData.skills} onSelect={handleSkillClick} />
      </section>
    </div>

    {/* Skill Description Modal */}
    {selectedSkill && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-white/15 text-left max-w-md w-full p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{selectedSkill}</h3>
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="text-muted-foreground">{getSkillDescription(selectedSkill)}</p>
        </div>
      </div>
    )}

    {/* Class Description Modal */}
    {selectedClass && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-white/15 text-left max-w-md w-full p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{selectedClass}</h3>
            <button
              onClick={() => setSelectedClass(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="text-muted-foreground">{getClassDescription(selectedClass)}</p>
        </div>
      </div>
    )}
  </div>
);

  
};

export default Resume;

