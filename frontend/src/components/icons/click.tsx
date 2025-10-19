const Click = ({
  classname,
  onClick,
}: {
  classname?: string;
  onClick?: () => void;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className={classname}
      onClick={onClick}
    >
      <circle cx="32" cy="32" r="32" fill="#042784" />
      <path
        d="M33.3333 33.3333L41.3333 41.3333M20 20L29.4267 42.6267L32.7733 32.7733L42.6267 29.4267L20 20Z"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Click;
