export const Item = ({ item, onDeleteItem, onToggleItem }) => {
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
