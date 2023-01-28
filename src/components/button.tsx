interface Props {
  text: string;

  type?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export default function Button(props: Props) {
  return (
    <button
      disabled={props.isLoading}
      onClick={() => props.onClick && props.onClick()}
      className={`bg-black px-4 py-2 text-white hover:bg-zinc-800
    ${
      props.type === "secondary"
        ? "bg-white text-black border-2 border-black hover:text-white hover:bg-zinc-900"
        : ""
    }
    ${props.className}
    `}
    >
      {props.isLoading ? "loading..." : props.text}
    </button>
  );
}
