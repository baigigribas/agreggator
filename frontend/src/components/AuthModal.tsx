import React, { useState } from 'react';
// Import icons for the authentication form
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

// Define what props this component expects
interface AuthModalProps {
  isOpen: boolean; // Whether the modal is visible
  onClose: () => void; // Function to call when closing modal
  mode: 'login' | 'register'; // Whether showing login or registration form
  onModeChange: (mode: 'login' | 'register') => void; // Function to switch between login/register
  onLogin: (email: string, password: string) => Promise<void>; // Function to call for login
  onRegister: (name: string, email: string, password: string) => Promise<void>; // Function to call for registration
}

// Authentication modal component - popup for user login and registration
export function AuthModal({ isOpen, onClose, mode, onModeChange, onLogin, onRegister }: AuthModalProps) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' }); // Store form data in state
  const [error, setError] = useState(''); // Store validation error messages
  const [showPassword, setShowPassword] = useState(false); // Control whether password is visible or hidden
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Function called when user types in any input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Update form data
  };

  // Function to reset form when switching modes
  const handleModeChange = (newMode: 'login' | 'register') => {
    setForm({ name: '', email: '', password: '', confirmPassword: '' }); // Reset form fields
    setError(''); // Clear error message
    onModeChange(newMode); // Switch mode
  };

  // Function to handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(form.email, form.password);
      onClose();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Only send name, email, password to onRegister
      await onRegister(form.name, form.email, form.password);
      onClose();
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    // Full-screen overlay with semi-transparent background
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Modal container */}
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          
          {/* Header with title and close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {/* Show different title based on mode */}
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose} // Close modal when clicked
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Show general error if exists */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Authentication form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            
            {/* Name field - only show for registration */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  {/* User icon inside input */}
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      error ? 'border-red-500' : 'border-gray-300' // Red border if error
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {/* Show error message if exists */}
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                {/* Mail icon inside input */}
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                {/* Lock icon inside input */}
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                {/* Button to toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {/* Show different icon based on password visibility */}
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Confirm password field - only show for registration */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                /* Show different text based on mode */
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Link to switch between login and registration */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')} // Switch mode
                disabled={isLoading}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium disabled:cursor-not-allowed"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}