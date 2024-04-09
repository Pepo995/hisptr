import Facebook from "@components/icons/Facebook";
import Instagram from "@components/icons/Instagram";
import LinkedIn from "@components/icons/LinkedIn";

const SocialIcons = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className="tw-flex md:tw-gap-x-5 tw-gap-2 tw-justify-center tw-items-center">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.facebook.com/hipstrphotobooth/"
    >
      <Facebook isMobile={isMobile} />

      <p className="tw-sr-only">Facebook</p>
    </a>

    <a
      target="_blank"
      href="https://www.instagram.com/bookhipstr/"
      rel="noopener noreferrer"
    >
      <Instagram isMobile={isMobile} />
      <p className="tw-sr-only">Instagram</p>
    </a>

    <a
      target="_blank"
      href="https://www.linkedin.com/company/hipstr-photo-booth/"
      rel="noopener noreferrer"
    >
      <LinkedIn isMobile={isMobile} />
      <p className="tw-sr-only">Linkedin</p>
    </a>
  </div>
);

export default SocialIcons;
