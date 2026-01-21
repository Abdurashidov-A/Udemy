import { useState } from "react";

export default function App() {
  const [items, setItem] = useState([
    {
      name: "Banana",
      quantity: 5,
      isSelected: true,
    },
    {
      name: "Aplle",
      quantity: 3,
      isSelected: true,
    },
    {
      name: "Mango",
      quantity: 2,
      isSelected: false,
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [totalValue, setTotalValue] = useState(10);

  function handleAddItem() {
    const newItem = {
      name: inputValue,
      isSelected: false,
      quantity: 1,
    };

    setItem([...items, newItem]);
    setInputValue("");
  }
  function handleAdd(index) {
    const newItem = [...items];

    newItem[index].quantity++;

    setItem(newItem);
    calculateTotal();
  }
  function handleMinus(index) {
    const newItem = [...items];

    newItem[index].quantity--;

    setItem(newItem);
    calculateTotal();
  }

  function handleChangeClass(index) {
    const newItem = [...items];

    newItem[index].isSelected = !newItem[index].isSelected;

    setItem(newItem);
  }

  function calculateTotal(item) {
    const total = items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    setTotalValue(total);
  }

  return (
    <div className="background">
      <div className="">
        <input
          className="input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder=" Add Item..."
        />
        <button onClick={handleAddItem}>+</button>
      </div>

      <div className="Items">
        {items.map((item, index) => (
          <div className="Item">
            <div
              className={item.isSelected ? "checkedItem" : "classAddItem"}
              key={item.index}
              onClick={() => handleChangeClass(index)}
            >
              <input type="checkbox" />
              <div>{item.name}</div>
            </div>

            <div className="classAddItem">
              <button onClick={() => handleMinus(index)}>-</button>
              {item.quantity}
              <button onClick={() => handleAdd(index)}>+</button>
            </div>
          </div>
        ))}
        {totalValue}
      </div>
    </div>
  );
}
