import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({ icon: Icon, children, className = '' }: SectionTitleProps) {
  return (
    <div className={`flex items-center justify-center gap-3 mb-8 ${className}`}>
      <Icon className="h-6 w-6 md:h-8 md:w-8 text-[#C90010] flex-shrink-0" />
      <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-center">{children}</h2>
    </div>
  );
}
