import { useState } from "react";

const tabs = ["Тип 1", "Тип 2"];

const items = [
  { id: 1, name: "Item 1", value: 20 },
  { id: 2, name: "Item 2", value: 30 },
  { id: 3, name: "Item 3", value: 40 },
  { id: 4, name: "Item 4", value: 50 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedIds, setSelectedIds] = useState([3]);

  function handleToggle(id) {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((itemId) => itemId !== id) : [...ids, id],
    );
  }

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const totalValue = selectedItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <main className="app">
      <section className="panel">
        <Header
          activeTab={activeTab}
          selectedCount={selectedItems.length}
          totalValue={totalValue}
        />

        <div className="content">
          <SideBar
            tabs={tabs}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
          {activeTab === "Тип 1" && (
            <section className="items intro">
              <div className="intro-card">
                <p className="intro-badge">Mini Dashboard</p>
                <h2 className="intro-title">Панель выбора пунктов</h2>
                <p className="intro-text">
                  Откройте раздел &quot;Тип 2&quot;, чтобы отметить элементы и
                  сразу увидеть итоговые показатели в шапке.
                </p>
                <button
                  className="cta-button"
                  onClick={() => setActiveTab(tabs[1])}
                  type="button"
                >
                  Перейти в Тип 2
                </button>
              </div>
            </section>
          )}

          {activeTab === "Тип 2" && (
            <section className="items">
              <div className="items-list">
                {items.map((item, index) => (
                  <label
                    className={`item-row ${
                      selectedIds.includes(item.id) ? "item-selected" : ""
                    }`}
                    key={item.id}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="item-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggle(item.id)}
                      />
                      <span className="item-title">{item.name}</span>
                    </span>
                    <span className="item-value">Value: {item.value}</span>
                  </label>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

function Header({ activeTab, selectedCount, totalValue }) {
  return (
    <header className="header">
      <div>
        <p className="header-label">Раздел</p>
        <h1 className="header-title">{activeTab}</h1>
      </div>
      <div className="header-stats">
        {activeTab !== "Тип 1" && (
          <>
            <span className="stat-pill">Выбрано: {selectedCount}</span>
            <span className="stat-pill">Сумма: {totalValue}</span>
          </>
        )}
        {activeTab === "Тип 1" && (
          <span className="header-hint">Откройте &quot;Тип 2&quot; для работы</span>
        )}
      </div>
    </header>
  );
}

function SideBar({ tabs, activeTab, onSelectTab }) {
  return (
    <aside className="sidebar">
      <p className="sidebar-title">Разделы</p>
      {tabs.map((tab) => (
        <button
          className={`tab ${activeTab === tab ? "tab-active" : ""}`}
          key={tab}
          onClick={() => onSelectTab(tab)}
          type="button"
        >
          <span className="tab-dot" />
          <span>{tab}</span>
        </button>
      ))}
    </aside>
  );
}
