import type { ReactNode } from 'react';
import { Search, X } from 'lucide-react';

export function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, string> = {
    published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    draft: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    inactive: 'bg-stone-100 text-stone-500 ring-stone-500/20',
  };
  const tone = tones[status.toLowerCase()] ?? tones.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone}`}>
      <i className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 sm:max-w-xs">
      <Search size={17} className="shrink-0 text-stone-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
      />
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-stone-700">
        {label} {hint && <em className="ml-1 text-xs font-normal not-italic text-stone-400">{hint}</em>}
      </span>
      {children}
    </label>
  );
}

export function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <small className="text-xs uppercase tracking-wide text-stone-400">{label}</small>
      <strong className="text-sm font-medium text-stone-800">{value || '—'}</strong>
    </div>
  );
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
  cls
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  cls?:string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4" onClick={onClose}>
      <div
        className={`${cls} h-max w-full overflow-y-auto rounded-2xl bg-white px-5 shadow-xl sm:px-8 ${wide ? 'max-w-2xl' : 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className='mb-1 pt-2 border-b border-gray-300 w-full pb-2'>
            {/* <div className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">GWF WORKSPACE</div> */}
            <h2 className="mt-1 text-xl font-semibold text-stone-900">{title}</h2>
            <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-400 focus:border-[#d9aa3f] focus:ring-2 focus:ring-[#d9aa3f]/20';

export function ModalActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{children}</div>;
}

export function BtnPrimary({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-[#c99a34] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
    >
      {children}
    </button>
  );
}
