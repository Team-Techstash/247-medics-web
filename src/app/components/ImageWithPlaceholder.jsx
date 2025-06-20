"use client";

import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

const ImageWithPlaceholder = ({ src, alt, width, height, className }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          e.currentTarget.style.display = 'none';
          const placeholder = e.currentTarget.nextSibling;
          if (placeholder) {
            placeholder.style.display = 'flex';
          }
        }}
      />
    );
  }

  return (
    <div
      className={`bg-gray-200 flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <FaUser className="text-gray-400" style={{ fontSize: Math.min(width, height) / 1.8 }} />
    </div>
  );
};

export default ImageWithPlaceholder; 