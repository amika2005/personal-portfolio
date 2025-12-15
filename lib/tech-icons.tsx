import { SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiReact, SiNodedotjs, SiMongodb, SiGraphql, SiPostgresql, SiRedis, SiSocketdotio, SiExpress, SiRedux, SiFirebase, SiFlutter, SiDocker, SiPython, SiFastapi, SiTensorflow } from 'react-icons/si';
import { FaKey } from 'react-icons/fa';
import React from 'react';

export const getTechIcon = (tech: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    'Next.js': <SiNextdotjs className="w-4 h-4" />,
    'TypeScript': <SiTypescript className="w-4 h-4 text-blue-600" />,
    'Tailwind CSS': <SiTailwindcss className="w-4 h-4 text-cyan-500" />,
    'Framer Motion': <SiFramer className="w-4 h-4" />,
    'React': <SiReact className="w-4 h-4 text-blue-500" />,
    'Node.js': <SiNodedotjs className="w-4 h-4 text-green-600" />,
    'MongoDB': <SiMongodb className="w-4 h-4 text-green-500" />,
    'GraphQL': <SiGraphql className="w-4 h-4 text-pink-600" />,
    'PostgreSQL': <SiPostgresql className="w-4 h-4 text-blue-700" />,
    'Redis': <SiRedis className="w-4 h-4 text-red-600" />,
    'WebSockets': <SiSocketdotio className="w-4 h-4" />,
    'Express': <SiExpress className="w-4 h-4" />,
    'JWT': <FaKey className="w-4 h-4 text-purple-600" />,
    'Redux': <SiRedux className="w-4 h-4 text-purple-500" />,
    'Firebase': <SiFirebase className="w-4 h-4 text-orange-500" />,
    'Flutter': <SiFlutter className="w-4 h-4 text-blue-400" />,
    'Docker': <SiDocker className="w-4 h-4 text-blue-400" />,
    'Python': <SiPython className="w-4 h-4 text-yellow-500" />,
    'FastAPI': <SiFastapi className="w-4 h-4 text-green-500" />,
    'TensorFlow': <SiTensorflow className="w-4 h-4 text-orange-500" />,
  };

  return iconMap[tech] || <span className="w-4 h-4">•</span>;
};
