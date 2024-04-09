import Logo from "@images/logo/hipstr-logo.webp";
import Link from "next/link";
import NavbarDropdown from "@components/NavbarDropdown";
import Image from "next/image";

const experiencesItems = [
  { name: "HALO", description: "The Ultimate Photo Booth Package", url: "/halo" },
  { name: "ARRAY", description: "Stunning 3D GIFs", url: "/array" },
  { name: "360°", description: "Captivating 360° Video", url: "/360" },
  {
    name: "SOCIAL PHOTOGRAPHER",
    description: "Mobile professional photographer",
    url: "/social-photographer",
  },
  { name: "MOSAIC", description: "Make art with your moments", url: "/mosaic" },
  { name: "CUSTOM EVENTS", description: "The sky is the limit", url: "/custom-events" },
];

const HomeHeader = () => (
  <div className="tw-sticky tw-top-0 tw-z-40 ">
    <header className="ubuntu tw-bg-black xl:tw-h-16 md:tw-h-16 tw-h-10 tw-w-full tw-top-0 tw-left-0">
      <nav className="tw-flex tw-flex-row tw-h-full tw-items-center tw-justify-between tw-mx-auto tw-w-[91%]">
        <Link href="/" className="tw-justify-self-start">
          <Image src={Logo.src} alt="hipstr" width="93" height="30" />
        </Link>

        <div className="tw-flex tw-gap-x-5 tw-items-center tw-mb-0">
          <NavbarDropdown buttonText="EXPERIENCES" items={experiencesItems} />
          <Link href="/book-now" className="tw-h-full">
            <button className="custom-btn8-primary tw-bg-primary tw-w-fit tw-rounded-lg md:tw-text-xl tw-tw-text-sm tw-h-min tw-min-h-min tw-mb-0 hover:tw-bg-primary">
              BOOK NOW
            </button>
          </Link>
        </div>
      </nav>
    </header>
  </div>
);

export default HomeHeader;
