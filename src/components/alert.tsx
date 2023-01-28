import { useState } from "react";
import Button from "./button";
import { createRoot } from "react-dom/client";

interface Props {
  isOpen?: boolean;
  title?: string;
  message?: string;
  positiveBtnText?: string;
  negativeBtnText?: string;
  onPositiveClick?: () => void;
  onNegativeClick?: () => void;
}

function Alert(props: Props) {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  return (
    <div
      className={`relative z-10 ${!isOpen && "hidden"}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0  bg-zinc-900 bg-opacity-40 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full text-center ">
          <div className="relative transform overlow-hidden transition-all p-4 bg-white shadow-xl">
            <div className="p-5 text-center w-full">
              <p className="text-2xl font-bold">{props.title || "title"}</p>
              <p className="text-lg">{props.message || "Message here"}</p>
              <div className="space-x-3 mt-5">
                <button
                  className="text-sm bg-zinc-100 px-2 py-1 hover:bg-zinc-200"
                  onClick={() => {
                    props.onNegativeClick && props.onNegativeClick();
                    setIsOpen(false);
                  }}
                >
                  {props.negativeBtnText || "Tidak"}
                </button>
                <Button
                  text={props.positiveBtnText || "Ya"}
                  className={`${!props.onPositiveClick && "hidden"}`}
                  onClick={() => {
                    props.onPositiveClick && props.onPositiveClick();
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function showAlert(props: Props) {
  const alert = document.createElement("div");
  alert.id = "alert";
  document.body.appendChild(alert);

  const root = createRoot(alert);
  root.render(
    <Alert
      isOpen={true}
      title={props.title}
      message={props.message}
      positiveBtnText={props.positiveBtnText}
      negativeBtnText={props.negativeBtnText}
      onPositiveClick={props.onPositiveClick}
      onNegativeClick={props.onNegativeClick}
    />
  );
}
