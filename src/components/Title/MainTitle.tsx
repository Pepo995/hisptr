type MainTitleProps = {
  text?: string;
  className?: string;
  textSize?: "2xl" | "3xl";
};

const MainTitle = ({
  text = "Let’s Get this Party Started!",
  textSize = "2xl",
  className,
}: MainTitleProps) => (
  <h1
    className={`tw-font-montserrat tw-font-bold tw-text-black tw-mb-0 ${className}
    ${textSize === "2xl" ? "sm:tw-text-2xl" : "sm:tw-text-3xl"}`}
  >
    {text}
  </h1>
);

export default MainTitle;
