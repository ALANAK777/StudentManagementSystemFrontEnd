import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  AcademicCapIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    name: '',
    course: '',
  });
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    setLocalError('');
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) clearError();
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validate form
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    // Validate student-specific fields
    if (formData.role === 'student') {
      if (!formData.name || !formData.course) {
        setLocalError('Name and course are required for student registration');
        return;
      }
    }

    // Prepare data for submission
    const submitData = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Add student-specific fields
    if (formData.role === 'student') {
      submitData.name = formData.name;
      submitData.course = formData.course;
    }

    const result = await signup(submitData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-6">
            <UserCircleIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h2>
          <p className="text-gray-600">Create your Student Management account</p>
        </div>

        {/* Form Card */}
        <div className="card animate-slide-in">
          <div className="p-8">
            {/* Error Alert */}
            {displayError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-bounce-in">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-field pl-10 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-field pl-10 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Student-specific fields */}
              {formData.role === 'student' && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="input-field pl-10 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                      Course *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="course"
                        name="course"
                        type="text"
                        required
                        value={formData.course}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="input-field pl-10 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., MERN Bootcamp"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-field pl-10 pr-10 focus:ring-green-500 focus:border-green-500"
                    placeholder="Create a password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input-field pl-10 pr-10 focus:ring-green-500 focus:border-green-500"
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card p-4 animate-fade-in mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">🎯 Demo Credentials</h3>
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
            🔒 Try the demo accounts or create a new one
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
