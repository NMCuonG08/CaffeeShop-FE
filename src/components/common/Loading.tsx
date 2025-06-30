import React, { useEffect } from 'react';
import { hatch, bouncy, } from 'ldrs';
import 'ldrs/bouncy'

// Register LDRS components
if (typeof window !== 'undefined') {
  hatch.register();
  bouncy.register();
}

const link = "https://res.cloudinary.com/dj9r2qksh/video/upload/v1742444295/Recording_2025-03-20_111752_ynsddt.mp4";

 const Loadding = ({ isVisible = true, videoSource = link }) => {
  useEffect(() => {
    if (isVisible) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      document.querySelectorAll('body > *:not(.loading-overlay)').forEach(el => {
        el.setAttribute('aria-hidden', 'true');
      });

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);

        document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
          el.removeAttribute('aria-hidden');
        });
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden touch-none select-none animate-fade-in">
      <div className="flex flex-col items-center justify-center p-9 rounded-xl bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5),0_0_60px_rgba(255,255,255,0.1)] w-[90%] max-w-[320px] animate-pulse-shadow">
        <div className="flex flex-col items-center">
          {/* Using createElement to avoid TypeScript errors */}
          {React.createElement('l-bouncy', {
            size: "45",
            stroke: "5", 
            speed: "2.5",
            color: "white"
          })}
          
          <p className="text-white text-[1.3rem] mt-5 font-medium text-center animate-pulse-text">
            Please wait...
          </p>
          <div className="max-w-[280px] mt-6 rounded-lg overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)] transition-transform">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full block"
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loadding;
