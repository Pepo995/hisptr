import FormInput from "@components/inputs/FormInput";
import { Loader } from "react-feather";

type Props = {
  error?: string;
  isTouched: boolean;
  onClick: () => void;
  loading?: boolean;
};

const PromotionalCodeInput = ({ error, isTouched, onClick, loading }: Props) => (
  <div className="tw-border-b tw-border-slate-light tw-py-5 tw-flex tw-flex-col">
    <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-black tw-font-bold tw-text-lg tw-gap-8 sm:tw-gap-4 lg:tw-gap-8">
      <FormInput
        name="promotionalCode"
        placeholder="Gift or discount code"
        error={error}
        isTouched={isTouched}
      />
      <button type="button" className="custom-btn3 tw-w-auto" onClick={onClick}>
        {loading ? (
          <span className="tw-flex tw-justify-center">
            <Loader />
          </span>
        ) : (
          "Apply"
        )}
      </button>
    </div>
  </div>
);

export default PromotionalCodeInput;
