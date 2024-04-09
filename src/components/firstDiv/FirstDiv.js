import Image from "@images/home/fisrt-label1.png";
import Text from "@images/home/text.png";
const FirstDiv = () => {
  return (
    <div className="wrapper-first">
      <div className="image-first position-relative">
        <img
          src={Image.src}
          alt="first-bannr"
          className="image-banner-f w-100 h-100"
        />
        <div className="overley-image w-100"></div>
        <div className="text-home">
          <img src={Text.src} alt="text" />
        </div>
      </div>
    </div>
  );
};

export default FirstDiv;
