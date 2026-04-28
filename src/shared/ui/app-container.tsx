import { cn } from "../lib/utils";

export const AppContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("w-full max-w-full lg:max-w-293 mx-auto px-4", className)}>
    {children}
  </div>
);
