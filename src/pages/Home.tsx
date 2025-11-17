import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, TrendingUp, FileText } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6">
            Hi, I'm Eric Saidnawey
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-8 font-light">
            Data Analyst & Systems Engineer
          </p>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            I transform complex data into actionable insights, building predictive models 
            and analytics solutions that drive decision-making.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/resume"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              View My Resume
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/analysis"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              Explore My Projects
            </Link>
          </div>
        </div>
      </div>

      {/* What I Do Section */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-16 text-center">
            What I Do
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Data Analysis & Modeling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Building predictive models and performing statistical analysis to forecast 
                system performance and drive data-driven decisions for satellite systems.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white mb-6">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Full-Stack Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Developing automated anomaly detection pipelines and reporting dashboards 
                using Python, MATLAB, PostgreSQL, React, and TypeScript. This portfolio site itself is built with React and TypeScript.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Systems Engineering
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Leading diagnostic analysis on satellite systems, creating trending packages, 
                and conducting root-cause investigations for mission-critical operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">3+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">20+</div>
              <div className="text-gray-600">Models Built</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">3</div>
              <div className="text-gray-600">React Dashboards Created</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">3</div>
              <div className="text-gray-600">Employee Awards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Education & Background */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-8">
            Education & Growth
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Currently pursuing a <strong>Master of Science in Data Science</strong> at 
            Georgia Institute of Technology while working full-time as a Systems Engineer 
            at Northrop Grumman.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            I hold a <strong>Bachelor of Science in Mechanical Engineering</strong> from 
            The George Washington University, where I built a strong foundation in 
            analytical thinking, problem-solving, and computational methods.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-8">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            I'm passionate about using data to solve complex problems and create 
            meaningful impact. Whether you're interested in my work or want to collaborate, 
            I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:esaidnawey165@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Get In Touch
            </a>
            <Link
              to="/resume"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              Download Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;