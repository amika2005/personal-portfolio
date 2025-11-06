import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface TechCardProps {
  icon: IconProp;
  alt: string;
  className?: string;
  hoverColor?: string;
}

export function TechCard({ icon, alt, className, hoverColor }: TechCardProps) {
  return (
    <div
      className={`group flex items-center justify-center p-4 bg-gray-200 dark:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 ${className}`}
    >
      <div 
        className="transition-colors duration-300 group-hover:text-opacity-100"
        style={hoverColor ? { color: hoverColor } : {}}
      >
        <FontAwesomeIcon 
          icon={icon} 
          size="3x" 
          title={alt}
          className="dark:group-hover:brightness-125"
        />
      </div>
    </div>
  );
}