import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentsAPI, authAPI } from '../services/api';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      console.log('Profile response:', response.data); // Debug log
      setStudentData(response.data.profile);
      setFormData({
        name: response.data.profile.student?.name || '',
        course: response.data.profile.student?.course || '',
      });
      setError('');
    } catch (err) {
      setError('Failed to load student data');
      console.error('Load student data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (!formData.name || !formData.course) {
        setError('Please fill in all required fields');
        return;
      }

      await authAPI.updateProfile(formData);
      setSuccess('Profile updated successfully');
      setEditMode(false);
      loadStudentData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setError('Please fill in all password fields');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }

      // Update password via API
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password updated successfully');
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: studentData?.student?.name || '',
      course: studentData?.student?.course || '',
    });
    setEditMode(false);
    setError('');
  };

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authAPI.sendVerification();
      setSuccess('Verification email sent successfully! Please check your inbox.');
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordMode(false);
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <span className="text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {studentData?.student ? getInitials(studentData.student.name) : 'ST'}
                    </span>
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {studentData?.student?.name || user?.email}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg animate-slide-in">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-600 p-1.5 hover:bg-red-100 inline-flex h-8 w-8"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg animate-slide-in">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-600 p-1.5 hover:bg-green-100 inline-flex h-8 w-8"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Information */}
          <div className="xl:col-span-2 space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                  </div>
                  {!editMode && !passwordMode && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setPasswordMode(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <LockClosedIcon className="h-4 w-4 mr-1" />
                        Password
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={studentData?.email || ''}
                        className="input-field bg-gray-50 cursor-not-allowed"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course *
                      </label>
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleFormChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : passwordMode ? (
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        required
                        minLength="6"
                      />
                      <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCancelPassword}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-base text-gray-900 break-words">{studentData?.student?.name || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-base text-gray-900 break-words">{studentData?.email || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-500">Course</label>
                        <p className="text-base text-gray-900 break-words">{studentData?.student?.course || 'Not assigned'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-500">Enrollment Date</label>
                        <p className="text-base text-gray-900">
                          {studentData?.student?.enrollmentDate ? formatDate(studentData.student.enrollmentDate) : 'Not available'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-3">Account Status</label>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center">
                          {studentData?.student?.isVerified ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Verified Account
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              Pending Verification
                            </span>
                          )}
                        </div>
                        {!studentData?.student?.isVerified && (
                          <button
                            onClick={handleSendVerification}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
                          >
                            Send Verification Email
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats & Info */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Current Course</p>
                    <p className="text-base font-semibold text-gray-900 break-words">
                      {studentData?.student?.course || 'Not assigned'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Enrolled Since</p>
                    <p className="text-base font-semibold text-gray-900">
                      {studentData?.student?.enrollmentDate ? 
                        new Date(studentData.student.enrollmentDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        }) : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <AcademicCapIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Student ID</p>
                    <p className="text-base font-semibold text-gray-900 font-mono">
                      {studentData?.student?.id?.slice(-8).toUpperCase() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <EnvelopeIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                    <p className="text-base text-gray-900 break-all">{studentData?.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
