'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { TimelineMilestone } from '@/types/content';

interface TimelineProps {
  milestones: TimelineMilestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section
      id="timeline"
      className="bg-white py-20"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-[900px] mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-ibm)] font-semibold text-[clamp(2.5rem,5vw,4rem)] leading-[1.2] text-[#151715]">
            Our <span className="text-[var(--color-primary)]">Journey</span>
          </h2>
        </div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Timeline Line */}
          <div
            className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-[var(--color-primary)] -translate-x-1/2"
            aria-hidden="true"
          />

          {/* Milestones */}
          {milestones.map((milestone, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.article
                key={index}
                variants={itemVariants}
                className={`relative mb-16 last:mb-0 flex items-center ${
                  isEven ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`w-[calc(50%-2rem)] ${isEven ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-[#E9ECF2] p-6 rounded-xl shadow-md">
                    <h3 className="font-[var(--font-ibm)] text-xl font-semibold text-[#151715] mb-2">
                      {milestone.title}
                    </h3>
                    <p className="font-[var(--font-nunito)] text-base text-[#151715] leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Year Badge */}
                <div className="absolute left-[50%] -translate-x-1/2 z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-primary)] rounded-full shadow-lg">
                    <span className="font-[var(--font-ibm)] text-white text-sm font-bold">
                      {milestone.year}
                    </span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-[calc(50%-2rem)]" />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
