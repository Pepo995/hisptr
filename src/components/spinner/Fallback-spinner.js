// ** Logo
import logo from "@images/logo/hipster-logo.jpg";
import Image from "next/image";

const SpinnerComponent = () => {
  return (
    <div className="fallback-spinner app-loader">
      <Image className="fallback-logo" src={logo} alt="logo" />
      <div className="loading">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  );
};

export default SpinnerComponent;
