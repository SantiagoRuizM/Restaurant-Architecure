
const API_BASE = "__BACKEND_URL__";


function now() {
  return new Date().toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

/** Añade una línea a los logs */
function addLog(msg, level = "info") {
  const container = document.getElementById("logs-container");
  const line = document.createElement("div");
  line.className = `log-line ${level}`;
  line.textContent = `[${now()}] ${msg}`;
  container.prepend(line);
}

// ––––– Backend status ––––– //
async function checkBackendStatus() {
  const statusEl   = document.getElementById("backend-status");
  const dot        = statusEl.querySelector(".status-dot");
  const text       = statusEl.querySelector("span:last-child");

  dot.className = "status-dot checking";
  text.textContent = "Verificando…";

  try {
    const r = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    dot.className = "status-dot ok";
    text.textContent = "En línea";
    addLog("Health check OK ✅");
  } catch (err) {
    dot.className = "status-dot down";
    text.textContent = "Fuera de línea";
    addLog(`Health check FAILED ❌ (${err.message})`, "error");
  }
}


function setStats({ total, disponibles, ocupadas, reservadas }) {
  document.getElementById("total-mesas").textContent   = total;
  document.getElementById("disponibles").textContent   = disponibles;
  document.getElementById("ocupadas").textContent      = ocupadas;
  document.getElementById("reservadas").textContent    = reservadas;
}

function mesaCard(mesa) {
  const card = document.createElement("div");
  card.className = `mesa-card ${mesa.estado}`;          // usa clases .disponible / .ocupada / .reservada
  card.innerHTML = `
      <h4>${mesa.numero}</h4>
      <p>Capacidad: ${mesa.capacidad}</p>
      <p>Ubicación: ${mesa.ubicacion}</p>
      <p class="estado">${mesa.estado.toUpperCase()}</p>`;
  return card;
}

function setStatsFromArray(mesas) {
  const total        = mesas.length;
  const disponibles  = mesas.filter(m => m.estado === "disponible").length;
  const ocupadas     = mesas.filter(m => m.estado === "ocupada").length;
  const reservadas   = mesas.filter(m => m.estado === "reservada").length;

  document.getElementById("total-mesas").textContent  = total;
  document.getElementById("disponibles").textContent  = disponibles;
  document.getElementById("ocupadas").textContent     = ocupadas;
  document.getElementById("reservadas").textContent   = reservadas;
}

async function refreshMesas() {
  const container = document.getElementById("mesas-container");
  container.innerHTML = "";            // limpia el grid

  try {
    const r = await fetch(`${API_BASE}/mesas`, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const data  = await r.json();
    const mesas = data.mesas;

    // ➊ Calcula las estadísticas en el cliente
    setStatsFromArray(mesas);

    // ➋ Renderiza cada mesa
    mesas.forEach(m => container.appendChild(mesaCard(m)));

    addLog("Mesas actualizadas 🔄");
  } catch (err) {
    addLog(`Error al obtener mesas: ${err.message}`, "error");
  }
}

// ––––– Init ––––– //
function init() {
  // Timestamp de footer
  document.getElementById("timestamp").textContent = `Última actualización: ${now()}`;

  // Listeners de botones
  document.getElementById("refresh-btn").addEventListener("click", async () => {
    await refreshMesas();
    document.getElementById("timestamp").textContent = `Última actualización: ${now()}`;
  });

  document.getElementById("health-check-btn").addEventListener("click", checkBackendStatus);

  // Primeras cargas automáticas
  checkBackendStatus();
  refreshMesas();

}
document.addEventListener("DOMContentLoaded", init);
 
