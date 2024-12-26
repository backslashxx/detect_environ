// Execute shell commands with ksu.exec
async function execCommand(command) {
    const callbackName = `exec_callback_${Date.now()}`;
    return new Promise((resolve, reject) => {
        window[callbackName] = (errno, stdout, stderr) => {
            delete window[callbackName];
            errno === 0 ? resolve(stdout) : reject(stderr);
        };
        ksu.exec(command, "{}", callbackName);
    });
}

// Function to toast message
function toast(message) {
    ksu.toast(message);
}

// Function to handle ripple effect
function applyRippleEffect() {
    document.querySelectorAll('.output p').forEach(element => {
        element.addEventListener("click", function(event) {
            const ripple = document.createElement("span");
            ripple.classList.add("ripple");

            const rect = element.getBoundingClientRect();
            const width = rect.width;
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            let duration = 0.3 + (width / 800) * 0.5;
            duration = Math.min(0.8, Math.max(0.2, duration));
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.animationDuration = `${duration}s`;
            ripple.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            element.appendChild(ripple);
            ripple.addEventListener("animationend", () => {
                ripple.remove();
            });
        });
    });
}

// Function to run the script and display its output
async function runPrintenv() {
    const output = document.querySelector('.output');
    try {
        const scriptOutput = await execCommand("printenv | tee /data/adb/modules/detect_environ/webroot.txt");
        output.innerHTML = '';
        const lines = scriptOutput.split('\n');
        lines.forEach(line => {
            const lineElement = document.createElement('p');
            lineElement.classList.add('line');
            lineElement.style.whiteSpace = 'pre-wrap';
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

// Initial load
document.addEventListener('DOMContentLoaded', async () => {
    await runPrintenv();
    applyRippleEffect();
});
