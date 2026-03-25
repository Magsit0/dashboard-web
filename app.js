/**
 * GLOVOX · Dashboard Web · app.js
 * Gestión dinámica de datos por JSON.
 */

'use strict';

// ─── Estado Global ───────────────────────────────────────────────────────────
let salesChartInstance = null;
let currentData = [
  { name: 'Evento A', price: 120, category: 'General' },
  { name: 'Evento B', price: 300, category: 'VIP' },
  { name: 'Evento C', price: 80,  category: 'General' },
  { name: 'Evento D', price: 200, category: 'Estudiante' },
  { name: 'Evento E', price: 150, category: 'VIP' },
];

// ─── Utilidades ──────────────────────────────────────────────────────────────
function sortDesc(data) {
  return [...data].sort((a, b) => b.price - a.price);
}

function fmtNumber(n) {
  return n.toLocaleString('es-CL');
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  if (el) el.textContent = msg;
}

function clearError() {
  const el = document.getElementById('errorMsg');
  if (el) el.textContent = '';
}

// ─── KPIs ────────────────────────────────────────────────────────────────────
function renderKPIs(data) {
  const total  = data.reduce((s, r) => s + r.price, 0);
  const sorted = sortDesc(data);
  const best   = sorted[0] || { name: '—', price: 0 };
  const avg    = data.length ? Math.round(total / data.length) : 0;
  const count  = data.length;

  document.getElementById('kpi-total-value').textContent = fmtNumber(total);
  document.getElementById('kpi-best-value').textContent  = `${best.name} (${fmtNumber(best.price)})`;
  document.getElementById('kpi-avg-value').textContent   = fmtNumber(avg);
  document.getElementById('kpi-count-value').textContent = count;
}

// ─── Chart.js ────────────────────────────────────────────────────────────────
function renderChart(data) {
  const sorted = sortDesc(data);
  const labels = sorted.map(r => r.name);
  const values = sorted.map(r => r.price);

  const ctx = document.getElementById('salesChart').getContext('2d');

  // Destruir gráfico previo si existe
  if (salesChartInstance) {
    salesChartInstance.destroy();
  }

  const gradient = (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, 'rgba(91,141,238,0.9)');
    g.addColorStop(1, 'rgba(124,92,232,0.5)');
    return g;
  };

  salesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Ventas ($)',
        data: values,
        backgroundColor: (c) => gradient(c.chart.ctx),
        borderColor: 'rgba(91,141,238,0.8)',
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1d27',
          borderColor: '#2a2f45',
          borderWidth: 1,
          titleColor: '#8891a8',
          bodyColor: '#e8eaf0',
          callbacks: {
            label: (ctx) => `  $${fmtNumber(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8891a8', font: { family: 'Inter' } },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#8891a8', font: { family: 'Inter' } },
          beginAtZero: true,
        },
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
      },
    },
  });
}

// ─── Tabla ───────────────────────────────────────────────────────────────────
function renderTable(data) {
  const sorted = sortDesc(data);
  const total  = sorted.reduce((s, r) => s + r.price, 0);
  const tbody  = document.getElementById('salesTableBody');

  tbody.innerHTML = sorted.map((row, i) => {
    const pct = total > 0 ? ((row.price / total) * 100).toFixed(1) : 0;
    return `
      <tr>
        <td>${i + 1}</td>
        <td><span class="badge">${row.name}</span></td>
        <td>$${fmtNumber(row.price)}</td>
        <td><span class="category-tag">${row.category}</span> (${pct}%)</td>
      </tr>`;
  }).join('');
}

// ─── Lógica de Procesamiento ─────────────────────────────────────────────────
function processInput() {
  const input = document.getElementById('jsonInput').value.trim();
  if (!input) return;

  try {
    const data = JSON.parse(input);
    
    // Validación básica
    if (!Array.isArray(data)) throw new Error('El JSON debe ser un array de objetos.');
    
    data.forEach((item, index) => {
      if (!item.name || item.price === undefined || !item.category) {
        throw new Error(`Falta información en el elemento #${index + 1} (requiere name, price, category).`);
      }
    });

    currentData = data;
    renderAll();
    clearError();
  } catch (err) {
    showError(`Error: ${err.message}`);
  }
}

function renderAll() {
  renderKPIs(currentData);
  renderChart(currentData);
  renderTable(currentData);
}

function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── Init ────────────────────────────────────────────────────────────────────
(function init() {
  setYear();
  renderAll();

  const updateBtn = document.getElementById('updateBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', processInput);
  }
})();
