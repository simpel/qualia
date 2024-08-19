import Link, { LinkProps } from 'next/link';

interface IButtonCard {
  children: string;
  link: LinkProps;
}

const ButtonCard = ({ children, link }: IButtonCard) => {
  return (
    <Link
      className={[
        'flex aspect-video h-36 items-end justify-end rounded-xl p-4 text-white shadow-2xl transition-all duration-300  ',
        'active:scale-0.95 active:shadow-inner active:shadow-none',
        'bg-gradient-to-bl from-indigo-500 via-blue-500 to-sky-400',
        'hover:from-indigo-600 hover:via-blue-600 hover:to-sky-500 hover:text-blue-50',
        'hover:scale-1.05 hover:underline hover:shadow-none',
      ].join(' ')}
      {...link}
    >
      <span className="text-md font-semibold">{children}</span>
    </Link>
  );
};

export default ButtonCard;
