const { useState, useEffect, useRef } = React;

function InventoryTable({ items, onRestock }) {
  return (
    React.createElement('table', { className: 'inventory-table' },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Code'),
          React.createElement('th', null, 'Name'),
          React.createElement('th', null, 'Stock'),
          React.createElement('th', null, 'Reorder Level'),
          React.createElement('th', null, 'Action')
        )
      ),
      React.createElement('tbody', null,
        items.map(item =>
          React.createElement('tr', { key: item.Code },
            React.createElement('td', null, item.Code),
            React.createElement('td', null, item.name),
            React.createElement('td', null, item.stock),
            React.createElement('td', null, item.reorder),
            React.createElement('td', null,
              React.createElement('button', { onClick: () => onRestock(item.Code) }, 'Restock')
            )
          )
        )
      )
    )
  );
}

function AlertsPanel({ alerts }) {
  return (
    React.createElement('div', { className: 'panel alerts' },
      React.createElement('h3', null, 'Alerts'),
      React.createElement('ul', null,
        alerts.map((a, i) => React.createElement('li', { key: i }, a))
      )
    )
  );
}

function ForecastChart({ data }) {
  const canvasRef = useRef();
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{ label: 'Demand', data: data.values, borderColor: '#2b6cb0', tension: 0.3 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return () => chart.destroy();
  }, [data]);
  return React.createElement('div', { className: 'forecast-chart' },
    React.createElement('canvas', { ref: canvasRef })
  );
}

function AgentPanel({ title, children }) {
  return React.createElement('div', { className: 'panel' },
    React.createElement('h3', null, title),
    children
  );
}

function App() {
  const [items, setItems] = useState([
    { Code: 'A100', name: 'rice', stock: 120, reorder: 50 },
    { Code: 'B200', name: 'Beans', stock: 30, reorder: 40 },
    { Code: 'C300', name: 'Lentils', stock: 5, reorder: 20 },
    { Code: 'D400', name: 'Pasta', stock: 200, reorder: 100 },
    { Code: 'E500', name: 'Flour', stock: 80, reorder: 30 },
    { Code: 'F600', name: 'Sugar', stock: 60, reorder: 25 },
  ]);
  const [alerts, setAlerts] = useState([]);
  const [forecast, setForecast] = useState({ labels: ['W1','W2','W3','W4','W5','W6','W7'], values: [80, 95, 100, 120, 140, 150, 160] });

  useEffect(() => {
    const t = setInterval(() => {
      setItems(prev => {
        const next = prev.map(it => {
          const delta = Math.floor(Math.random() * 7) - 2;
          const stock = Math.max(0, it.stock + delta);
          return { ...it, stock };
        });
        // alerts
        const newAlerts = [];
        next.forEach(it => {
          if (it.stock <= it.reorder) newAlerts.push(`${it.name} low (stock=${it.stock})`);
          if (it.stock === 0) newAlerts.push(`${it.name} out of stock`);
        });
        setAlerts(newAlerts);
        // update forecast slightly
        setForecast(f => ({ ...f, values: f.values.map(v => Math.max(0, Math.round(v * (0.98 + Math.random() * 0.04)))) }));
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  function handleRestock(Code) {
    setItems(prev => prev.map(it => it.Code === Code ? { ...it, stock: it.stock + 100 } : it));
    setAlerts(a => [`Restock order placed for ${Code}`, ...a].slice(0, 10));
  }

  return (
    React.createElement('div', { className: 'app' },
      React.createElement('header', null, React.createElement('h1', null, 'Multi-Agent Inventory Dashboard')),
      React.createElement('main', null,
        React.createElement('section', { className: 'left' },
          React.createElement(AgentPanel, { title: 'Inventory Agent' },
            React.createElement(InventoryTable, { items: items, onRestock: handleRestock })
          ),
          React.createElement(AgentPanel, { title: 'Supplier Agent' },
            React.createElement('div', null,
              React.createElement('p', null, 'Simulated supplier coordination and ETA.'),
              React.createElement('button', { onClick: () => setAlerts(a => ['Supplier order confirmed', ...a].slice(0,10)) }, 'Simulate Supplier OK')
            )
          )
        ),
        React.createElement('section', { className: 'right' },
          React.createElement(AgentPanel, { title: 'Forecasting Agent' },
            React.createElement(ForecastChart, { data: forecast })
          ),
          React.createElement(AlertsPanel, { alerts: alerts })
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
