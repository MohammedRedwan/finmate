let categoryChart = null;
let trendChart = null;

document.addEventListener("DOMContentLoaded", () => {
  initCategoryChart();
  initTrendChart();

  // after everything loads (fonts/images), force charts to recalc sizes
  window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    categoryChart?.update();
    trendChart?.update();
  });
});



  initFinancialHealth();
  initSmartTips();
});


function initCategoryChart() {
  const el = document.getElementById("categoryChart");
  if (!el) return;
  if (categoryChart) categoryChart.destroy();


  categoryChart = new Chart(el, {
    type: "doughnut",
    data: {
      labels: ["Food", "Rent", "Subscriptions", "Investments"],
      datasets: [
        {
          data: [500, 1200, 150, 400],
          backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: { labels: { color: "#eaf0ff" } },
      },
    },
  });
}

function initTrendChart() {
  const el = document.getElementById("trendChart");
  if (!el) return;
if (trendChart) trendChart.destroy();

  trendChart = new Chart(el, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Income",
          data: [4000, 4200, 3900, 4500, 4700, 4800],
          borderColor: "#27d17f",
          backgroundColor: "rgba(39,209,127,0.12)",
          tension: 0.4,
          pointRadius: 3,
        },
        {
          label: "Expenses",
          data: [3200, 3500, 3000, 3600, 3700, 3900],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.12)",
          tension: 0.4,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#eaf0ff" } },
      },
      scales: {
        x: {
          ticks: { color: "#a9b6d6" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
        y: {
          ticks: { color: "#a9b6d6" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
    },
  });
}



function initFinancialHealth() {
  const scoreEl = document.getElementById("healthScore");
  const labelEl = document.getElementById("healthScoreLabel");
  const savingsEl = document.getElementById("savingsRate");
  const expenseEl = document.getElementById("expenseRatio");
  const subsEl = document.getElementById("subsShare");
  const fillEl = document.getElementById("healthFill");

  // If you removed the financial health section, safely exit
  if (!scoreEl || !labelEl || !savingsEl || !expenseEl || !subsEl || !fillEl) return;

  // Sample values (swap later with real data)
  const income = 4800;
  const expenses = 3900;
  const subs = 150;

  const savingsRate = Math.max(0, Math.round(((income - expenses) / income) * 100));
  const expenseRatio = Math.min(100, Math.round((expenses / income) * 100));
  const subsShare = Math.min(100, Math.round((subs / income) * 100));

  // Simple score formula
  let score = 100;
  score -= Math.max(0, expenseRatio - 70) * 1.2;
  score -= subsShare * 0.6;
  score += savingsRate * 0.4;
  score = Math.max(0, Math.min(100, Math.round(score)));

  scoreEl.textContent = score;
  labelEl.textContent = `${score}/100`;
  savingsEl.textContent = `${savingsRate}%`;
  expenseEl.textContent = `${expenseRatio}%`;
  subsEl.textContent = `${subsShare}%`;
  fillEl.style.width = `${score}%`;
}

function initSmartTips() {
  const tipsStatus = document.getElementById("tipsStatus");
  const tipsPercent = document.getElementById("tipsPercent");
  const tipsFill = document.getElementById("tipsFill");
  const tipsList = document.getElementById("tipsList");

  // If you don't have the Smart Tips card on the page, exit safely
  if (!tipsStatus || !tipsPercent || !tipsFill || !tipsList) return;

  // Sample category totals (swap later with real totals)
  const spending = {
    rent: 1200,
    food: 500,
    subscriptions: 150,
    investments: 400,
  };

  const tips = buildTips(spending);

  // Loading animation first

  let p = 0;

  const timer = setInterval(() => {
    p += Math.floor(Math.random() * 7) + 3; // 3–9
    if (p >= 100) p = 100;

    tipsPercent.textContent = `${p}%`;
    tipsFill.style.width = `${p}%`;

    if (p === 100) {
      clearInterval(timer);
   

      renderTips(tipsList, tips);
      revealTips(tipsList);
    }
  }, 70);
}

function buildTips(spending) {
  const totalSpend = Object.values(spending).reduce((a, b) => a + b, 0);
  const pct = (x) => Math.round((x / totalSpend) * 100);

  const tips = [];

  if (pct(spending.rent) >= 40) {
    tips.push({
      icon: "🏠",
      title: "Housing looks high",
      text: `Rent is ${pct(spending.rent)}% of your spending. Target ~30–35% if possible.`,
    });
  }

  if (pct(spending.food) >= 20) {
    tips.push({
      icon: "🍔",
      title: "Food spend is high",
      text: `Food is ${pct(spending.food)}%. Try meal prep twice a week or set a weekly cap.`,
    });
  }

  if (pct(spending.subscriptions) >= 8) {
    tips.push({
      icon: "🔁",
      title: "Trim subscriptions",
      text: `Subscriptions are ${pct(spending.subscriptions)}%. Cancel 1 unused plan to save quickly.`,
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: "✅",
      title: "Spending looks balanced",
      text: "Nice distribution across categories. Keep going — aim to increase savings slowly.",
    });
  }

  return tips.slice(0, 3);
}

function renderTips(container, tips) {
  container.innerHTML = tips
    .map(
      (t) => `
      <div class="tipItem">
        <div class="tipIcon">${t.icon}</div>
        <div>
          <div class="tipTitle">${t.title}</div>
          <div class="muted small">${t.text}</div>
        </div>
      </div>
    `
    )
    .join("");
}

function revealTips(container) {
  const items = container.querySelectorAll(".tipItem");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), 150 + i * 180);
  });
}
