import { QualificationForm } from '@/components/forms/qualification-form';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Qualification',
  description:
    'Tell us about your workflow, project type, and budget range. Silicon Software reviews each inquiry and replies by email.',
  path: '/qualification',
});

function QualificationPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">
        Qualification
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
        Tell us about the workflow you want to improve.
      </h1>
      <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-8">
        Share the business need, project type, budget range, and context for your engagement.
        Silicon Software reviews each inquiry and replies by email if it looks like a fit. We do not
        offer self-serve booking.
      </p>
      <div className="mt-12 max-w-3xl">
        <QualificationForm />
      </div>
    </section>
  );
}

export default QualificationPage;
