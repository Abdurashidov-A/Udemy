import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Cap", quantity: 12, packed: true },
];

const App = () => {
  const [items, setItems] = useState([]);

  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearItems() {
    const confirmed = window.confirm("Do you really want to clear items");

    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItem} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearItems={handleClearItems}
      />
      <Stats items={items} />
    </div>
  );
};

const Logo = () => {
  return <h1>🌴 Far Away 👜</h1>;
};

const Form = ({ onAddItems }) => {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function hanleSubmit(e) {
    e.preventDefault();

    const newItem = { id: Date.now(), description, quantity, packed: false };

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={hanleSubmit}>
      What do you need for your trip? 🏖
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 21 }, (_, i) => i + 1).map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Add items..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>ADD</button>
    </form>
  );
};
const PackingList = ({ items, onDeleteItem, onToggleItem, onClearItems }) => {
  const [sortedBy, setSortedBy] = useState("input");

  let sortedItem;

  if (sortedBy === "input") sortedItem = items;
  if (sortedBy === "description")
    sortedItem = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortedBy === "packed")
    sortedItem = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItem.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClearItems}>Clear list</button>
      </div>
    </div>
  );
};

const Item = ({ item, onDeleteItem, onToggleItem }) => {
  return (
    <>
      <li key={item.id}>
        <input type="checkbox" onChange={() => onToggleItem(item.id)} />
        <span className={item.packed && "done"}>
          {item.quantity} {item.description}
        </span>
        <button onClick={() => onDeleteItem(item.id)}>❌</button>
      </li>
    </>
  );
};
const Stats = ({ items }) => {
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  if (!numItems) return <em className="stats">You should add items</em>;
  if (percentage === 100)
    return <em className="stats">You are ready to travel!</em>;
  return (
    <div className="stats">
      <em>
        You have {numItems} items on yor list and you already packed {numPacked}{" "}
        ({percentage}%)
      </em>
    </div>
  );
};

export default App;
