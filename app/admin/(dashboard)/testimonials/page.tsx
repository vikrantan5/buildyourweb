import CrudManager from '@/components/admin/crud-manager';

export const metadata = { title: 'Testimonials — Admin' };

export default function TestimonialsPage() {
  return (
    <CrudManager
      table="testimonials"
      title="Testimonials"
      hint="The section hides itself when everything is toggled off."
      titleKey="name"
      defaults={{ name: '', role: '', quote: '', avatar_url: '', visible: true, sort_order: 0 }}
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'role', label: 'Role / company', type: 'text' },
        { name: 'quote', label: 'Quote', type: 'textarea' },
        { name: 'avatar_url', label: 'Avatar URL (optional)', type: 'text' },
        { name: 'visible', label: 'Visible on site', type: 'switch' },
      ]}
    />
  );
}
