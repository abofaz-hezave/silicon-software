'use client';

import { BUDGET_OPTIONS, PROJECT_TYPE_OPTIONS } from '@repo/data/qualified-inquiry';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { useActionState } from 'react';

import { submitQualification } from '@/app/(marketing)/qualification/actions';
import {
  initialQualificationState,
  type QualificationField,
  type QualificationFormState,
} from '@/lib/qualification-form';

import { SubmitButton } from './submit-button';

const selectClassName =
  'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const textareaClassName =
  'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

interface QualificationFormProps {
  initialState?: QualificationFormState;
}

function errorProps(state: QualificationFormState, field: QualificationField) {
  const error = state.errors?.[field];

  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${field}-error` : undefined,
  };
}

function FieldError({
  state,
  field,
}: Readonly<{ state: QualificationFormState; field: QualificationField }>) {
  const error = state.errors?.[field];

  if (!error) {
    return null;
  }

  return (
    <p id={`${field}-error`} className="text-destructive text-sm">
      {error.join(' ')}
    </p>
  );
}

function QualificationForm({ initialState = initialQualificationState }: QualificationFormProps) {
  const [state, formAction] = useActionState(submitQualification, initialState);
  const values: NonNullable<QualificationFormState['values']> = state.values ?? {};

  return (
    <form key={state.attempt} action={formAction} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            defaultValue={values.name ?? ''}
            {...errorProps(state, 'name')}
          />
          <FieldError state={state} field="name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email ?? ''}
            {...errorProps(state, 'email')}
          />
          <FieldError state={state} field="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={200}
            defaultValue={values.company ?? ''}
            {...errorProps(state, 'company')}
          />
          <FieldError state={state} field="company" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="projectType">Project type</Label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue={values.projectType ?? ''}
            className={selectClassName}
            {...errorProps(state, 'projectType')}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError state={state} field="projectType" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="budget">Budget range</Label>
          <select
            id="budget"
            name="budget"
            required
            defaultValue={values.budget ?? ''}
            className={selectClassName}
            {...errorProps(state, 'budget')}
          >
            <option value="" disabled>
              Select a budget range
            </option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError state={state} field="budget" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">What would you like to improve?</Label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          defaultValue={values.message ?? ''}
          className={textareaClassName}
          {...errorProps(state, 'message')}
        />
        <FieldError state={state} field="message" />
      </div>
      <div className="flex flex-col gap-4">
        <p
          role="status"
          aria-live="polite"
          className={state.success ? 'text-primary text-sm' : 'text-destructive text-sm'}
        >
          {state.message}
        </p>
        <div>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

export { QualificationForm };
