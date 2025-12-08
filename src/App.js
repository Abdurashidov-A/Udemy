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
  function handleRemoveItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleClear() {
    const confirmed = window.confirm("Do you really want to Clear");

    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItem} />
      <PackingList
        items={items}
        onRemoveItems={handleRemoveItem}
        onToggleItem={handleToggle}
        onClear={handleClear}
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

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { id: Date.now(), description, quantity, packed: false };
    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      What do you need for your trip? 🏖
      <select
        name=""
        id=""
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
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
};
const PackingList = ({ items, onRemoveItems, onToggleItem, onClear }) => {
  const [sortBy, setSortBy] = useState("input");

  let sortedItem;

  if (sortBy === "input") sortedItem = items;

  if (sortBy === "description")
    sortedItem = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItem = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      {sortedItem.length > 0 ? (
        <ul>
          {sortedItem.map((item) => (
            <Item
              item={item}
              key={item.id}
              onRemoveItems={onRemoveItems}
              onToggleItem={onToggleItem}
            />
          ))}
        </ul>
      ) : (
        "Empty"
      )}
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClear}>Clear list</button>
      </div>
    </div>
  );
};

const Item = ({ item, onRemoveItems, onToggleItem }) => {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {
          onToggleItem(item.id);
        }}
      />
      <span className={item.packed && "done"}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onRemoveItems(item.id)}>❌</button>
    </li>
  );
};
const Stats = ({ items }) => {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list </em>
      </p>
    );
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentPacked = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      {percentPacked === 100 ? (
        <em>You got everything! Ready to go</em>
      ) : (
        <em>
          You have {numItems} items on your list , and you already packed{" "}
          {numPacked} ({percentPacked}%)
        </em>
      )}
    </footer>
  );
};

export default App;
