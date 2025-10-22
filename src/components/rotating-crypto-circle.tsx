
'use client';

import React, { useState, useEffect, forwardRef, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CryptoIcon } from './crypto-icon';
import { Zap, Eye, Trophy, Wallet } from 'lucide-react';

const featureIcons = [
  { component: <Zap />, key: 'zap' },
  { component: <CryptoIcon token="BTC" />, key: 'btc' },
  { component: <Eye />, key: 'eye' },
  { component: <CryptoIcon token="ETH" />, key: 'eth' },
  { component: <Trophy />, key: 'trophy' },
  { component: <CryptoIcon token="SOL" />, key: 'sol' },
  { component: <Wallet />, key: 'wallet' },
  { component: <CryptoIcon token="DOGE" />, key: 'doge' },
  { component: <CryptoIcon token="LINK" />, key: 'link' },
  { component: <CryptoIcon token="AVAX" />, key: 'avax' },
  { component: <CryptoIcon token="SHIB" />, key: 'shib' },
  { component: <CryptoIcon token="UNI" />, key: 'uni' },
];

function getRandomPosition(radius: number) {
  const angle = Math.random() * 2 * Math.PI;
  const r = radius * (0.5 + Math.random() * 0.8);
  return {
    x: r * Math.cos(angle),
    y: r * Math.sin(angle),
  };
}


const IconContainer = forwardRef<
  HTMLDivElement,
  {
    children?: ReactNode;
    className?: string;
    [key: string]: any;
  }
>(({ children, className, ...rest }, ref) => {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-inner",
        className
      )}
    >
      <div className="absolute inset-0 z-0 rounded-full bg-primary/20 blur-lg animate-pulse-slow" />
      <div className="relative z-20">{children}</div>
    </div>
  );
});
IconContainer.displayName = "IconContainer";

const OrbitingIcon = ({ icon, index, total, radius, animationState, scatteredPosition }: any) => {
    const angle = (index / total) * 2 * Math.PI;
    const orbitingX = radius * Math.cos(angle);
    const orbitingY = radius * Math.sin(angle);

    const getTargetPosition = () => {
        switch (animationState) {
            case 'scatter':
                return scatteredPosition;
            case 'centralize':
            case 'orbit':
                return { x: orbitingX, y: orbitingY };
            default:
                return { x: 0, y: 0 };
        }
    };
    
    return (
        <motion.div
            key={icon.key}
            className="absolute"
            style={{ top: '50%', left: '50%' }}
            initial={scatteredPosition}
            animate={getTargetPosition()}
            transition={{
                type: 'spring',
                stiffness: 40,
                damping: 15,
                mass: 1,
            }}
        >
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-card border-2 shadow-md -translate-x-1/2 -translate-y-1/2">
                {React.cloneElement(icon.component, { className: "h-6 w-6 text-muted-foreground" })}
            </div>
        </motion.div>
    )
}

