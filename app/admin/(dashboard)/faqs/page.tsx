import CrudManager from '@/components/admin/crud-manager';

export const metadata = { title: 'FAQs — Admin' };

export default function FaqsPage() {
  return (
    <CrudManager
      table="faqs"
      title="FAQs"
      hint="Questions in the accordion on the homepage."
      titleKey="question"
      defaults={{ question: '', answer: '', visible: true, sort_order: 0 }}
      fields={[
        { name: 'question', label: 'Question', type: 'text' },
        { name: 'answer', label: 'Answer', type: 'textarea' },
        { name: 'visible', label: 'Visible on site', type: 'switch' },
      ]}
    />
  );
}
