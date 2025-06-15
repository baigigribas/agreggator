import React, { useState } from 'react';
// Import icons for the authentication form
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

// Define what props this component expects
interface AuthModalProps {
  isOpen: boolean; // Whether the modal is visible
  onClose: () => void; // Function to call when closing modal
  mode: 'login' | 'register'; // Whether showing login or registration form
  onModeChange: (mode: 'login' | 'register') => void; // Function to switch between login/register
}

// Authentication modal component - popup for user login and registration
export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  
  // Store form data in state
  const [formData, setFormData] = useState({
    name: '', // Full name (only used for registration)
    email: '', // Email address
    password: '', // Password
    confirmPassword: '' // Password confirmation (only used for registration)
  });
  
  // Control whether password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);
  
  // Store validation error messages
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Function called when user types in any input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Get field name and new value
    setFormData(prev => ({ ...prev, [name]: value })); // Update form data
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Function to validate the form and return true if valid
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check name field (only required for registration)
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Check email field
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Use regex to check if email format is valid
      newErrors.email = 'Email is invalid';
    }

    // Check password field
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Check password confirmation (only for registration)
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors); // Update error state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Function called when form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    if (validateForm()) {
      // If form is valid, handle authentication logic here
      console.log('Form submitted:', formData);
      onClose(); // Close the modal
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
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Authentication form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300' // Red border if error
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {/* Show error message if exists */}
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                {/* Button to toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {/* Show different icon based on password visibility */}
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {/* Show different text based on mode */}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Link to switch between login and registration */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')} // Switch mode
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
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