import { useState } from "react";

const App = () => {
  const [plus, setPlus] = useState(0);
  const [increase, setIncrease] = useState(1);
  const date = new Date();
  date.setDate(date.getDate() + plus);

  function handlerRise() {
    return setPlus(plus + increase);
  }
  function handlerDown() {
    return setPlus(plus - increase);
  }
  function handlerReset() {
    setPlus(0);
    setIncrease(1);
  }

  return (
    <div className="container">
      <div className="counter">
        <input
          type="range"
          min="0"
          max="10"
          value={increase}
          onChange={(e) => setIncrease(Number(e.target.value))}
        />
        <span>{increase}</span>
      </div>
      <div className="counter">
        <button onClick={handlerDown}>-</button>
        <input
          type="number"
          value={plus}
          onChange={(e) => setPlus(Number(e.target.value))}
        />
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
      {(plus !== 0 || increase !== 1) && (
        <button onClick={handlerReset}>RESET</button>
      )}
    </div>
  );
};

export default App;
