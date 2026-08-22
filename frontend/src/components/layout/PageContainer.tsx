interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 xl:px-10 xl:py-8 ${className}`}>
      {children}
    </div>
  );
}
