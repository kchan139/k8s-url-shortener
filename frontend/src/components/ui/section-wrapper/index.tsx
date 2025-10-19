import { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  className?: string;
};

const Section = ({ children, className }: SectionProps) => {
  return (
    <div
      className={`${className ? className : ''} relative my-5 flex h-max w-full flex-col px-5 xs:px-[32px] sm:px-10 md:my-10 lg:px-[48px] xl:px-[80px] 2xl:px-[96px] 3xl:px-[calc(160px-(1920px-100vw)/3)]`}
    >
      {children}
    </div>
  );
};

export default Section;
