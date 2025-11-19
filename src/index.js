import React from "react";
import ReactDom from "react-dom/client";
import Avatar from "./components/avatar";
import Info from "./components/info";
import SkillList from "./components/skillist";
import "./styles.css";

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
      <div className="card">
        <Avatar />
        <div className="data">
          <Info />
          <SkillList />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="header footer">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}
function Menu() {
  return (
    <main className="menu">
      <h2>Our menu</h2>
      <Pizza
        name="Pizza Spinachi"
        ingredients="Tomato,mozarella,spinach and ricotta cheese"
        photoName="pizzas/spinaci.jpg"
        price={10}
      />
      <Pizza
        name="Focaccia"
        ingredients="Bread with italian olive oil and rosemary"
        photoName="pizzas/focaccia.jpg"
        price={12}
      />
    </main>
  );
}

function Pizza(props) {
  return (
    <div className="pizza">
      <img src={props.photoName} alt="" />

      <div>
        <h3>{props.name}</h3>
        <p>{props.ingredients}</p>
        <p>{props.price + 3}</p>
      </div>
    </div>
  );
}
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  console.log(isOpen);

  return (
    <footer className="footer">
      {new Date().toLocaleDateString()} We're cuurently open!
    </footer>
  );
}

// function Pizza() {
//   return pizzaData.map((item) => {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "10px",
//           gap: "20px",
//         }}
//       >
//         <div
//           style={{
//             width: "100px",
//             height: "auto",
//           }}
//         >
//           <img
//             style={{
//               width: "100%",
//             }}
//             src={item.photoName}
//             alt=""
//           />
//         </div>
//         <div>
//           <h3>{item.name}</h3>
//           <p style={{ textAlign: "center" }}>{item.ingredients}</p>
//         </div>
//       </div>
//     );
//   });
// }
const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
