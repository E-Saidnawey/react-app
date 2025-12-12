import React, { useState } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  notebookPath: string;
  notebookType: 'ipynb' | 'rmd';
  tags: string[];
  createdAt: string;
  thumbnail?: string;
}

const Analysis: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock data - in production, this would come from an API
  const projects: Project[] = [
    {
      id: '1',
      title: 'Principle Component Analysis',
      description: 'Analysis of a US Crime data set, using principle component analysis and regression with R packages prcomp and lm ',
      notebookPath: '/notebooks/PCA_Analysis.pdf',
      notebookType: 'rmd',
      tags: ['R', 'PCA', 'prcomp', 'Linear Regression'],
      createdAt: '2025-10-01',
      thumbnail: '/images/plant-analysis-thumb.png'
    },
    {
      id: '2',
      title: 'Atlanta Summer Heat Trend using CUSUM',
      description: 'Using a CUSUM approach to identify when unofficial summer ends in Atlanta and if the summers have gotten warmer in the past 20 years',
      notebookPath: '/notebooks/Atlanta_Summer_Temerature_CUSUM.pdf',
      notebookType: 'rmd',
      tags: ['R', 'CUSUM', 'Climate Analysis', 'Data Preparation'],
      createdAt: '2025-09-06',
      thumbnail: '/images/customer-segmentation-thumb.png'
    },
    {
      id: '3',
      title: 'Atlanta Summer Heat Trend Pt 2',
      description: 'Created an exponential smoothing model to determine if the Atlanta summer has gotten warmer over the past 20 years.',
      notebookPath: '/notebooks/TrendAtlantaSummer2.pdf',
      notebookType: 'rmd',
      tags: ['R', 'Exponential Smoothing', 'Trending', 'Multiplicative Seasonality', 'Time Series', 'Decomposition'],
      createdAt: '2025-09-11',
      thumbnail: '/images/sales-forecast-thumb.png'
    },
    {
      id: '4',
      title: 'SimPy Airport Simulation ',
      description: 'Use Pythons SimPy to simulate an airport that has a queue behind the ticket counter and the security check',
      notebookPath: '/notebooks/SimpyTutorial.pdf',
      notebookType: 'ipynb',
      tags: ['Python', 'SimPy', 'Classes', 'Simulation Analysis'],
      createdAt: '2025-10-19',
      thumbnail: '/images/ab-testing-thumb.png'
    }, 
    {
      id: '5',
      title: 'K Nearest Neighbors and K Means Analysis in R',
      description: 'Created a KNN model to determine crime rate data in a city with multiple components. Additionally, use K means to determine flower type in iris data set',
      notebookPath: '/notebooks/K_Nearest_Neighbors.pdf',
      notebookType: 'rmd',
      tags: ['R', 'kknn', 'kmeans', 'Cross-Validation', 'Data Preparation'],
      createdAt: '2025-08-30',
      thumbnail: '/images/sentiment-analysis-thumb.png'
    }, 
  ];

  const handleViewNotebook = (project: Project) => {
    // In a real application, this would open the notebook in a viewer
    // For now, we'll just show a modal with project details
    setSelectedProject(project);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-light text-gray-900 mb-6">Data Analysis Projects</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A collection of my data analysis projects, research, and insights. Includes various homeworks from my Masters of Science and hobby analysis.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            {/* Project Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-medium text-gray-900">
                  {project.title}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1">
                  {project.notebookType.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Date and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(project.createdAt)}
                </div>
                <button
                  onClick={() => handleViewNotebook(project)}
                  className="inline-flex items-center px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Project
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-light text-gray-900">
                  {selectedProject.title}
                </h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{selectedProject.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created: {formatDate(selectedProject.createdAt)}
                </div>
              </div>

              <div className="flex space-x-4">
                <a
                  href={selectedProject.notebookPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Notebook
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
