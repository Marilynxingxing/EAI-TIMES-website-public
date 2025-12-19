import React from 'react';

// A lightweight custom renderer to avoid heavy dependencies in this demo environment
// Supports headers, bold, list items, blockquotes
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {lines.map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4 font-mono">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-nexus-cyan mt-6 mb-3 font-mono">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-100 mt-4 mb-2 font-mono">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-nexus-cyan pl-4 italic text-gray-400 my-4 bg-nexus-gray/50 p-2">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return (
            <li key={index} className="ml-6 list-disc text-gray-300">
               <span dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />
            </li>
          );
        }
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>;
        }
        
        // Paragraph
        return (
          <p key={index} className="text-lg">
             <span dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
          </p>
        );
      })}
    </div>
  );
};

// Helper for bold/italic
const parseInline = (text: string) => {
  // Bold
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  // Italic
  parsed = parsed.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  return parsed;
};

export default MarkdownRenderer;