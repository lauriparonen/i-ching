document.getElementById('generateHexagram').addEventListener('click', async () => {
    const originalHexagram = document.getElementById('originalHexagram');
    const transformedHexagram = document.getElementById('transformedHexagram');
    
    originalHexagram.style.opacity = 0;
    transformedHexagram.style.opacity = 0;

    // Fetch hexagram data from the server
    const response = await fetch('/generate-hexagram');
    const data = await response.json();

    // Before rendering, reserve space for the lines to prevent layout shift
    // The size of the hexagram is 100x132px
    const originalLinesDiv = document.getElementById('originalLines');
    originalLinesDiv.style.height = '132px';
    originalLinesDiv.style.width = '100px';

    const transformedLinesDiv = document.getElementById('transformedLines');
    transformedLinesDiv.style.height = '132px';
    transformedLinesDiv.style.width = '100px';

    renderHexagramLines(data.originalHexagram, originalLinesDiv, data.originalHexagramInfo);
    
    // Update text information
    const originalTextDiv = document.getElementById('originalText');
    originalTextDiv.innerHTML = `
        <h2>Cast hexagram</h2>
        <h3>
            ${data.originalHexagramInfo.kingwen} -
            ${data.originalHexagramInfo.name.chinese} - 
            ${data.originalHexagramInfo.name.english}
        </h3>
        <p>${data.originalHexagramInfo.judgement.replace(/\n/g, '<br>')}</p>
        <p>${data.originalHexagramInfo.images.replace(/\n/g, '<br>')}</p>
    `;

    // Repeat for transformed hexagram
    renderHexagramLines(data.transformedHexagram, transformedLinesDiv, data.transformedHexagramInfo);
    
    const transformedTextDiv = document.getElementById('transformedText');
    transformedTextDiv.innerHTML = `
        <h2>Transformed hexagram</h2>
        <h3>
            ${data.transformedHexagramInfo.kingwen} -
            ${data.transformedHexagramInfo.name.chinese} - 
            ${data.transformedHexagramInfo.name.english}
        </h3>
        <p>${data.transformedHexagramInfo.judgement.replace(/\n/g, '<br>')}</p>
        <p>${data.transformedHexagramInfo.images.replace(/\n/g, '<br>')}</p>
    `;

    originalHexagram.style.opacity = 1;
    transformedHexagram.style.opacity = 1;
});



function renderHexagramLines(lines, container, hexagramInfo) {
    container.innerHTML = ''; // Clear previous content

    // Ensure the lines are reversed so that the first line is at the bottom
    const reversedLines = [...lines].reverse(); 
    
    reversedLines.forEach((line, index) => {

        const originalIndex = lines.length - index - 1;
        // Find the corresponding line meaning using index
        const lineMeaning = hexagramInfo.lines[originalIndex].meaning;
        console.log(lineMeaning)

        const svgContainer = document.createElement('div');
        svgContainer.classList.add('line-svg');
        const isYang = line.includes('yang');
        const isChanging = line.includes('Changing');
        const svgPath = isYang ? 'images/yang.svg' : 'images/yin.svg';
        svgContainer.innerHTML = `<object type="image/svg+xml" data="${svgPath}" class="hex-line-svg"></object>`;
        container.appendChild(svgContainer);

        if (isChanging) {
            svgContainer.classList.add('changing');
        }

        // Tooltip setup
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = `Line ${originalIndex + 1}: ${lineMeaning.replace(/\n/g, '<br>')}`;
        
        svgContainer.appendChild(tooltip); // Append the tooltip but keep it hidden initially

        svgContainer.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
            // Get the bounding rectangle of the svgContainer
            const rect = svgContainer.getBoundingClientRect();
            
            tooltip.style.top = rect.top + window.scrollY + 'px'; // Add window's scrollY to account for scrolling
            tooltip.style.left = rect.right + window.scrollX + 10 + 'px'; // Add window's scrollX to account for scrolling
        });
        
        svgContainer.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible'); // Hide tooltip when mouse leaves
        });
    });

    // Wait for the SVGs to be rendered before showing them
    setTimeout(() => {
        container.querySelectorAll('.line-svg').forEach(svg => {
            svg.style.opacity = 1;
        });
    }, 50)
}
