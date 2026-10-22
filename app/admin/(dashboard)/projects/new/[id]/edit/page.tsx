import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/project-form';
import { getTechStack } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database';

export const metadata = { title: 'Edit Project — Admin' };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.id).maybeSingle();
  if (!project) notFound();
  const { data: images } = await supabase.from('project_images').select('*').eq('project_id', params.id).order('sort_order');
  const tech = await getTechStack();
  return (
    <ProjectForm
      initial={{ ...(project as Project), images: (images ?? []) as Project['images'] }}
      techOptions={tech.map((t) => t.name)}
    />
  );
}
