import Countdown, { CountdownRendererFn } from "react-countdown";
import CountdownRenderer from "./countdown_renderer";

interface Props {
  className?: string;
  start: string;
  end: string;
  curentState: string;
}

export default function CountDown(props: Props) {
  const countDown: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    return (
      <CountdownRenderer
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  };
  return (
    <div className={`text-center ${props.className}`}>
      {props.curentState === "STATE_LOADING" && <>Tunggu sebentar</>}
      {props.curentState === "STATE_NOT_STARTED" && (
        <div>
          <p>voting akan dimulai pada :</p>
          <Countdown date={props.start} renderer={countDown} />
        </div>
      )}

      {props.curentState === "STATE_STARTED" && (
        <div>
          <p>Waktu voting berakhir pada :</p>
          <Countdown date={props.end} renderer={countDown} />
        </div>
      )}

      {props.curentState === "STATE_ENDED" && <>Voting telah berakhir</>}
    </div>
  );
}
