import { useState } from "react";

const App = () => {
  const [cost, setCost] = useState("");
  const [tip, setTip] = useState(0);
  const [tipSecond, setTipSecond] = useState(0);
  const handleReset = () => {
    setCost("");
    setTip(0);
    setTipSecond(0);
  };

  return (
    <div className="app">
      <BillInput cost={cost} setCost={setCost} />
      <ServicePercentage percentage={tip} settingTip={setTip}>
        How did you like the service?
      </ServicePercentage>
      <ServicePercentage percentage={tipSecond} settingTip={setTipSecond}>
        How did your friend like the service?
      </ServicePercentage>
      <br />
      {cost ? (
        <div>
          <Text cost={cost} tip={tip} tipSecond={tipSecond} />
          <Reset onReset={handleReset} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

function BillInput({ cost, setCost }) {
  return (
    <div>
      How much was the bill?
      <input
        type="text"
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
      />
    </div>
  );
}

function ServicePercentage({ children, settingTip, percentage }) {
  return (
    <div>
      {children}
      <select
        value={percentage}
        onChange={(e) => settingTip(Number(e.target.value))}
      >
        <option value="">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely amazing! (20%)</option>
      </select>
    </div>
  );
}

function Text({ cost, tip, tipSecond }) {
  const totalCost = cost + ((tip + tipSecond) * cost) / 2 / 100;
  return (
    <>
      <h3>
        You pay ${totalCost} (${cost} + ${((tip + tipSecond) * cost) / 2 / 100}
        tip)
      </h3>
      <br />
    </>
  );
}

function Reset({ onReset }) {
  return (
    <div>
      <button className="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default App;
