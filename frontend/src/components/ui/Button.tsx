import { cn } from '../../lib/utils';
import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }: ButtonProps) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-white text-green-700 border border-green-600 hover:bg-green-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
      {children}
    </button>
  );
};
