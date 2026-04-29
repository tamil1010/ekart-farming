import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6 animate-pulse">
        <Construction className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-display font-bold mb-4">{title || 'Coming Soon'}</h1>
      <p className="text-text-secondary max-w-md mx-auto mb-8">
        We're working hard to bring you this feature. Check back soon for the complete experience!
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );
};

export default Placeholder;
