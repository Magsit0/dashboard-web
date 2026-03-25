/**
 * GLOVOX Advanced Analytics Dashboard
 * Core Logic for Data Processing and Visualizations
 */

// State Management
let rawData = [];
let filteredData = [];
let charts = {
    area: null,
    status: null,
    trend: null
};

// Selectors
const jsonInput = document.getElementById('jsonInput');
const updateBtn = document.getElementById('updateBtn');
const errorMsg = document.getElementById('errorMsg');
const areaFilter = document.getElementById('areaFilter');
const statusFilter = document.getElementById('statusFilter');
const seasonFilter = document.getElementById('seasonFilter');

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Attempt to load from data.json file first
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                console.log('Loaded from data.json file');
                initDashboard(data);
            }
        }
    } catch (e) {
        console.warn('data.json not found or empty, waiting for manual input.');
    }

    // Event Listeners
    updateBtn.addEventListener('click', processManualInput);
    [areaFilter, statusFilter, seasonFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
});

function processManualInput() {
    try {
        const input = jsonInput.value.trim();
        if (!input) throw new Error('Por favor ingresa datos JSON.');
        
        const data = JSON.parse(input);
        if (!Array.isArray(data)) throw new Error('El formato debe ser un arreglo de objetos.');
        
        errorMsg.textContent = '';
        initDashboard(data);
    } catch (err) {
        errorMsg.textContent = `Error: ${err.message}`;
    }
}

function initDashboard(data) {
    rawData = data;
    
    // Populate Filters
    populateFilter(areaFilter, 'area_negocio');
    populateFilter(statusFilter, 'estado');
    populateFilter(seasonFilter, 'Temporada');
    
    applyFilters();
}

function populateFilter(selectElement, key) {
    const values = [...new Set(rawData.map(item => item[key]))].filter(Boolean).sort();
    selectElement.innerHTML = '<option value="all">Todas / Todos</option>';
    values.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        selectElement.appendChild(opt);
    });
}

function applyFilters() {
    const areaVal = areaFilter.value;
    const statusVal = statusFilter.value;
    const seasonVal = seasonFilter.value;

    filteredData = rawData.filter(item => {
        return (areaVal === 'all' || item.area_negocio === areaVal) &&
               (statusVal === 'all' || item.estado === statusVal) &&
               (seasonVal === 'all' || item.Temporada === seasonVal);
    });

    updateDashboard();
}

function updateDashboard() {
    renderKPIs();
    renderAreaChart();
    renderStatusChart();
    renderTrendChart();
    renderTable();
}

function renderKPIs() {
    const totalRevenue = filteredData.reduce((sum, item) => sum + (parseFloat(item.ingreso_total_neto) || 0), 0);
    const totalCost = filteredData.reduce((sum, item) => sum + (parseFloat(item.costoAPI) || 0), 0);
    const count = filteredData.length;
    const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1) : 0;
    const avg = count > 0 ? (totalRevenue / count).toFixed(0) : 0;

    document.getElementById('kpi-total-value').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpi-margin-value').textContent = `${margin}%`;
    document.getElementById('kpi-avg-value').textContent = formatCurrency(avg);
    document.getElementById('kpi-count-value').textContent = count;
}

function renderAreaChart() {
    const areaData = {};
    filteredData.forEach(item => {
        const area = item.area_negocio || 'Otros';
        areaData[area] = (areaData[area] || 0) + (parseFloat(item.ingreso_total_neto) || 0);
    });

    const labels = Object.keys(areaData).sort((a, b) => areaData[b] - areaData[a]);
    const values = labels.map(l => areaData[l]);

    if (charts.area) charts.area.destroy();
    
    const ctx = document.getElementById('areaChart').getContext('2d');
    charts.area = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ingresos por Área',
                data: values,
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function renderStatusChart() {
    const statusData = {};
    filteredData.forEach(item => {
        const status = item.estado || 'Indefinido';
        statusData[status] = (statusData[status] || 0) + 1;
    });

    const labels = Object.keys(statusData);
    const values = Object.values(statusData);

    if (charts.status) charts.status.destroy();
    
    const ctx = document.getElementById('statusChart').getContext('2d');
    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 10 } } }
            },
            cutout: '70%'
        }
    });
}

function renderTrendChart() {
    const trendData = {};
    filteredData.forEach(item => {
        if (!item.fechaAsignacion) return;
        const date = new Date(item.fechaAsignacion);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        trendData[month] = (trendData[month] || 0) + (parseFloat(item.ingreso_total_neto) || 0);
    });

    const sortedMonths = Object.keys(trendData).sort();
    const values = sortedMonths.map(m => trendData[m]);

    if (charts.trend) charts.trend.destroy();
    
    const ctx = document.getElementById('trendChart').getContext('2d');
    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedMonths,
            datasets: [{
                label: 'Ingreso Neto',
                data: values,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function renderTable() {
    const tableBody = document.getElementById('salesTableBody');
    tableBody.innerHTML = '';

    filteredData.slice(0, 50).forEach(item => { // Limit to 50 for performance
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: var(--text-muted); font-size: 0.8rem;">${item.external_id || '—'}</td>
            <td style="font-weight: 500;">${item.nombre_negocio || 'Sin Nombre'}</td>
            <td><span class="badge" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${item.area_negocio || '—'}</span></td>
            <td>${formatCurrency(parseFloat(item.ingreso_total_neto) || 0)}</td>
            <td><span class="status-dot ${item.estado === 'CERRADO' ? 'status-online' : 'status-busy'}"></span> ${item.estado || '—'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
}
