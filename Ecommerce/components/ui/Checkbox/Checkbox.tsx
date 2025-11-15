import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | ReactNode;
  description?: string;
}

export default function Checkbox({
  label,
  description,
  className,
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={checkboxId}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-brand-purple-600 focus:ring-2 focus:ring-brand-purple-500 focus:ring-offset-0',
            className
          )}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={checkboxId}
              className="cursor-pointer font-medium text-gray-700"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
