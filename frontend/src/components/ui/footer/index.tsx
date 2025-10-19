import Logo from '@/components/icons/logo';

const Footer = () => {
  return (
    <div className="relative bottom-0 left-0 z-20 mt-40 flex h-fit w-full flex-row items-center justify-between bg-white px-5 text-neutral xs:px-[32px] sm:px-10 lg:px-[48px] xl:px-[80px] 2xl:px-[96px] 3xl:mt-60 3xl:px-[calc(160px-(1920px-100vw)/3)]">
      <div className="my-14 grid size-full grid-cols-2 gap-10 2xl:grid-cols-4">
        <div className="size-full items-center justify-center">
          <Logo />
          <div className="mt-4 w-3/4">
            © 2024 URL Shortener Project. All rights reserved.
          </div>
        </div>
        <div>
          <div className="text-lg font-bold">Development Team</div>
          <div className="mt-4">Phan Quốc Khải (PM)</div>
          <div className="mt-2">Vũ Quỳnh Hương (Backend)</div>
          <div className="mt-2">Nông Thục Khuê (Backend)</div>
        </div>
        <div>
          <div className="text-lg font-bold">Development Team</div>
          <div className="mt-4">Đoàn Viết Tiến Đạt (Frontend)</div>
          <div className="mt-2">Nghiêm Phạm Vỹ Nghi (Frontend)</div>
          <div className="mt-2">Trần Đình Đăng Khoa (UI/UX)</div>
        </div>
        <div>
          <div className="text-lg font-bold">Project Information</div>
          <div className="mt-4">HCMC University of Technology</div>
          <div className="mt-2">Programming Integration Project</div>
          <div className="mt-2">Supervised by Prof. Truong Tuan Anh</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
