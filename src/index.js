import React from "react";
import ReactDom from "react-dom/client";

import "./index.css";

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

function App() {
  return (
    <div className="container">
      <Menu />
    </div>
  );
}

function Menu() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  const pizzas = pizzaData;
  return (
    <main className="menu">
      <Header />
      <h2>Our menu</h2>
      {pizzas.length > 0 ? (
        <>
          <p>kjfkjs sefjesnfkjefn fjsekjf kesjfsekjfkfe sjbk skfej\kjb</p>
          <Order pizzas={pizzas} />
        </>
      ) : (
        <p>Sorry we have not any pizzas</p>
      )}

      <Footer isOpen={isOpen} closeHour={closeHour} openHour={openHour} />
    </main>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}

function Order({ pizzas }) {
  return (
    <ul className="pizzas">
      {pizzas.map((pizza) => (
        <Pizza pizzaObj={pizza} key={pizza.name} />
      ))}
    </ul>
  );
}

function Pizza({ pizzaObj }) {
  return (
    // <li className={pizzaObj.soldOut ? "pizza sold-out" : "pizza"}> my-version
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt="" />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <p>
          {pizzaObj.soldOut ? (
            <span>SOLD OUT</span>
          ) : (
            <span>{pizzaObj.price}</span>
          )}
        </p>
      </div>
    </li>
  );
}
function Footer({ isOpen, closeHour, openHour }) {
  return (
    <footer className="footer">
      {isOpen && (
        <div className="order">
          <p>
            Come visit us from {openHour}:00 or order online. We're currently
            open until {closeHour}:00.
          </p>
          <button className="btn">Order</button>
        </div>
      )}
    </footer>
  );
}

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
