import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
        8K Clothing Mockup Generator
      </h1>
      <p className="mt-3 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        Bring your apparel designs to life with AI. Describe your vision and get a stunning, photorealistic mockup in seconds.
      </p>
    </header>
  );
};
