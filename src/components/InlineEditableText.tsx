import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface InlineEditableTextProps {
  value: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  maxLength?: number;
}

export function InlineEditableText({
  value,
  onSubmit,
  placeholder,
  className,
  multiline = false,
  maxLength
}: InlineEditableTextProps) {
  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      const input = inputRef.current;
      input?.focus();
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(value);
      setIsEditing(false);
      return;
    }
    if (trimmed !== value) {
      onSubmit(trimmed);
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    event
  ) => {
    if (event.key === 'Enter' && !multiline && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
    if (event.key === 'Escape') {
      setDraft(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const Component = multiline ? 'textarea' : 'input';
    return (
      <Component
        ref={inputRef as never}
        value={draft}
        onChange={(event) =>
          (!maxLength || event.target.value.length <= maxLength) && setDraft(event.target.value)
        }
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsx(
          'w-full resize-none rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900',
          multiline && 'min-h-[3.5rem]',
          className
        )}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={clsx(
        'inline-flex w-full text-left transition hover:scale-[1.01] hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
        className
      )}
    >
      {value || (
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
          {placeholder ?? 'Add text'}
        </span>
      )}
    </button>
  );
}
