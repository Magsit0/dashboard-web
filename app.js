/**
 * GLOVOX · Dashboard Web · app.js
 * Datos de ventas por evento — versión estática (reemplaza BigQuery/Streamlit).
 * Para conectar a una API real, reemplaza `SALES_DATA` por un fetch().
 */

'use strict';

// ─── Datos (simulados — equivale al DataFrame de dashboard.py) ───────────────
const SALES_DATA = [
  { eventoId: 'A', qVentas: 120 },
  { eventoId: 'B', qVentas: 300 },
  { eventoId: 'C', qVentas: 80  },
  { eventoId: 'D', qVentas: 200 },
  { eventoId: 'E', qVentas: 150 },
];

// ─── Utilidades ──────────────────────────────────────────────────────────────
function sortDesc(data) {
  return [...data].sort((a, b) => b.qVentas - a.qVentas);
}

function fmtNumber(n) {
  return n.toLocaleString('es-CL');
}

// ─── KPIs ────────────────────────────────────────────────────────────────────
function renderKPIs(data) {
  const total  = data.reduce((s, r) => s + r.qVentas, 0);
  const best   = sortDesc(data)[0];
  const avg    = Math.round(total / data.length);
  const count  = data.length;

  document.getElementById('kpi-total-value').textContent = fmtNumber(total);
  document.getElementById('kpi-best-value').textContent  = `${best.eventoId} (${fmtNumber(best.qVentas)})`;
  document.getElementById('kpi-avg-value').textContent   = fmtNumber(avg);
  document.getElementById('kpi-count-value').textContent = count;
}

// ─── Chart.js ────────────────────────────────────────────────────────────────
function renderChart(data) {
  const sorted = sortDesc(data);
  const labels = sorted.map(r => `Evento ${r.eventoId}`);
  const values = sorted.map(r => r.qVentas);

  const gradient = (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, 'rgba(91,141,238,0.9)');
    g.addColorStop(1, 'rgba(124,92,232,0.5)');
    return g;
  };

  const ctx = document.getElementById('salesChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Ventas',
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
            label: (ctx) => `  ${fmtNumber(ctx.parsed.y)} ventas`,
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
  const total  = sorted.reduce((s, r) => s + r.qVentas, 0);
  const tbody  = document.getElementById('salesTableBody');

  tbody.innerHTML = sorted.map((row, i) => {
    const pct = ((row.qVentas / total) * 100).toFixed(1);
    return `
      <tr>
        <td>${i + 1}</td>
        <td><span class="badge">Evento ${row.eventoId}</span></td>
        <td>${fmtNumber(row.qVentas)}</td>
        <td>${pct}%</td>
      </tr>`;
  }).join('');
}

// ─── Footer year ─────────────────────────────────────────────────────────────
function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── Init ────────────────────────────────────────────────────────────────────
(function init() {
  const data = SALES_DATA;
  renderKPIs(data);
  renderChart(data);
  renderTable(data);
  setYear();
})();
