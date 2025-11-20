'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { RitualStyle, ritualStyles } from './RitualStyleBadge';

interface RitualStyleSelectorProps {
  selectedStyle: RitualStyle | null;
  onStyleSelect: (style: RitualStyle) => void;
  variant?: 'grid' | 'carousel' | 'list';
}

export default function RitualStyleSelector({
  selectedStyle,
  onStyleSelect,
  variant = 'grid'
}: RitualStyleSelectorProps) {
  const [hoveredStyle, setHoveredStyle] = useState<RitualStyle | null>(null);

  const styles = Object.entries(ritualStyles) as [RitualStyle, typeof ritualStyles[keyof typeof ritualStyles]][];

  return (
    <div className="w-full">
      {/* Title with gothic decoration */}
      <div className="mb-6 text-center">
        <motion.h2
          className="font-display text-2xl text-bone-200 tracking-wider uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-bloodstain-700 mr-2">✠</span>
          選ばれし儀式
          <span className="text-bloodstain-700 ml-2">✠</span>
        </motion.h2>
        <p className="font-mystical text-sm text-bone-500 italic mt-2">
          Electa Ritualis
        </p>
      </div>

      {/* Grid Layout */}
      {variant === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styles.map(([key, config], index) => (
            <motion.button
              key={key}
              className={`
                relative p-4 rounded
                bg-gradient-to-br from-abyss-800 to-abyss-900
                border-2 transition-all duration-300
                ${selectedStyle === key
                  ? `border-bloodstain-600 ${config.glowColor}`
                  : 'border-moonlight-700/50 hover:border-moonlight-600'
                }
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onStyleSelect(key)}
              onMouseEnter={() => setHoveredStyle(key)}
              onMouseLeave={() => setHoveredStyle(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection indicator */}
              {selectedStyle === key && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-bloodstain-700 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-bone-200 text-xs">✓</span>
                </motion.div>
              )}

              {/* Gothic corner decorations */}
              <div className={`
                absolute top-0 left-0 w-3 h-3 border-t border-l
                ${hoveredStyle === key ? 'border-bloodstain-700' : 'border-moonlight-800/30'}
                transition-colors duration-300
              `} />
              <div className={`
                absolute top-0 right-0 w-3 h-3 border-t border-r
                ${hoveredStyle === key ? 'border-bloodstain-700' : 'border-moonlight-800/30'}
                transition-colors duration-300
              `} />

              {/* Main content */}
              <div className="text-center">
                {/* Symbol with glow effect */}
                <motion.div
                  className={`
                    text-3xl mb-3 inline-block
                    ${hoveredStyle === key ? config.glowColor : ''}
                  `}
                  animate={hoveredStyle === key ? {
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5 }
                  } : {}}
                >
                  {config.symbol}
                </motion.div>

                {/* Japanese name */}
                <h3 className="font-mystical text-bone-200 text-lg mb-1">
                  {config.name}
                </h3>

                {/* Latin name with decorative elements */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-moonlight-600 text-xs">{config.decorativeChar}</span>
                  <p className="font-accent text-xs text-bone-400 italic">
                    {config.latinName}
                  </p>
                  <span className="text-moonlight-600 text-xs">{config.decorativeChar}</span>
                </div>

                {/* Gradient indicator bar */}
                <div className={`
                  h-1 w-full rounded-full
                  bg-gradient-to-r ${config.primaryColor}
                  ${selectedStyle === key ? 'opacity-100' : 'opacity-50'}
                  transition-opacity duration-300
                `} />
              </div>

              {/* Gothic corner decorations (bottom) */}
              <div className={`
                absolute bottom-0 left-0 w-3 h-3 border-b border-l
                ${hoveredStyle === key ? 'border-bloodstain-700' : 'border-moonlight-800/30'}
                transition-colors duration-300
              `} />
              <div className={`
                absolute bottom-0 right-0 w-3 h-3 border-b border-r
                ${hoveredStyle === key ? 'border-bloodstain-700' : 'border-moonlight-800/30'}
                transition-colors duration-300
              `} />
            </motion.button>
          ))}
        </div>
      )}

      {/* List Layout */}
      {variant === 'list' && (
        <div className="space-y-3">
          {styles.map(([key, config], index) => (
            <motion.button
              key={key}
              className={`
                relative w-full p-3 rounded
                bg-gradient-to-r from-abyss-800 to-abyss-900
                border-2 transition-all duration-300
                ${selectedStyle === key
                  ? `border-bloodstain-600 ${config.glowColor}`
                  : 'border-moonlight-700/50 hover:border-moonlight-600'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onStyleSelect(key)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                {/* Left side: Icon and names */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.symbol}</span>
                  <div className="text-left">
                    <p className="font-mystical text-bone-200">
                      {config.name}
                    </p>
                    <p className="font-accent text-xs text-bone-500 italic">
                      {config.latinName}
                    </p>
                  </div>
                </div>

                {/* Right side: Selection indicator */}
                <AnimatePresence>
                  {selectedStyle === key && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="text-bloodstain-600 text-xl"
                    >
                      ✠
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Description of selected style */}
      <AnimatePresence mode="wait">
        {selectedStyle && (
          <motion.div
            key={selectedStyle}
            className="mt-6 p-4 bg-abyss-900/50 border border-moonlight-800/30 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="font-body text-bone-400 text-sm text-center italic">
              {selectedStyle === 'infernal_rite' && '業火の力を操り、敵を焼き尽くす古の儀式。地獄の炎が全てを灰へと帰す。'}
              {selectedStyle === 'frozen_curse' && '永遠の氷に封じ込める呪い。凍てつく冷気が魂までも凍結させる。'}
              {selectedStyle === 'shadow_whisper' && '闇の中から忍び寄る囁き。影が実体を持ち、恐怖を具現化する。'}
              {selectedStyle === 'blood_pact' && '血による永遠の契約。一度結ばれた盟約は死をもってしか解かれない。'}
              {selectedStyle === 'danse_macabre' && '死者たちの狂宴。骸骨が踊り、生者を死の舞踏へと誘う。'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}