import React, { useEffect, useState } from "react";
import { type NextRouter, withRouter } from "next/router";
import { ArrowUp } from "react-feather";
import { Button } from "reactstrap";

type WithRouterProps = {
  router: NextRouter;
};

type MyComponentProps = WithRouterProps & {
  className: string;
  showOffset: number;
};

const ScrollToTop = ({ className, showOffset }: MyComponentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      // if the user scrolls down, show the button
      window.scrollY > showOffset ? setIsVisible(true) : setIsVisible(false);
    };
    // listen for scroll events
    window.addEventListener("scroll", toggleVisibility);

    // clear the listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showOffset]);

  return (
    isVisible && (
      <div className={className}>
        <Button className="btn-icon" color="primary" onClick={scrollToTop}>
          <ArrowUp size={14} />
        </Button>
      </div>
    )
  );
};

export default withRouter(ScrollToTop);
