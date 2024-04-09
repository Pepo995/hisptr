type Faq = {
  question: string;
  answer: string;
};

const FAQSectionHalo = ({ questions, className }: { questions: Faq[]; className: string }) => (
  <div className="tw-bg-primary tw-text-white tw-py-10">
    <div className="md:tw-w-5/6 tw-w-full tw-px-3 md:tw-px-0 md:tw-mx-auto">
      <h3 className="md:tw-text-5xl tw-font-medium tw-text-4xl">FAQs</h3>

      <div className="tw-flex tw-flex-col tw-mt-3">
        {questions.map(({ question, answer }, index) => (
          <div key={index} className="md:tw-my-3 tw-my-2 tw-bg-secondary tw-px-6 tw-py-3">
            <p className="tw-text-[28px] md:tw-font-medium">{question}</p>

            <p className={`${className} md:tw-text-[20px] tw-text-lg tw-mt-3 tw-font-light`}>
              {answer}
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

export default FAQSectionHalo;
