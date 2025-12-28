import React from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Code2 } from "lucide-react";
import Image from "next/image";


export default function WidgetSection() {
  const features = [
    {
      title: "Real-time Transaction Dashboard",
      description:
        "Monitor all your payments, subscriptions, and credit transactions in one unified dashboard with live updates.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r border-border",
    },
    {
      title: "Platform Integrations",
      description:
        "Seamlessly integrate with BetterAuth, Medusa, AI SDK, UploadThing, and more with our ready-to-use adapters.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 border-border",
    },
    {
      title: "Developer Documentation",
      description:
        "Get started in minutes with comprehensive guides, code examples, and interactive API documentation.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r border-border",
    },
    {
      title: "Global Stellar Network",
      description:
        "Leverage the Stellar blockchain network for fast, low-cost payments that work anywhere in the world.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-foreground">
          Everything you need to accept crypto payments
        </h4>

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-muted-foreground text-center font-normal">
          From metered billing to subscriptions, from one-time payments to credit systems—Stellar Tools provides
          all the APIs and integrations you need to bring crypto-native payments to your platform.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-border">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-foreground text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-muted-foreground text-center font-normal",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-card shadow-2xl group h-full rounded-lg border border-border">
        <div className="flex flex-1 w-full h-full flex-col space-y-3">
          {/* Mock Dashboard UI */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-4 w-20 bg-muted rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-16 bg-muted/50 rounded"></div>
            <div className="h-16 bg-muted/50 rounded"></div>
            <div className="h-16 bg-muted/50 rounded"></div>
          </div>
          <div className="h-32 bg-muted/30 rounded"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-2 w-full bg-primary/20 rounded"></div>
            <div className="h-2 w-full bg-primary/30 rounded"></div>
            <div className="h-2 w-full bg-primary/40 rounded"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-background via-background to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-background via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full group/image">
      <div className="w-full mx-auto bg-card border border-border rounded-lg group h-full p-6">
        <div className="flex flex-1 w-full h-full flex-col space-y-3 relative">
          {/* Code block mockup */}
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <div className="h-3 w-24 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-muted/50 rounded"></div>
            <div className="h-3 w-3/4 bg-muted/50 rounded"></div>
            <div className="h-3 w-full bg-primary/20 rounded"></div>
            <div className="h-3 w-5/6 bg-muted/50 rounded"></div>
            <div className="h-3 w-full bg-primary/20 rounded"></div>
            <div className="h-3 w-4/5 bg-muted/50 rounded"></div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <div className="h-2 w-16 bg-primary/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate random rotations (called outside render)
const generateRotations = (count: number): number[] =>
  Array.from({ length: count }, () => Math.random() * 20 - 10);

export const SkeletonTwo = () => {
  // Platform integration logos with actual images - separate arrays for each row
  const topRowPlatforms = [
    { 
      name: "BetterAuth", 
      logo: "/images/integrations/better-auth.png",
    },
    { 
      name: "Medusa", 
      logo: "/images/integrations/medusa.svg",
    },
    { 
      name: "AI SDK", 
      logo: "/images/integrations/aisdk.jpg",
    },
    { 
      name: "UploadThing", 
      logo: "/images/integrations/uploadthing.png",
    },
  ];

  const bottomRowPlatforms = [
    { 
      name: "Shopify", 
      logo: "/images/integrations/shopify.png",
    },
    { 
      name: "PayloadCMS", 
      logo: "/images/integrations/payloadcms.png",
    },
    { 
      name: "Clerk", 
      logo: "/images/integrations/clerk.png",
    },
  ];

  // Generate rotations once using useState with lazy initializer to avoid calling Math.random during render
  const [firstRowRotations] = useState(() => generateRotations(topRowPlatforms.length));
  const [secondRowRotations] = useState(() => generateRotations(bottomRowPlatforms.length));

  const cardVariants = {
    whileHover: {
      scale: 1.05,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.05,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-20">
        {topRowPlatforms.map((platform, idx) => (
          <motion.div
            variants={cardVariants}
            key={"platforms-first" + idx}
            style={{
              rotate: firstRowRotations[idx],
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-3 bg-card border border-border shrink-0 overflow-hidden shadow-sm"
          >
            <div className="h-16 w-16 md:h-24 md:w-24 flex items-center justify-center bg-background rounded-lg p-2">
              <Image
                src={platform.logo}
                alt={platform.name}
                width={80}
                height={80}
                className="h-full w-full object-contain rounded"
              />
            </div>
            <p className="text-xs md:text-sm font-medium mt-2 text-foreground text-center">
              {platform.name}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {bottomRowPlatforms.map((platform, idx) => (
          <motion.div
            key={"platforms-second" + idx}
            style={{
              rotate: secondRowRotations[idx],
            }}
            variants={cardVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-3 bg-card border border-border shrink-0 overflow-hidden shadow-sm"
          >
            <div className="h-16 w-16 md:h-24 md:w-24 flex items-center justify-center bg-background rounded-lg p-2">
              <Image
                src={platform.logo}
                alt={platform.name}
                width={80}
                height={80}
                className="h-full w-full object-contain rounded"
              />
            </div>
            <p className="text-xs md:text-sm font-medium mt-2 text-foreground text-center">
              {platform.name}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-100 inset-y-0 w-20 bg-gradient-to-r from-background to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-100 inset-y-0 w-20 bg-gradient-to-l from-background  to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // Stellar network locations - major nodes and exchanges
        { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.08 }, // New York
        { location: [51.5074, -0.1278], size: 0.06 }, // London
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
        { location: [52.5200, 13.4050], size: 0.04 }, // Berlin
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
