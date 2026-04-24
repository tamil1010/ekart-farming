import React, { useState, useEffect } from 'react';

const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
  </div>
);

export default Loader;
