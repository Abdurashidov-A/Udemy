import { useState } from "react";

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑",
];

const App = () => {
  return (
    <div>
      <Step />

      <div className="message">
        <StepMessage step={1}>
          <p>Hello my man</p>
          <p>wow</p>
        </StepMessage>
      </div>
      <div className="message">
        <StepMessage step={2}>
          <p>Hello my bro</p>
          <p>wow</p>
        </StepMessage>
      </div>
    </div>
  );
};

function Step() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  function handlePrevious() {
    if (step > 1) setStep((prev) => prev - 1);
  }
  function handleNext() {
    if (step < 3) setStep((prev) => prev + 1);
  }

  function hanleSwitch() {
    setIsOpen((onoff) => {
      setIsOpen(!onoff);
    });
  }
  return (
    <>
      <button className="close" onClick={() => setIsOpen((is) => !is)}>
        &times;
      </button>
      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 && "active"}>1</div>
            <div className={step >= 2 && "active"}>2</div>
            <div className={step >= 3 && "active"}>3</div>
          </div>
          <p className="message">
            <StepMessage step={step}>{messages[step - 1]}</StepMessage>
            <div className="buttons">
              {" "}
              <Button
                textColor={"#000"}
                bgColor={"#e3e3e3"}
                handleFunction={handlePrevious}
              >
                <span>Just Click</span>
              </Button>
            </div>
          </p>
          <div className="buttons">
            <Button
              textColor={"#fff"}
              bgColor={"#7950f2"}
              handleFunction={handlePrevious}
            >
              👈<span>Previous</span>
            </Button>
            <Button
              textColor={"#fff"}
              bgColor={"#7950f2"}
              handleFunction={handleNext}
            >
              <span>Next</span>👉
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Button({ textColor, bgColor, handleFunction, children }) {
  return (
    <button
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={handleFunction}
    >
      {children}
    </button>
  );
}

function StepMessage({ step, children }) {
  return (
    <span>
      Step {step}: {children}
    </span>
  );
}

export default App;
