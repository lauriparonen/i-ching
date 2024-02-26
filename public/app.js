document.getElementById('generateHexagram').addEventListener('click', async () => {
    const response = await fetch('/generate-hexagram');
    const data = await response.json();

    // After fetching hexagram data
    const originalLinesDiv = document.getElementById('originalLines');
    const originalTextDiv = document.getElementById('originalText');
    renderHexagramLines(data.originalHexagram, originalLinesDiv);
    originalTextDiv.innerHTML = `
        <h2>Cast hexagram: 
        ${data.originalHexagramInfo.name.chinese} - 
        ${data.originalHexagramInfo.name.english} -
        ${data.originalHexagramInfo.hexagram}
        </h2>
        <p>${data.originalHexagramInfo.judgement}</p>
        <p>${data.originalHexagramInfo.images}</p>
    `;

    const transformedLinesDiv = document.getElementById('transformedLines');
    const transformedTextDiv = document.getElementById('transformedText');
    renderHexagramLines(data.transformedHexagram, transformedLinesDiv);
    transformedTextDiv.innerHTML = `
        <h2>Transformed hexagram: 
        ${data.transformedHexagramInfo.name.chinese} - 
        ${data.transformedHexagramInfo.name.english} -
        ${data.transformedHexagramInfo.hexagram}
        </h2>
        <p>${data.transformedHexagramInfo.judgement}</p>
        <p>${data.transformedHexagramInfo.images}</p>
    `;


});

function renderHexagramLines(lines, container) {
    container.innerHTML = ''; // Clear previous content
    lines.forEach((line, index) => {
        const svgContainer = document.createElement('div');
        svgContainer.classList.add('line-svg');
        const svgPath = line.includes('yang') ? 'images/yang.svg' : 'images/yin.svg';
        svgContainer.innerHTML = `<object type="image/svg+xml" data="${svgPath}" class="hex-line-svg"></object>`;
        container.appendChild(svgContainer);

        if (line.includes('Changing')) {
            svgContainer.classList.add('changing');
        }

        // Create tooltip - might not use this
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = line; // Ensure text content is set here
        svgContainer.appendChild(tooltip);
        tooltip.style.visibility = 'hidden'; // Initially hide tooltip

        svgContainer.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible'; // Show tooltip on hover
        });
        svgContainer.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden'; // Hide tooltip on mouse leave
        });
    });
}

