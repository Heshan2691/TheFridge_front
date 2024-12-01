import React, { useState, useEffect } from "react";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { FaSpinner } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [greeting, setGreeting] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Fetch items from ASP.NET API
    fetch("https://localhost:7064/api/FridgeItems")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const determineGreeting = () => {
      const hour = new Date().getHours(); // Get current hour (0-23)
      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    setGreeting(determineGreeting()); // Set the initial greeting

    // Optional: Update the greeting every hour
    const interval = setInterval(() => {
      setGreeting(determineGreeting());
    }, 3600000); // 3600000 ms = 1 hour

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const generateRecommendation = () => {
      const isWeekend = [0, 6].includes(date.getDay()); // Check if it's Saturday or Sunday
      const isFestiveSeason = date.getMonth() === 11; // Example: December is festive
      const itemsExpiring = items.filter(
        (item) =>
          item.expiry &&
          new Date(item.expiry) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      ); // Expiry within 2 days

      if (itemsExpiring.length > 0) {
        return `🚨 "Don't let your fridge treasures turn into trash! Check items nearing their expiry dates."`;
      } else if (items.length === 0) {
        return `🌞 "Your fridge looks empty! It's time to go grocery shopping."`;
      } else if (isWeekend) {
        return `🛒 "It's better to stock up before the weekend rush!"`;
      } else if (isFestiveSeason) {
        return `🎉 "A festive feast is on the horizon! Check your fridge and start planning ahead."`;
      } else if (items.length > 10) {
        return `📦 "Overcrowded fridge? Use what you have before shopping for more."`;
      } else if (items.some((item) => item.name === "vegetables")) {
        return `🍃 "Fresh veggies detected! A healthy salad might be a great idea."`;
      } else if (items.some((item) => item.name === "cheese")) {
        return `🧀 "Got cheese? Add some crackers to your list for a perfect pairing!"`;
      } else if (items.some((item) => item.name === "drinks")) {
        return `💧 "Are you stocked up on drinks? Stay hydrated with fresh juices or water."`;
      } else if (items.some((item) => item.name === "snacks")) {
        return `❤️ "Out of snacks? Check the fridge for family favorites before the next grocery run."`;
      } else {
        return `🍲 "Thinking of meal prepping? Check if your fridge has all the essentials."`;
      }
    };

    setRecommendation(generateRecommendation());
  }, [items, date]);

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
      <h1>{greeting}, Johny!</h1>
      <p>{recommendation}</p>
      <AddItemForm onAddItem={addItem} />
      <ItemList items={items} onDeleteItem={deleteItem} />
    </div>
  );
};

export default App;
