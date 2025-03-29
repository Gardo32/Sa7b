import React from 'react';

interface ArabicNameProps {
  name: string;
  className?: string;
}

// Manually reverse the name parts to fix incorrect order
function reverseNameParts(name: string): string {
  if (!name) return '';
  // Split by spaces and reverse the order
  return name.split(' ').reverse().join(' ');
}

export default function ArabicName({ name, className = '' }: ArabicNameProps) {
  // Apply the name reversal function
  const reversedName = reverseNameParts(name);
  
  return (
    <span 
      className={`arabic-name ${className}`}
      dir="rtl" 
      lang="ar"
    >
      {reversedName}
    </span>
  );
}
