import { CheckIcon } from "@heroicons/react/24/solid";

interface Props {
  className?: string;
  name: string;
  title?: string;
  index: number;
  percentage: number;
  onClick?: () => void;
  isSelected: boolean;
}

export default function CandidateItem(props: Props) {
  return (
    <div className="flex flex-row border border-zinc-100 p-5 rounded-md space-x-3">
      <div className="w-12 h-12 font-bold text-lg items-center flex justify-center bg-zinc-100 text-center">
        {props.index}
      </div>
      <div className="w-full ">
        <h3 className="text-lg font-bold ">{props.name}</h3>
        <p>{props.title}</p>

        {/* percentage */}
        <div className="flex flex-row items-center space-x-2 ">
          {/* bar */}
          <div className="w-full h-1 bg-zinc-100 rounded-full">
            <div>
              <div
                className="h-1 bg-black rounded-full"
                style={{ width: `${props.percentage}%` }}
              ></div>
            </div>
          </div>
          {/* indicator */}
          <p className="text-sm font-bold">{props.percentage}</p>
          {/* indicator */}
        </div>
      </div>
      <div
        className={`flex w-20 h-20 items-center justify-center cursor-pointer bg-zinc-100 rounded-md ${
          props.isSelected
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-zinc-100 hover:bg-zinc-100"
        }`}
        onClick={props.onClick}
      >
        <CheckIcon className="w-7 h-7 " />
      </div>
    </div>
  );
}
