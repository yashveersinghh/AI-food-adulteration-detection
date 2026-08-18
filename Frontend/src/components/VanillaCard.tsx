import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onSelect?: () => void;
  imageSrc?: string;
}

export const VanillaCard: React.FC<Props> = ({ onSelect, imageSrc = "/image/vanilla.png" }) => {
  return (
    <div 
      onClick={onSelect}
      className="group relative flex flex-col items-center justify-between cursor-pointer py-4"
    >
      <div className="relative w-44 h-44 flex flex-col items-center justify-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-36 h-36 flex items-center justify-center"
        >
          <img
            src={imageSrc}
            alt="Vanilla Extract"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 0.85, 1], opacity: [0.25, 0.15, 0.25] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-2 bg-black/15 rounded-full blur-xs mt-2"
        />
      </div>
      <h3 className="font-semibold text-base text-[#111111] group-hover:text-[#E06D53] transition-colors mt-2">
        Vanilla Extract
      </h3>
    </div>
  );
};

export default VanillaCard;