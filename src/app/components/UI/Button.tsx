'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button'
}: ButtonProps) => {
  // Base styles
  let baseStyle = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size variations
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-400'
  };
  
  // Disabled state
  const disabledStyle = disabled 
    ? 'opacity-60 cursor-not-allowed'
    : 'cursor-pointer';
  
  // Full width
  const widthStyle = fullWidth 
    ? 'w-full' 
    : '';
  
  // Combine all styles
  const buttonStyle = `
    ${baseStyle}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabledStyle}
    ${widthStyle}
    ${className}
  `;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyle}
    >
      {children}
    </button>
  );
};

export default Button; 