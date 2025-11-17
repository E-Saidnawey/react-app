import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Code } from "lucide-react";

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
      "Big Data Engineering": "Managing terabytes of data"
    };
    return descriptions[skill] || "Click to learn more about this skill.";
  };

  const getClassDescription = (className: string) => {
    const descriptions: { [key: string]: string } = {
      "Introduction to Analytics Modeling": "An introduction to important and commonly used models in Analytics, as well as aspects of the modeling process. Topics include learning SVM, Classification, Advanced Regression, Advanced Data Preparation, Time Series Models, and Optimization. This course is designed to gain an intuitive understanding of fundamental models and methods of analytics and practice how to implement them using common industry tools like R",
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
      text: `I’m a Data Analyst and Systems Engineer passionate about building data-driven solutions 
      that improve technical performance and decision-making. My work bridges engineering rigor with 
      analytical insight — from predictive modeling and anomaly detection to full-stack web development.`
    },
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
  <div className="min-h-screen bg-background py-12">
    <div className="container mx-auto max-w-4xl px-4">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-foreground">{resumeData.name}</h1>
        <p className="text-lg text-muted-foreground">{resumeData.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <Mail className="inline w-4 h-4 mr-1 text-accent" /> {resumeData.email} &nbsp;|&nbsp;
          <Phone className="inline w-4 h-4 mr-1 text-accent" /> {resumeData.phone} &nbsp;|&nbsp;
          <MapPin className="inline w-4 h-4 mr-1 text-accent" /> {resumeData.location}
        </p>
      </header>

      {/* About */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">{resumeData.about.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{resumeData.about.text}</p>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-accent" />
          <h2 className="text-2xl font-semibold text-foreground">Experience</h2>
        </div>
        <div className="space-y-6">
          {resumeData.experience.map((job, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">{job.position}</h3>
                <span className="text-sm text-muted-foreground">{job.duration}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{job.company}</p>
              <p className="text-muted-foreground mb-4">{job.description}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {job.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-accent" />
          <h2 className="text-2xl font-semibold text-foreground">Education</h2>
        </div>
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
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
                      className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full hover:bg-muted/70 transition"
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
          <Code className="h-5 w-5 text-accent" />
          <h2 className="text-2xl font-semibold text-foreground">Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, i) => (
            <button
              key={i}
              onClick={() => handleSkillClick(skill)}
              className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full hover:bg-muted/70 transition"
            >
              {skill}
            </button>
          ))}
        </div>
      </section>
    </div>

    {/* Skill Description Modal */}
    {selectedSkill && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg">
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg">
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

