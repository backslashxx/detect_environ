/**
 * Execute shell commands with ksu.exec
 * @param {string} command -  shell command to execute
 * @returns {Promise<string>} - A promise that resolves with stdout content
 * @throws {Error} If command execution fails with:
 *   - stderr in error message
 */
async function exec(command) {
    const callbackName = `exec_callback_${Date.now()}`;
    return new Promise((resolve, reject) => {
        window[callbackName] = (errno, stdout, stderr) => {
            delete window[callbackName];
            errno === 0 ? resolve(stdout) : reject(stderr);
        };
        try {
            ksu.exec(command, "{}", callbackName);
        } catch (error) {
            console.error("Unable to execute command:", error)
        }
    });
}

// Function to toast message
function toast(message) {
    try {
        ksu.toast(message);
    } catch (error) {
        console.error("Unable to toast message:", error)
    }
}

/**
 * Simulate MD3 ripple animation
 * Usage: class="ripple-element" style="position: relative; overflow: hidden;"
 * Note: Require background-color to work properly
 * @return {void}
 */
export function applyRippleEffect() {
    document.querySelectorAll('.ripple-element').forEach(element => {
        if (element.dataset.rippleListener !== "true") {
            element.addEventListener("pointerdown", async (event) => {
                // Pointer up event
                const handlePointerUp = () => {
                    ripple.classList.add("end");
                    setTimeout(() => {
                        ripple.classList.remove("end");
                        ripple.remove();
                    }, duration * 1000);
                    element.removeEventListener("pointerup", handlePointerUp);
                    element.removeEventListener("pointercancel", handlePointerUp);
                };
                element.addEventListener("pointerup", () => setTimeout(handlePointerUp, 80));
                element.addEventListener("pointercancel", () => setTimeout(handlePointerUp, 80));

                // Return if scroll or footer click detected in 80ms
                await new Promise(resolve => setTimeout(resolve, 80));
                if (isScrolling) return;
                const ripple = document.createElement("span");
                ripple.classList.add("ripple");

                // Calculate ripple size and position
                const rect = element.getBoundingClientRect();
                const width = rect.width;
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;

                // Determine animation duration
                let duration = 0.2 + (width / 800) * 0.4;
                duration = Math.min(0.8, Math.max(0.2, duration));

                // Set ripple styles
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.animationDuration = `${duration}s`;
                ripple.style.transition = `opacity ${duration}s ease`;

                // Adaptive color
                const computedStyle = window.getComputedStyle(element);
                const bgColor = computedStyle.backgroundColor || "rgba(0, 0, 0, 0)";
                const isDarkColor = (color) => {
                    const rgb = color.match(/\d+/g);
                    if (!rgb) return false;
                    const [r, g, b] = rgb.map(Number);
                    return (r * 0.299 + g * 0.587 + b * 0.114) < 96; // Luma formula
                };
                ripple.style.backgroundColor = isDarkColor(bgColor) ? "rgba(255, 255, 255, 0.2)" : "";

                // Append ripple
                element.appendChild(ripple);
            });
            element.dataset.rippleListener = "true";
        }
    });
}

// Function to run the script and display its output
async function runPrintenv() {
    const output = document.querySelector('.output');
    try {
        const scriptOutput = await exec("printenv | tee /data/adb/modules/detect_environ/webroot.txt");
        output.innerHTML = '';
        const lines = scriptOutput.split('\n');
        lines.forEach(line => {
            const lineElement = document.createElement('p');
            lineElement.className = 'ripple-element';
            lineElement.textContent = line;
            if (line === '') {
                lineElement.innerHTML = '&nbsp;';
            }
            lineElement.addEventListener("click", function () {
                navigator.clipboard.writeText(lineElement.innerText).then(() => {
                    toast("Text copied to clipboard: " + lineElement.innerText);
                }).catch(err => {
                    console.error("Failed to copy text: ", err);
                });
            });
            output.appendChild(lineElement);
        });
    } catch (error) {
        output.innerHTML = '[!] Error: Fail to execute action.sh';
        console.error('Script execution failed:', error);
    }
}

// Scroll event
let isScrolling = false, scrollTimeout;
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    lastScrollY = window.scrollY;
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 100);
});

// Initial load
document.addEventListener('DOMContentLoaded', async () => {
    await runPrintenv();
    applyRippleEffect();
});
