import Image from "next/image";

import Swarovski from "@images/home/logos/swarovski-logo.webp";
import Levis from "@images/home/logos/levis-logo.webp";
import JimmyChoo from "@images/home/logos/jimmy-choo-logo.webp";
import Lacroix from "@images/home/logos/lacroix-logo.webp";
import Instagram from "@images/home/logos/instagram-logo.webp";
import Antropologie from "@images/home/logos/anthropologie-logo.webp";
import Grammys from "@images/home/logos/grammys-awards-logo.webp";
import Disney from "@images/home/logos/disney-logo.webp";
import Coach from "@images/home/logos/coach-logo.webp";
import Tesla from "@images/home/logos/tesla-logo.webp";
import Sony from "@images/home/logos/sony-logo.webp";
import Meta from "@images/home/logos/meta-logo.webp";
import Audi from "@images/home/logos/audi-logo.webp";
import GQFashion from "@images/home/logos/gq-white-logo.webp";
import Google from "@images/home/logos/google-logo.webp";
import Apple from "@images/home/logos/apple-logo.webp";
import Hotels from "@images/home/logos/hotels-com-logo.webp";
import Amazon from "@images/home/logos/amazon-logo.webp";

const LogosList = [
  { name: "Swarovski", image: Swarovski, showInMobile: true },
  { name: "Levis", image: Levis, showInMobile: true },
  { name: "JimmyChoo", image: JimmyChoo, showInMobile: true },
  { name: "Lacroix", image: Lacroix, showInMobile: false },
  { name: "Instagram", image: Instagram, showInMobile: true },
  { name: "Antropologie", image: Antropologie, showInMobile: false },
  { name: "Grammys", image: Grammys, showInMobile: false },
  { name: "Disney", image: Disney, showInMobile: false },
  { name: "Coach", image: Coach, showInMobile: false },
  { name: "Tesla", image: Tesla, showInMobile: false, size: 90 },
  { name: "Sony", image: Sony, showInMobile: false, size: 90 },
  { name: "Meta", image: Meta, showInMobile: false, size: 90 },
  { name: "Audi", image: Audi, showInMobile: false, size: 80 },
  { name: "GQ", image: GQFashion, showInMobile: false, size: 65 },
  { name: "Google", image: Google, showInMobile: true },
  { name: "Apple", image: Apple, showInMobile: true, size: 40 },
  { name: "Hotels", image: Hotels, showInMobile: false },
  { name: "Amazon", image: Amazon, showInMobile: false, size: 90 },
];

const Trusted = ({ className }: { className: string }) => (
  <div className="ubuntu tw-mx-auto tw-bg-black tw-text-white md:tw-py-10 tw-py-5 xl:tw-px-28 md:tw-px-12 tw-px-1">
    <h3 className={`${className} tw-text-center tw-text-4xl md:tw-text-6xl tw-font-medium`}>
      Trusted by the best
    </h3>

    <div className="tw-grid lg:tw-grid-cols-9 md:tw-grid-cols-6 tw-grid-cols-3 md:tw-gap-y-2 tw-items-center tw-justify-between tw-mt-10">
      {LogosList.map(({ name, image, showInMobile, size }, index) => (
        <div
          className={`${
            showInMobile ? "tw-block center" : "tw-hidden md:tw-block"
          } tw-flex-auto tw-max-w-[100%] tw-place-self-center`}
          key={name}
        >
          <Image
            key={index}
            src={image}
            alt={name}
            className="tw-max-w-full md:tw-my-5"
            height={size ?? 100}
            width={size ?? 100}
          />
        </div>
      ))}
    </div>
  </div>
);

export default Trusted;
