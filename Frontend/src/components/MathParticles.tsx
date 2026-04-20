import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const MathParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-10"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.8,
                color: "#475569" // slate-600, much darker for hover
              },
            },
          },
        },
        particles: {
          color: {
            // Darker, more vivid versions of the colors
            value: ["#1d4ed8", "#047857", "#6d28d9"], 
          },
          links: {
            color: "#64748b", // slate-500
            distance: 150,
            enable: true,
            opacity: 0.5, // Increased opacity
            width: 1.5, // Slightly thicker
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1.2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 800,
              height: 800,
            },
            value: 40,
          },
          opacity: {
            // Reduced transparency so they stand out more
            value: { min: 0.5, max: 0.9 },
          },
          shape: {
            type: "char",
            options: {
              char: {
                value: ["∑", "π", "±", "√", "∫", "∞", "Ω", "Δ", "θ", "α", "β"],
                font: "Verdana",
                style: "",
                weight: "700", // Thicker font
              }
            }
          },
          size: {
            // Slightly larger font size
            value: { min: 16, max: 28 }, 
          },
        },
        detectRetina: true,
      }}
    />
  );
};
