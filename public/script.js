const socket = io();
const statusEl = document.getElementById('status');
const latencyEl = document.getElementById('latency');
const ctx = document.getElementById('latencyChart').getContext('2d');

const labels = [];
const dataPoints = [];

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Latency (ms)',
      data: dataPoints,
      borderColor: 'green',
      borderWidth: 2,
      fill: false,
    }]
  },
  options: {
    animation: false,
    scales: {
      x: { display: false },
      y: { beginAtZero: true, suggestedMax: 200 }
    }
  }
});

socket.on('pingResult', data => {
  const time = new Date(data.time).toLocaleTimeString();
  labels.push(time);
  dataPoints.push(data.latency || 0);

  if (labels.length > 20) {
    labels.shift();
    dataPoints.shift();
  }

  chart.update();

  statusEl.textContent = data.status === 'online' ? '🟢 Online' : '🔴 Offline';
  latencyEl.textContent = data.latency !== null ? `${data.latency} ms` : 'N/A';
});
