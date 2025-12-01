import { useState } from "react";

const App = () => {
  const [plus, setPlus] = useState(0);
  const [increase, setIncrease] = useState(1);
  const date = new Date();
  date.setDate(date.getDate() + plus);

  const handlerPlus = () => setIncrease((prev) => prev + 1);
  const handlerMinus = () => setIncrease((prev) => prev - 1);

  function handlerRise() {
    return setPlus(plus + increase);
  }
  function handlerDown() {
    return setPlus(plus - increase);
  }

  return (
    <div className="container">
      <div className="counter">
        <button onClick={handlerMinus}>-</button>
        <div>Step: {increase}</div>
        <button onClick={handlerPlus}>+</button>
      </div>
      <div className="counter">
        <button onClick={handlerDown}>-</button>
        <div>Count: {plus}</div>
        <button onClick={handlerRise}>+</button>
      </div>
      <div>
        {plus === 0 ? (
          "Today is"
        ) : (
          <span>
            {plus > 0 ? (
              <span>
                {" "}
                {plus} {plus === 1 ? "day" : "days"} from Today is
              </span>
            ) : (
              <span>
                {Math.abs(plus)} {plus === -1 ? "day" : "days"} ago was{" "}
              </span>
            )}
          </span>
        )}{" "}
        {date.toDateString()}{" "}
      </div>
    </div>
  );
};

export default App;
