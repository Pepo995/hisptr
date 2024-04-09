import { Check } from "react-feather";

type Props = { text: string };

const IncludedTag = ({ text }: Props) => (
  <li className="tw-flex tw-items-start tw-py-2 tw-gap-2">
    <Check
      size={24}
      className="tw-h-6 tw-w-6 tw-text-primary mr-6 tw-flex-none"
    />
    <p className="tw-font-montserrat tw-font-bold tw-text-sm tw-my-auto tw-text-black">
      {text}
    </p>
  </li>
);

export default IncludedTag;
