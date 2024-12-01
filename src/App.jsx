import React, { useState, useEffect } from "react";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import "./App.css";

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from ASP.NET API
    fetch("https://localhost:7064/api/FridgeItems")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  const addItem = (item) => {
    // Add item to the local state optimistically
    setItems([...items, item]);
    console.log(JSON.stringify(item));

    // Save to backend API

    fetch("https://localhost:7064/api/FridgeItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Response status:", response.status);
          throw new Error("Failed to save item to the backend");
        }
        return response.json();
      })
      .then((savedItem) => {
        console.log("Item saved to backend:", savedItem);
      })
      .then((data) => console.log("Saved:", data))
      .catch((error) => {
        console.error("Error saving item:", error);
        // Optionally remove the item from local state if saving fails
      });
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    fetch(`https://localhost:7064/api/FridgeItems/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <div className="app">
      <h1>Good Morning, Johny!</h1>
      <p>🌞 It's better to go shopping before this Friday</p>
      <AddItemForm onAddItem={addItem} />
      <ItemList items={items} onDeleteItem={deleteItem} />
    </div>
  );
};

export default App;
