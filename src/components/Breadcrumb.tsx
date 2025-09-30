import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    onClick?: () => void;
  }>;
  onBack?: () => void;
}

export function Breadcrumb({ items, onBack }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-4 mb-6">

      
      <nav className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            <button
              onClick={item.onClick}
              className={`${
                index === items.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              } ${item.onClick ? 'cursor-pointer' : 'cursor-default'}`}
              disabled={!item.onClick}
            >
              {item.label}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
}