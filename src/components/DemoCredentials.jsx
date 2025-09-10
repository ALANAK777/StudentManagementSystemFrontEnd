import React from 'react';

const DemoCredentials = ({ className = "", title = "🎯 Demo Credentials" }) => {
  return (
    <div className={`glass-card p-4 animate-fade-in ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">{title}</h3>
      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-800 mb-1">👨‍💼 Admin Account</p>
          <p className="text-xs text-blue-700">Email: <span className="font-mono">akhilr.me@gmail.com</span></p>
          <p className="text-xs text-blue-700">Password: <span className="font-mono">alan4444</span></p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-800 mb-1">👨‍🎓 Student Account</p>
          <p className="text-xs text-green-700">Email: <span className="font-mono">akhilalan444@gmail.com</span></p>
          <p className="text-xs text-green-700">Password: <span className="font-mono">alan7777</span></p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-3">
        🔒 Use these credentials to explore the application features
      </p>
    </div>
  );
};

export default DemoCredentials;
