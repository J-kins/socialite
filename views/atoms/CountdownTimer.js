/**
 * CountdownTimer Component
 * Displays countdown timer with automatic updates
 */

const CountdownTimer = ({
  id = "",
  targetDate = "",
  className = "",
  format = "dhms", // 'd' = days, 'h' = hours, 'm' = minutes, 's' = seconds
  separator = ":",
  labels = {
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
  },
  onComplete = "",
  ...props
} = {}) => {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "space-x-1",
    "font-mono",
    "text-lg",
    "font-semibold",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const timerId = id || `countdown-${Math.random().toString(36).substr(2, 9)}`;

  // Generate the countdown HTML structure
  let countdownHTML = "";
  const formatArray = format.split("");

  formatArray.forEach((unit, index) => {
    const unitName = {
      d: "days",
      h: "hours",
      m: "minutes",
      s: "seconds",
    }[unit];

    if (unitName) {
      countdownHTML += `
                <div class="flex flex-col items-center">
                    <span class="text-2xl" data-unit="${unit}">00</span>
                    <span class="text-xs text-gray-500">${labels[unitName]}</span>
                </div>
            `;

      if (index < formatArray.length - 1) {
        countdownHTML += `<span class="text-xl">${separator}</span>`;
      }
    }
  });

  // JavaScript for countdown functionality
  const script = `
        <script>
        (function() {
            const timer = document.getElementById('${timerId}');
            if (!timer) return;
            
            const targetTime = new Date('${targetDate}').getTime();
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = targetTime - now;
                
                if (distance < 0) {
                    timer.innerHTML = '<span class="text-red-500">Expired</span>';
                    ${onComplete ? `(${onComplete})();` : ""}
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const daysEl = timer.querySelector('[data-unit="d"]');
                const hoursEl = timer.querySelector('[data-unit="h"]');
                const minutesEl = timer.querySelector('[data-unit="m"]');
                const secondsEl = timer.querySelector('[data-unit="s"]');
                
                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            }
            
            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);
            
            // Store interval ID for cleanup
            timer.setAttribute('data-interval', interval);
        })();
        </script>
    `;

  return `
        <div
            ${id ? `id="${timerId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            ${countdownHTML}
        </div>
        ${script}
    `;
};

export default CountdownTimer;
