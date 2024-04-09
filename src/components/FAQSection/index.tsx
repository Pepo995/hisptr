type Faq = {
  question: string;
  answer: string;
};

const FAQSection = ({ questions }: { questions: Faq[] }) => (
  <div className="tw-bg-primary tw-text-white tw-py-6">
    <div className="tw-w-5/6 tw-mx-auto">
      <h3 className="md:tw-text-3xl tw-text-lg">FAQs</h3>

      <div className="tw-flex tw-flex-col">
        {questions.map(({ question, answer }, index) => (
          <div key={index} className="tw-my-5 md:tw-text-2xl tw-text-base">
            <p className="tw-font-medium tw-underline">
              <span className="">QUESTION:</span> {question}
            </p>

            <p className="ubuntu tw-uppercase md:tw-text-[17px] tw-text-[13px]">
              <span className="tw-underline">ANSWER:</span> {answer}
            </p>
          </div>
        ))}
      </div>

      {/* <Link href="/faq">
        <button className="custom-btn9 tw-bg-white tw-text-primary tw-w-fit tw-mt-3 md:tw-text-xl tw-text-lg">
          MORE FAQS
        </button>
      </Link> */}
    </div>
  </div>
);

export default FAQSection;
