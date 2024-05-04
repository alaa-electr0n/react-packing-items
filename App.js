import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Charger", quantity: 1, packed: true },
// ];

function App() {
  //lifting up the state
  const [itemsArr, setItemsArr] = useState([]);

  //adding items to the Array
  const handleAddItems = function (item) {
    setItemsArr((items) => [...items, item]);
  };

  //deleting item from the list
  const handleDeleteItem = function (id) {
    setItemsArr((items) => items.filter((item) => item.id !== id));
  };

  //handeling toggeling the checkbox
  const handleToggleItem = function (id) {
    setItemsArr((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  //clearing the list
  const handleClearList = function () {
    const confirmed = window.confirm(
      "Are you sure you want to clear all the items?"
    );
    if (confirmed) setItemsArr([]);
  };
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={itemsArr}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Status items={itemsArr} />
    </div>
  );
}

/*
  HOW TO USE STATE ??
  1- define state variable 
  2- use the state variable 
  3- event handler where to set the updated state


*/

function Logo() {
  return <h1>🌴 Far Away 🎒</h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  // handle form on submit event
  const formHandler = function (e) {
    e.preventDefault();

    //making the new item object similar to the object in the array
    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };

    console.log(newItem);
    //add the items
    onAddItems(newItem);

    //clear the form input by setting the input to thier initial values
    setDescription("");
    setQuantity(1);
  };
  return (
    <form className="add-form" onSubmit={formHandler}>
      What do you need in your 😍 trip?
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((index) => (
          <option key={index}>{index}</option>
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
}

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = items.slice();
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {items.length > 0 &&
          sortedItems.map((item) => (
            <Item
              item={item}
              key={item.id}
              onDeleteItem={onDeleteItem}
              onToggleItem={onToggleItem}
            />
          ))}
      </ul>

      <div>
        <select
          className="actions"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="input">Sorted by input order</option>
          <option value="description">Sorted by Description</option>
          <option value="packed">Sorted by Packing stats</option>
        </select>
        <button onClick={() => onClearList()}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        onChange={() => onToggleItem(item.id)}
        value={item.packed}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Status({ items }) {
  if (items.length === 0) {
    return (
      <footer className="stats">
        {" "}
        <em>Start packing things for your trip🎒</em>
      </footer>
    );
  }

  const itemsNumber = items.length;
  const itemsPackedNumber = items.filter((item) => item.packed).length;
  const packedPercent = Math.round((itemsPackedNumber / itemsNumber) * 100);

  return (
    <footer className="stats">
      {packedPercent === 100 ? (
        <em> You are Ready to flight ✈</em>
      ) : (
        <em>
          You have {itemsNumber} items on your list , and you have already
          packed {itemsPackedNumber} items ({packedPercent}%).
        </em>
      )}
    </footer>
  );
}

export default App;
