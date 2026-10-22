import CrudManager from '@/components/admin/crud-manager';

export const metadata = { title: 'Tech Stack — Admin' };

export default function TechStackPage() {
  return (
    <CrudManager
      table="tech_stack"
      title="Tech Stack"
      hint="Powers the orbit section and the tech filter on projects."
      titleKey="name"
      defaults={{ name: '', icon: '', description: '', visible: true, sort_order: 0 }}
      fields={[
        { name: 'name', label: 'Name', type: 'text', placeholder: 'React' },
        { name: 'icon', label: 'Icon (optional)', type: 'text' },
        { name: 'description', label: 'Description (tooltip)', type: 'textarea' },
        { name: 'visible', label: 'Visible on site', type: 'switch' },
      ]}
    />
  );
}
