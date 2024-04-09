const Icon = ({ white }: { white: boolean }) => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.1388 11.5951C11.1388 10.9354 11.6736 10.4007 12.3333 10.4007C12.9929 10.4007 13.5277 10.9354 13.5277 11.5951V18.7619C13.5277 19.4215 12.9929 19.9563 12.3333 19.9563C11.6736 19.9563 11.1388 19.4215 11.1388 18.7619V11.5951Z"
      fill={white ? "#FFF" : "#000"}
    />
    <path
      d="M12.3333 5.70855C11.6736 5.70855 11.1388 6.24333 11.1388 6.90301C11.1388 7.56269 11.6736 8.09747 12.3333 8.09747C12.9929 8.09747 13.5277 7.56269 13.5277 6.90301C13.5277 6.24333 12.9929 5.70855 12.3333 5.70855Z"
      fill={white ? "#FFF" : "#000"}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.3333 0.869629C5.73644 0.869629 0.388672 6.2174 0.388672 12.8142C0.388672 19.411 5.73644 24.7588 12.3333 24.7588C18.9301 24.7588 24.2778 19.411 24.2778 12.8142C24.2778 6.2174 18.9301 0.869629 12.3333 0.869629ZM2.77759 12.8142C2.77759 18.0917 7.05581 22.3699 12.3333 22.3699C17.6107 22.3699 21.8889 18.0917 21.8889 12.8142C21.8889 7.53676 17.6107 3.25855 12.3333 3.25855C7.05581 3.25855 2.77759 7.53676 2.77759 12.8142Z"
      fill={white ? "#FFF" : "#000"}
    />
  </svg>
);

export default Icon;
