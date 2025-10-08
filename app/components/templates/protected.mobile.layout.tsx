import type { ReactNode } from "react";

interface MobileLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export const MobileLayout = ({
  header,
  footer,
  children,
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-gray-900 ">
      {header && (
        <header className="w-full max-w-md p-4 border-b border-gray-200 bg-white">
          {header}
        </header>
      )}

      <main className="flex-1 w-full max-w-md flex flex-col items-stretch justify-start overflow-y-auto ">
        <div className="w-full flex flex-col gap-4 ">{children}</div>
      </main>

      {footer && (
        <footer className="w-full max-w-md p-4 border-t border-gray-200 bg-white">
          {footer}
        </footer>
      )}
    </div>
  );
};
