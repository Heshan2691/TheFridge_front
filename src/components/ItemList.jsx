import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const ItemList = ({ items, onDeleteItem }) => {
  const calculateStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) return "Expired";
    if ((expiry - today) / (1000 * 60 * 60 * 24) <= 30) return "Expiring soon";
    return "Healthy";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  return (
    <div className="item-list">
      <h2>Total items — {items.length}</h2>
      {items.map((item) => (
        <div className="item" key={item.id}>
          <span>{item.name}</span>
          <span>Expiry date — {formatDate(item.expiryDate)}</span>
          <span
            className={`status ${calculateStatus(
              item.expiryDate
            ).toLowerCase()}`}
          >
            {calculateStatus(item.expiryDate)}
          </span>
          <FaTrashAlt
            className="delete-icon"
            onClick={() => onDeleteItem(item.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ItemList;
