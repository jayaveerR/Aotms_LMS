import { motion } from "framer-motion";

const Tech3DAnimation = () => {
  return (
    <div className="w-full flex-1 max-h-[350px] lg:max-h-none min-h-[250px] relative flex md:flex flex-col items-center justify-center overflow-hidden bg-[#E9E9E9] border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8 p-4">
      {/* Background Dots */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Status Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white border-2 border-black text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2 rounded-3xl flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span className="w-2 h-2 bg-[#FD5A1A] rounded-full animate-pulse" />
        Neural Net Active
      </div>

      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center perspective-1000 z-10 [perspective:1000px]">
        {/* Core glowing 3D cube container */}
        <motion.div
          animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 [transform-style:preserve-3d]"
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white border-4 border-black opacity-90 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,117,207,0.5)] [transform:translateZ(40px)] sm:[transform:translateZ(48px)]">
            <span className="text-black font-black text-xs">AI</span>
          </div>
          {/* Back */}
          <div className="absolute inset-0 bg-[#0075CF] border-4 border-black opacity-90 [transform:translateZ(-40px)] sm:[transform:translateZ(-48px)] flex items-center justify-center">
            <span className="text-white font-black text-xs">ML</span>
          </div>
          {/* Left */}
          <div className="absolute inset-0 bg-[#FD5A1A] border-4 border-black opacity-90 [transform:rotateY(-90deg)_translateZ(40px)] sm:[transform:rotateY(-90deg)_translateZ(48px)]" />
          {/* Right */}
          <div className="absolute inset-0 bg-[#FD5A1A] border-4 border-black opacity-90 [transform:rotateY(90deg)_translateZ(40px)] sm:[transform:rotateY(90deg)_translateZ(48px)]" />
          {/* Top */}
          <div className="absolute inset-0 bg-black border-4 border-black opacity-90 [transform:rotateX(90deg)_translateZ(40px)] sm:[transform:rotateX(90deg)_translateZ(48px)]" />
          {/* Bottom */}
          <div className="absolute inset-0 bg-black border-4 border-black opacity-90 [transform:rotateX(-90deg)_translateZ(40px)] sm:[transform:rotateX(-90deg)_translateZ(48px)]" />
        </motion.div>

        {/* Orbiting rings */}
        <motion.div
          animate={{ rotateX: [60, 60], rotateZ: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-52 h-52 sm:w-64 sm:h-64 border-2 border-black rounded-full z-0 opacity-30 border-dashed"
        />

        <motion.div
          animate={{ rotateX: [70, 70], rotateY: [20, 20], rotateZ: [360, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 sm:w-80 sm:h-80 border-4 border-[#0075CF] rounded-full z-0 opacity-40 border-dotted"
        />

        {/* Floating tech cards around the cube */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-5%] sm:right-[-10%] bg-white border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-30 flex gap-2 items-center"
        >
          <div className="w-3 h-3 bg-[#0075CF] rounded-full" />
          <div className="w-12 h-1.5 bg-[#E9E9E9] rounded-full" />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[20%] left-[-5%] sm:left-[-10%] bg-black border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(253,90,26,1)] z-30"
        >
          <div className="flex gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-[#FD5A1A]" />
            <div className="w-10 h-1.5 bg-[#E9E9E9] rounded-full mt-1" />
          </div>
          <div className="w-16 h-1.5 bg-[#0075CF] rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default Tech3DAnimation;
