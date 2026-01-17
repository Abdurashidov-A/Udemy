import { useState } from "react";

export default function App() {
  const [itemArray, setItemArray] = useState([
    {
      quantity: 1,
      name: "Apple",
      isSelected: false,
    },
    {
      quantity: 2,
      name: "Banana",
      isSelected: true,
    },
    {
      quantity: 3,
      name: "Pineapple",
      isSelected: false,
    },
  ]);

  const [count, setCount] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [total, setTotal] = useState(6);

  function handleAddItem() {
    if (!inputValue) return;

    const item = {
      quantity: 1,
      name: inputValue,
      isSelected: false,
    };

    setItemArray([...itemArray, item]);

    setInputValue("");
  }

  function handleAdd(index) {
    const newItems = [...itemArray];

    newItems[index].quantity++;

    setItemArray(newItems);
    calculateTotal();
  }

  function handleMinus(index) {
    const newItems = [...itemArray];
    newItems[index].quantity--;

    setItemArray(newItems);
    calculateTotal();
  }

  function handleToggle(index) {
    const newItems = [...itemArray];
    newItems[index].isSelected = !newItems[index].isSelected;

    setItemArray(newItems);
  }

  function calculateTotal() {
    const total = itemArray.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    setTotal(total);
  }

  return (
    <div>
      <div className="background">
        <div className="classAddItem">
          <input
            className="input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder=" Add Item..."
          />
          <Button handleChange={handleAddItem}>+</Button>
        </div>
        <Form
          total={total}
          handleToggle={handleToggle}
          itemArray={itemArray}
          count={count}
          setCount={setCount}
          handleAdd={handleAdd}
          handleMinus={handleMinus}
        />
      </div>
    </div>
  );
}
function Form({ itemArray, handleAdd, handleMinus, handleToggle, total }) {
  return (
    <div>
      {itemArray.map((item, index) => (
        <div className="form" key={index}>
          <div onClick={() => handleToggle(index)}>
            <div className={item.isSelected ? "checkedItem" : "form-text"}>
              <input type="checkbox" />
              <p>{item.name}</p>
            </div>
          </div>

          <div className="count">
            <Button handleChange={() => handleMinus(index)}>-</Button>
            <span>{item.quantity ? item.quantity : 0}</span>
            <Button handleChange={() => handleAdd(index)}>+</Button>
          </div>
        </div>
      ))}
      <div>{total}</div>
    </div>
  );
}

function Button({ children, handleChange }) {
  return (
    <button className="button" onClick={handleChange}>
      {children}
    </button>
  );
}
