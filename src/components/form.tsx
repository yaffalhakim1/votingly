interface Props {
  value: string;
  placeHolder: string;
  className?: string;
  onChange?: (value: string) => void;
  type?: string;
}

export default function Form(props: Props) {
  return (
    <input
      type={props.type ? props.type : "text"}
      className={`bg-zinc-100 py-2 px-3 ${props.className}`}
      placeholder={props.placeHolder}
      onChange={(e) => props.onChange && props.onChange(e.target.value)}
      value={props.value}
    />
  );
}
