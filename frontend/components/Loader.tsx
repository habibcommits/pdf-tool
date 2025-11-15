import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export default function Loader({ size = 'medium', text }: LoaderProps) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
}
