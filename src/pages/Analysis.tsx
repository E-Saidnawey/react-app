import React, { useState } from 'react';
import { ExternalLink, FileText, Calendar, Tag } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Analysis Projects</h1>
        <p className="text-xl text-gray-600">
          A collection of my data analysis projects, research, and insights
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Project Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-16 h-16 text-white opacity-80" />
            </div>

            {/* Project Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                  {project.title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {project.notebookType.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Date and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(project.createdAt)}
                </div>
                <button
                  onClick={() => handleViewNotebook(project)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProject.title}
                </h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">{selectedProject.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created: {formatDate(selectedProject.createdAt)}
                </div>
              </div>

              <div className="flex space-x-4">
                <a
                  href={selectedProject.notebookPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Notebook
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
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
