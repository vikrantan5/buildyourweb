import CrudManager from '@/components/admin/crud-manager';

export const metadata = { title: 'Stats — Admin' };

export default function StatsPage() {
  return (
    <CrudManager
      table="stats"
      title="Stats Counters"
      hint="Animated numbers in the About section."
      titleKey="label"
      defaults={{ label: '', value: 0, suffix: '+', visible: true, sort_order: 0 }}
      fields={[
        { name: 'label', label: 'Label', type: 'text', placeholder: 'Projects completed' },
        { name: 'value', label: 'Number', type: 'number' },
        { name: 'suffix', label: 'Suffix (+, %, none)', type: 'text' },
        { name: 'visible', label: 'Visible on site', type: 'switch' },
      ]}
    />
  );
}
