import React from 'react';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center glass-card border-brand-dark/20">
    <div className="w-20 h-20 bg-bg-surface rounded-full flex items-center justify-center text-brand-primary mb-6">
      <ClipboardList className="w-10 h-10" />
    </div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-text-secondary mb-8">This module is currently being optimized for your region.</p>
    <Link to="/" className="flex items-center gap-2 text-brand-primary hover:underline">
      <ArrowLeft className="w-4 h-4" /> Back to Safety
    </Link>
  </div>
);

export default Placeholder;
