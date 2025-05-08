'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header; 