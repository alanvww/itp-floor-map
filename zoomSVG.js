// Add this to your existing script.js file

let currentZoom = 1;
const zoomStep = 0.1;
const maxZoom = 5;
const minZoom = 0.5;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
let lastTap = 0;

function setupZoomPanControls() {
    const svgContainer = document.getElementById('svg-container');
    const svg = svgContainer.querySelector('svg');
    
    // Create zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.id = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-button" id="zoom-in">+</button>
        <button class="zoom-button" id="zoom-out">-</button>
        <button class="zoom-button" id="zoom-reset">Reset</button>
    `;
    svgContainer.appendChild(zoomControls);

    // Add event listeners
    document.getElementById('zoom-in').addEventListener('click', zoomIn);
    document.getElementById('zoom-out').addEventListener('click', zoomOut);
    document.getElementById('zoom-reset').addEventListener('click', resetZoom);

    // Mouse events
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('wheel', handleWheel);

    // Touch events
    svg.addEventListener('touchstart', handleTouchStart, { passive: false });
    svg.addEventListener('touchmove', handleTouchMove, { passive: false });
    svg.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Prevent default behaviors
    svg.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Only prevent default touch behavior on the SVG, not on the buttons
    svg.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    svg.addEventListener('touchmove', preventDefaultTouch, { passive: false });

    function preventDefaultTouch(e) {
        // Prevent default only if the touch is on the SVG, not on buttons
        if (e.target.tagName.toLowerCase() !== 'button') {
            e.preventDefault();
        }
    }

    function handleTouchStart(e) {
        // Don't handle touch events on buttons
        if (e.target.tagName.toLowerCase() === 'button') return;

        if (e.touches.length === 1) {
            const now = new Date().getTime();
            const timeSince = now - lastTap;
            if (timeSince < 300 && timeSince > 0) {
                // Double tap
                zoomIn();
                e.preventDefault();
            } else {
                startDrag(e.touches[0]);
            }
            lastTap = now;
        } else if (e.touches.length === 2) {
            // Two-finger tap (handled in touchend)
            e.preventDefault();
        }
    }

    function handleTouchMove(e) {
        // Don't handle touch events on buttons
        if (e.target.tagName.toLowerCase() === 'button') return;

        if (e.touches.length === 1) {
            drag(e.touches[0]);
        }
    }

    function handleTouchEnd(e) {
        // Don't handle touch events on buttons
        if (e.target.tagName.toLowerCase() === 'button') return;

        if (e.touches.length === 0) {
            endDrag();
        } else if (e.touches.length === 1 && e.changedTouches.length === 1) {
            // Two-finger tap ended (one finger lifted)
            zoomOut();
        }
    }

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        
        // Disable text selection
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        const dx = (x - startX) / currentZoom;
        const dy = (y - startY) / currentZoom;
        translateX += dx;
        translateY += dy;
        startX = x;
        startY = y;
        updateSvgTransform();
    }

    function endDrag() {
        isDragging = false;
        
        // Re-enable text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.mozUserSelect = '';
        document.body.style.msUserSelect = '';
    }

    function handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
        const newZoom = currentZoom + delta;
        if (newZoom >= minZoom && newZoom <= maxZoom) {
            const rect = svgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            zoomAtPoint(newZoom, x, y);
        }
    }

    function zoomAtPoint(newZoom, x, y) {
        const scale = newZoom / currentZoom;
        translateX = x - (x - translateX) * scale;
        translateY = y - (y - translateY) * scale;
        currentZoom = newZoom;
        updateSvgTransform();
    }

    function zoomIn() {
        setZoom(currentZoom + zoomStep);
    }

    function zoomOut() {
        setZoom(currentZoom - zoomStep);
    }

    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateSvgTransform();
    }

    function setZoom(zoom) {
        currentZoom = Math.min(Math.max(zoom, minZoom), maxZoom);
        updateSvgTransform();
    }

    function updateSvgTransform() {
        svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
        svg.style.transformOrigin = '0 0';
    }
}

// Call this function after your SVG is loaded
document.addEventListener('DOMContentLoaded', setupZoomPanControls);