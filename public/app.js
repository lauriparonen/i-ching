document.getElementById('generateHexagram').addEventListener('click', async () => {
    document.getElementById('originalHexagram').style.opacity = 0;
    document.getElementById('transformedHexagram').style.opacity = 0;

    const response = await fetch('/generate-hexagram');
    const data = await response.json();

    // After fetching hexagram data
    const originalLinesDiv = document.getElementById('originalLines');
    const originalTextDiv = document.getElementById('originalText');
    
    renderHexagramLines(data.originalHexagram, originalLinesDiv, data.originalHexagramInfo);
    
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

    const transformedLinesDiv = document.getElementById('transformedLines');
    const transformedTextDiv = document.getElementById('transformedText');

    renderHexagramLines(data.transformedHexagram, transformedLinesDiv, data.transformedHexagramInfo);
    
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

    document.getElementById('originalHexagram').style.opacity = '1';
    document.getElementById('transformedHexagram').style.opacity = '1';


});

function renderHexagramLines(lines, container, hexagramInfo) {
    container.innerHTML = ''; // Clear previous content

    // Ensuring the line info is in the correct 
    const reversedLines = [...lines].reverse(); 
    
    reversedLines.forEach((line, index) => {

        const originalIndex = lines.length - index - 1;

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

        // Find the corresponding line meaning using index
        const lineMeaning = hexagramInfo.lines[originalIndex].meaning;
        console.log(lineMeaning)

        // Tooltip setup
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = lineMeaning; // Set the tooltip text to the line's meaning
        tooltip.style.visibility = 'hidden'; // Initially hide tooltip
        svgContainer.appendChild(tooltip); // Append the tooltip but keep it hidden initially

        svgContainer.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible'; // Show tooltip on hover
        });

        svgContainer.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden'; // Hide tooltip when mouse leaves
        });
    });
}
