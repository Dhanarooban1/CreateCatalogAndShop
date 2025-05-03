// Templates.js - Future-proof UI/UX design templates
import React from 'react';

const Templates = {
  // A timeless, adaptable design with a focus on readability and usability
  timeless: {
    name: 'Timeless Adaptive',
    description: 'A design that evolves with time while maintaining usability and accessibility.',
    primaryColor: '#3a86ff',
    secondaryColor: '#8338ec',
    backgroundColor: '#f8f9fa',
    cardBackground: '#ffffff',
    textColor: '#212529',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    headerStyle: 'bg-white shadow-sm',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700',
    cardBorder: 'border border-gray-200',
    hoverEffect: 'shadow-lg',
    style: 'Adaptive',
    bestFor: 'Future-proof stores focused on longevity and adaptability',
    features: ['Accessibility-first', 'Responsive design', 'Dark mode support', 'Customizable interface']
  },
  
  // Minimalist design with focus on content
  essence: {
    name: 'Essence',
    description: 'Distilled design focusing on what truly matters - your products.',
    primaryColor: '#2d3748',
    secondaryColor: '#4a5568',
    backgroundColor: '#f7fafc',
    cardBackground: '#ffffff',
    textColor: '#1a202c',
    fontFamily: '"Poppins", system-ui, sans-serif',
    headerStyle: 'bg-gray-50',
    buttonStyle: 'bg-gray-800 hover:bg-gray-900',
    cardBorder: 'border-none shadow-sm',
    hoverEffect: 'transform scale-102',
    style: 'Minimalist',
    bestFor: 'Products that speak for themselves',
    features: ['Content-first design', 'Typography focus', 'Reduced visual noise']
  },
  
  // Futuristic design with neo-brutalist elements
  neo2030: {
    name: 'Neo 2030',
    description: 'Bold, futuristic design with high-contrast elements and striking typography.',
    primaryColor: '#6d28d9',
    secondaryColor: '#4c1d95',
    backgroundColor: '#f5f5f5',
    cardBackground: '#ffffff',
    textColor: '#18181b',
    fontFamily: '"Space Grotesk", system-ui, monospace',
    headerStyle: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
    buttonStyle: 'bg-purple-600 hover:bg-purple-700',
    cardBorder: 'border-2 border-gray-900',
    hoverEffect: 'shadow-purple-200',
    style: 'Neo-Brutalist',
    bestFor: 'Tech products, digital goods, future-focused brands',
    features: ['High contrast', 'Bold typography', 'Geometric patterns', 'Interactive elements']
  },
  
  // Sustainable and eco-friendly design
  biophilic: {
    name: 'Biophilic',
    description: 'Nature-inspired design promoting sustainability and harmony.',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    backgroundColor: '#ecfdf5',
    cardBackground: '#ffffff',
    textColor: '#064e3b',
    fontFamily: '"Outfit", system-ui, sans-serif',
    headerStyle: 'bg-green-50',
    buttonStyle: 'bg-green-600 hover:bg-green-700',
    cardBorder: 'border border-green-100 rounded-xl',
    hoverEffect: 'shadow-green-100',
    style: 'Nature-inspired',
    bestFor: 'Sustainable products, eco-friendly brands, wellness items',
    features: ['Organic shapes', 'Natural colors', 'Soothing interactions', 'Sustainable design principles']
  },
  
  // Premium luxury experience
  platinum: {
    name: 'Platinum Experience',
    description: 'Sophisticated luxury design with attention to fine details.',
    primaryColor: '#121212',
    secondaryColor: '#27272a',
    backgroundColor: '#fafafa',
    cardBackground: '#ffffff',
    textColor: '#18181b',
    fontFamily: '"Playfair Display", serif',
    headerStyle: 'bg-neutral-900 text-white',
    buttonStyle: 'bg-black hover:bg-neutral-800',
    cardBorder: 'border-none shadow',
    hoverEffect: 'shadow-xl',
    style: 'Luxury',
    bestFor: 'High-end products, premium experiences, exclusive items',
    features: ['Refined typography', 'Premium imagery', 'Elegant interactions', 'White space utilization']
  }
};

export default Templates;