import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Built with React & Typescript 
          </p>

          <p className="text-sm text-gray-500">
            © 2026 Eric Saidnawey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