const CryptoFeatureWeb = () => {
  const [isClient, setIsClient] = useState(false);
  const [animationState, setAnimationState] = useState<'scatter' | 'centralize' | 'orbit'>('scatter');
  const [scatteredPositions, setScatteredPositions] = useState<Array<{x: number, y: number}>>([]);
  const radius = 130;

  useEffect(() => {
    setIsClient(true);
    setScatteredPositions(featureIcons.map(() => getRandomPosition(radius * 1.5)));
  }, []);
  
  useEffect(() => {
    if (!isClient) return;

    const sequence = ['scatter', 'centralize', 'orbit'];
    let currentIndex = 0;

    const runAnimationCycle = () => {
        const currentState = sequence[currentIndex % sequence.length];
        
        setAnimationState(currentState as any);

        if (currentState === 'scatter') {
             setScatteredPositions(featureIcons.map(() => getRandomPosition(radius * 1.5)));
        }
        
        // Define the duration for each state
        let duration = 4000;
        if (currentState === 'centralize') {
            duration = 2000; // Hold the circle for 2s before rotating
        }

        setTimeout(() => {
            currentIndex++;
            runAnimationCycle();
        }, duration);
    };

    const initialTimeout = setTimeout(runAnimationCycle, 100);

    return () => clearTimeout(initialTimeout);
}, [isClient]);


  if (!isClient) {
    return <div className="mx-auto h-[350px] w-full" />;
  }

  return (
    <div className="relative flex w-full items-center justify-center mx-auto h-[350px]">
      <motion.div
        className="relative h-full w-full"
        animate={{ rotate: animationState === 'orbit' ? 360 : 0 }}
        transition={{
            duration: 40,
            ease: "linear",
            repeat: animationState === 'orbit' ? Infinity : 0,
        }}
      >
        <AnimatePresence>
          {isClient && scatteredPositions.length > 0 && featureIcons.map((icon, index) => (
            <OrbitingIcon
              key={icon.key}
              icon={icon}
              index={index}
              total={featureIcons.length}
              radius={radius}
              animationState={animationState}
              scatteredPosition={scatteredPositions[index]}
            />
          ))}
        </AnimatePresence>
      </motion.div>
        
      <motion.div
        className="absolute z-20"
        initial={{scale: 0.9}}
        animate={{ scale: animationState === 'scatter' ? 0.9 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <IconContainer>
            <LogoIcon />
        </IconContainer>
      </motion.div>
    </div>
  );
};

export { CryptoFeatureWeb };

function LogoIcon() {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 784 464"
      enableBackground="new 0 0 784 464"
      xmlSpace="preserve"
      className="h-10 w-10 text-primary"
    >
      <path
        fill="currentColor"
        d="
M502.007019,336.001587 
	C470.929077,308.511230 440.102692,281.270081 409.277649,254.027451 
	C408.653442,253.475754 408.078979,252.862381 407.423096,252.352676 
	C403.232361,249.095749 401.547577,246.023178 403.276031,239.822342 
	C408.936829,219.514053 394.400696,200.390900 373.373779,199.545593 
	C368.089203,199.333160 362.716248,200.419601 358.018616,203.261230 
	C355.286194,204.914108 353.319275,204.418900 350.955261,202.307251 
	C324.994110,179.117294 298.954010,156.015549 272.900085,132.929642 
	C254.326172,116.471649 235.696838,100.076256 217.099396,83.644814 
	C215.871445,82.559860 214.357346,81.709305 213.821655,79.877090 
	C215.088837,77.940300 217.099548,78.752594 218.761124,78.742531 
	C230.425629,78.671875 242.097595,78.946693 253.752533,78.607498 
	C258.676208,78.464211 262.296600,80.102638 265.829956,83.269501 
	C288.162140,103.285255 310.596039,123.187592 333.000427,143.122787 
	C344.575958,153.422623 356.156586,163.716751 367.746674,174.000214 
	C368.604126,174.761002 369.556671,175.414642 370.412445,176.077393 
	C372.897339,175.480560 374.082184,173.526535 375.479797,171.959137 
	C401.647705,142.611710 427.822174,113.269691 453.841370,83.790680 
	C456.947876,80.271103 460.053925,78.562950 464.911285,78.600822 
	C493.405426,78.823013 521.902161,78.704422 550.398071,78.700806 
	C552.366638,78.700562 554.335205,78.700775 556.303772,78.700775 
	C556.638000,79.184830 556.972290,79.668884 557.306519,80.152946 
	C514.077759,128.807266 470.849060,177.461578 427.095001,226.707138 
	C490.561615,283.221313 553.666504,339.413391 616.795654,395.627075 
	C614.994873,397.989197 613.011963,397.214935 611.327759,397.225555 
	C599.829895,397.298126 588.328674,397.119385 576.834473,397.335693 
	C572.869385,397.410309 569.781799,396.198364 566.907288,393.632965 
	C551.249573,379.658875 535.541321,365.741302 519.844788,351.810638 
	C513.990662,346.615082 508.121216,341.436798 502.007019,336.001587 
z"
      />
      <path
        fill="currentColor"
        d="
M260.820160,300.839081 
	C280.853333,278.338654 300.655121,256.107697 320.795441,233.496689 
	C263.168701,182.200897 206.012634,131.324097 148.630005,80.245605 
	C149.706787,79.444626 150.075089,78.931305 150.447144,78.928596 
	C162.440369,78.841057 174.434006,78.810989 186.427475,78.749794 
	C188.646301,78.738480 190.122253,80.103569 191.618347,81.423889 
	C208.100372,95.969490 224.575241,110.523216 241.047394,125.079994 
	C266.004639,147.135254 290.962616,169.189667 315.910858,191.255096 
	C324.395264,198.759079 332.785522,206.371368 341.363129,213.766800 
	C343.698242,215.780075 343.804230,217.582718 342.773407,220.289612 
	C335.936066,238.244217 346.440735,256.181366 361.987518,261.723907 
	C370.482422,264.752411 378.783081,264.347992 386.607178,260.166168 
	C390.130981,258.282776 392.300262,258.955688 394.955780,261.320892 
	C410.132019,274.837677 425.413422,288.236267 440.618805,301.720428 
	C466.288513,324.484375 491.920380,347.290985 517.584595,370.061157 
	C526.553345,378.018555 535.572876,385.918762 544.561096,393.854309 
	C545.291931,394.499542 546.096619,395.137878 546.030823,396.333130 
	C544.693237,397.863831 542.916260,397.233368 541.360840,397.242340 
	C531.029968,397.301971 520.695862,397.139557 510.368591,397.342529 
	C506.592285,397.416748 503.732666,396.250732 500.945404,393.765076 
	C462.522003,359.499359 424.034973,325.305084 385.550354,291.108124 
	C382.709961,288.584167 379.768616,286.173889 376.565186,283.447815 
	C370.439484,290.293121 364.550323,296.821625 358.717957,303.400513 
	C331.863678,333.692230 305.017578,363.991211 278.198425,394.314026 
	C276.427185,396.316681 274.465210,397.350739 271.708099,397.345490 
	C241.547546,397.288116 211.386826,397.317200 181.226181,397.297333 
	C179.946075,397.296509 178.549530,397.552673 176.639771,395.636780 
	C204.599030,364.154114 232.593918,332.631317 260.820160,300.839081 
z"
      />
    </svg>
  );
}

    