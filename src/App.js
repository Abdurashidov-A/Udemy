import { useState } from "react";

const faqs = [
  {
    id: 1,
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    id: 2,
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    id: 3,
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

const App = () => {
  return (
    <div>
      <Accardion data={faqs} />
    </div>
  );
};

const Accardion = ({ data }) => {
  const [click, setClick] = useState(null);
  console.log("click", click);

  return (
    <div className="accordion">
      {data.map((item, idx) => (
        <AccordionItem
          title={item.title}
          num={idx}
          click={click}
          setClick={setClick}
        >
          {item.text}
        </AccordionItem>
      ))}
      <AccordionItem title="Ashnaqa" num="3" click={click} setClick={setClick}>
        <p>Hello my man, how are you</p>
        <p>Hello my man, how are you</p>
        <p>Hello my man, how are you</p>
        <p>Hello my man, how are you</p>
      </AccordionItem>
    </div>
  );
};

function AccordionItem({ id, num, click, setClick, children, title }) {
  let isOpen = num === click;
  function handleToggle() {
    setClick(isOpen ? null : num);
  }
  return (
    <div key={id} className={`item ${isOpen && "open"}`} onClick={handleToggle}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{isOpen ? "-" : "+"}</p>
      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}

export default App;
