export const Stats = ({ items }) => {
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
