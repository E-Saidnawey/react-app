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
      title: 'Plant Growth Analysis',
      description: 'Statistical analysis of plant growth patterns using sensor data from IoT devices. Includes correlation analysis between environmental factors and growth rates.',
      notebookPath: '/notebooks/plant_growth_analysis.ipynb',
      notebookType: 'ipynb',
      tags: ['Python', 'Pandas', 'Matplotlib', 'IoT', 'Statistics'],
      createdAt: '2024-01-15',
      thumbnail: '/images/plant-analysis-thumb.png'
    },
    {
      id: '2',
      title: 'Climate Data Visualization',
      description: 'Interactive dashboard for climate data analysis using R and Shiny. Features time series analysis and predictive modeling for temperature trends.',
      notebookPath: '/notebooks/climate_analysis.Rmd',
      notebookType: 'rmd',
      tags: ['R', 'Shiny', 'Time Series', 'Climate', 'Visualization'],
      createdAt: '2024-01-10',
      thumbnail: '/images/climate-dashboard-thumb.png'
    },
    {
      id: '3',
      title: 'Customer Segmentation',
      description: 'Machine learning project using K-means clustering to segment customers based on purchasing behavior and demographics.',
      notebookPath: '/notebooks/customer_segmentation.ipynb',
      notebookType: 'ipynb',
      tags: ['Machine Learning', 'Clustering', 'Scikit-learn', 'Business Intelligence'],
      createdAt: '2024-01-05',
      thumbnail: '/images/customer-segmentation-thumb.png'
    },
    {
      id: '4',
      title: 'Sales Forecasting',
      description: 'Time series forecasting model using ARIMA and Prophet to predict sales trends and seasonal patterns.',
      notebookPath: '/notebooks/sales_forecasting.ipynb',
      notebookType: 'ipynb',
      tags: ['Time Series', 'ARIMA', 'Prophet', 'Forecasting', 'Business Analytics'],
      createdAt: '2023-12-20',
      thumbnail: '/images/sales-forecast-thumb.png'
    },
    {
      id: '5',
      title: 'A/B Testing Analysis',
      description: 'Statistical analysis of A/B test results for website conversion optimization. Includes power analysis and confidence intervals.',
      notebookPath: '/notebooks/ab_testing_analysis.Rmd',
      notebookType: 'rmd',
      tags: ['Statistics', 'A/B Testing', 'Hypothesis Testing', 'R', 'Business Analytics'],
      createdAt: '2023-12-15',
      thumbnail: '/images/ab-testing-thumb.png'
    },
    {
      id: '6',
      title: 'Social Media Sentiment Analysis',
      description: 'Natural language processing project analyzing sentiment of social media posts using machine learning and text mining techniques.',
      notebookPath: '/notebooks/sentiment_analysis.ipynb',
      notebookType: 'ipynb',
      tags: ['NLP', 'Sentiment Analysis', 'Text Mining', 'Machine Learning', 'Social Media'],
      createdAt: '2023-12-10',
      thumbnail: '/images/sentiment-analysis-thumb.png'
    }
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
          A collection of my data analysis projects, research, and insights
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
