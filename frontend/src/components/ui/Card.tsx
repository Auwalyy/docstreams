import { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export const Card = ({ title, children, className = '', action }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {title && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);
