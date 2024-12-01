import React, { useState } from "react";
import axios from "axios";

const AddItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent duplicate submissions

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newItem = {
        name: itemName,
        expiryDate: expiryDate,
        status: "Healthy",
      };

      // Post newItem to the backend
      const response = await axios.post(
        "https://localhost:7064/api/FridgeItems",
        newItem // Send the complete object
      );

      console.log("Item posted:", response.data);

      // Update UI only after the API confirms success
      onAddItem(response.data);

      // Clear input fields after successful submission
      setItemName("");
      setExpiryDate("");
    } catch (error) {
      console.error("Error posting item:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add to Fridge"}
      </button>
    </form>
  );
};

export default AddItemForm;
