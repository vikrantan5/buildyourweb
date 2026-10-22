import CrudManager from '@/components/admin/crud-manager';

export const metadata = { title: 'Services — Admin' };

export default function ServicesPage() {
  return (
    <CrudManager
      table="services"
      title="Services"
      hint="Shown in the Services section with prices."
      titleKey="title"
      defaults={{ title: '', description: '', features: [], price: '₹', icon: 'Globe', visible: true, sort_order: 0 }}
      fields={[
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Website Development' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What you offer' },
        { name: 'features', label: "What's included", type: 'list' },
        { name: 'price', label: 'Starting price', type: 'text', placeholder: '₹7,000 – ₹10,000' },
        { name: 'icon', label: 'Icon (Globe, Smartphone, PenTool, Sparkles, Wrench)', type: 'text' },
        { name: 'visible', label: 'Visible on site', type: 'switch' },
      ]}
    />
  );
}
