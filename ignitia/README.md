# Multi-Agent Inventory Dashboard (Frontend)

This is a simple static frontend prototype for the "Optimizing Retail Inventory with Multi Agents" system. It demonstrates:

- Inventory agent view (stock table + restock action)
- Supplier agent simulation
- Forecasting agent chart (Chart.js)
- Alerts for low stock / out of stock

How to run

1. Serve the folder (recommended) and open `index.html` in a browser. Example using Python:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

2. Or just open `index.html` directly in the browser (some browsers limit module loading from file://).

Notes

- The frontend uses React via CDN and Chart.js via CDN and simulates real-time updates.
- Next steps: connect to your real backend via WebSocket/REST to push real stock, orders, and forecasting.
