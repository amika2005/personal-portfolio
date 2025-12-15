'use client';

import { useEffect, useRef, useState } from 'react';
import { Header } from "@/components/header";
import { SocialSidebar } from "@/components/social-slider";
import { Footer } from "@/components/footer";
import { TechCard } from "@/components/tech-card";
import { CustomCursor } from "@/components/custom-cursor";
import { Button } from "@/components/ui/button";
import { faHtml5, faCss3Alt, faSass, faJs, faVuejs, faReact, faNodeJs, faNpm, faGitAlt, faGithub, faDocker, faAws, faGit, faFlutter, faJava } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faCode, faWind, faCircleNotch, faCloud, faServer, faLayerGroup, faShieldAlt, faCodeBranch, faCube, faCubes, faRocket } from '@fortawesome/free-solid-svg-icons';

export default function ResumePage() {
  const [frontendVisible, setFrontendVisible] = useState(false);
  const [backendVisible, setBackendVisible] = useState(false);
  const [othersVisible, setOthersVisible] = useState(false);
  const [showCV, setShowCV] = useState(false);

  const frontendRef = useRef<HTMLDivElement>(null);
  const backendRef = useRef<HTMLDivElement>(null);
  const othersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.3 };

    const frontendObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setFrontendVisible(true);
    }, observerOptions);

    const backendObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBackendVisible(true);
    }, observerOptions);

    const othersObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setOthersVisible(true);
    }, observerOptions);

    if (frontendRef.current) frontendObserver.observe(frontendRef.current);
    if (backendRef.current) backendObserver.observe(backendRef.current);
    if (othersRef.current) othersObserver.observe(othersRef.current);

    return () => {
      frontendObserver.disconnect();
      backendObserver.disconnect();
      othersObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <CustomCursor />
      <Header />
      <SocialSidebar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tech I Use</h1>
              <div className="w-20 h-1.5 bg-red-500 rounded-full"></div>
            </div>
            <Button 
              onClick={() => setShowCV(true)}
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
            >
              My CV
            </Button>
          </div>

          {/* Frontend Technologies */}
          <div ref={frontendRef} className={`bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 ${frontendVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-base text-gray-600 dark:text-gray-400 italic mb-8">
              These include, but are not limited to, the technologies I use for building client-side applications
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-6">
              <TechCard icon={faHtml5} alt="HTML5" hoverColor="#E34F26" />
              <TechCard icon={faCss3Alt} alt="CSS3" hoverColor="#1572B6" />
              <TechCard icon={faJava} alt="Java" hoverColor="#ED8B00" />
              <TechCard icon={faWind} alt="Tailwind CSS" hoverColor="#38B2AC" />
              <TechCard icon={faJs} alt="JavaScript" hoverColor="#F7DF1E" />
              <TechCard icon={faVuejs} alt="Vue.js" hoverColor="#4FC08D" />
              <TechCard icon={faReact} alt="React" hoverColor="#61DAFB" />
              <TechCard icon={faFlutter} alt="Flutter" hoverColor="#02569B" />
            </div>
          </div>

          {/* Backend Technologies */}
          <div ref={backendRef} className={`bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 ${backendVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-base text-gray-600 dark:text-gray-400 italic mb-8">
              These include, but are not limited to, the technologies I use for building backend applications
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-6">
              <TechCard icon={faNodeJs} alt="Node.js" hoverColor="#339933" />
              <TechCard icon={faCube} alt="Deno" hoverColor="#000000" />
              <TechCard icon={faServer} alt="Express.js" hoverColor="#000000" />
              <TechCard icon={faShieldAlt} alt="NestJS" hoverColor="#E0234E" />
              <TechCard icon={faDatabase} alt="PostgreSQL" hoverColor="#336791" />
              <TechCard icon={faCubes} alt="MongoDB" hoverColor="#47A248" />
              <TechCard icon={faLayerGroup} alt="Prisma" hoverColor="#2D3748" />
              <TechCard icon={faCodeBranch} alt="TypeScript" hoverColor="#3178C6" />
            </div>
          </div>

          {/* Others */}
          <div ref={othersRef} className={`bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 ${othersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-base text-gray-600 dark:text-gray-400 italic mb-8">Others...and more!</p>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-9 gap-6">
              <TechCard icon={faNpm} alt="npm" hoverColor="#CB3837" />
              <TechCard icon={faGit} alt="Git" hoverColor="#F05032" />
              <TechCard icon={faGithub} alt="GitHub" hoverColor="#181717" />
              <TechCard icon={faCode} alt="Redis" hoverColor="#DC382D" />
              <TechCard icon={faDocker} alt="Docker" hoverColor="#2496ED" />
              <TechCard icon={faAws} alt="AWS" hoverColor="#FF9900" />
              <TechCard icon={faCircleNotch} alt="CircleCI" hoverColor="#343434" />
              <TechCard icon={faCloud} alt="Netlify" hoverColor="#00C7B7" />
              <TechCard icon={faRocket} alt="Heroku" hoverColor="#430098" />
            </div>
          </div>
        </div>
      </main>

      {/* CV Modal */}
      {showCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">My CV</h2>
              <Button
                onClick={() => setShowCV(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src="/cv.pdf"
                className="w-full h-full border-0 rounded"
                title="My CV"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
