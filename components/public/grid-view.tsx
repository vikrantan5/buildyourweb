'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/types/database';
import ProjectCard from './project-card';

export default function GridView({ projects }: { projects: Project[] }) {
  return (
    <div className="mx-auto max-w-7xl columns-1 gap-6 px-5 sm:columns-2 md:px-8 lg:columns-3" data-testid="grid-view">
      {projects.map((p, i) => (
        <motion.div
          key={p.id}
          layout
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
          className="mb-6 break-inside-avoid"
        >
          <ProjectCard project={p} className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}
