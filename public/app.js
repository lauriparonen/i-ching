document.getElementById('generateHexagram').addEventListener('click', async () => {
    const response = await fetch('/generate-hexagram');
    const data = await response.json();

    // Display original hexagram info
    const originalHexDiv = document.getElementById('originalHexagram');
    originalHexDiv.innerHTML = `
        <h2>Cast hexagram: 
        ${data.originalHexagramInfo.name.chinese} - 
        ${data.originalHexagramInfo.name.english} -
        ${data.originalHexagramInfo.hexagram}
        </h2>
        <p>${data.originalHexagramInfo.judgement}</p>
        <p>${data.originalHexagramInfo.images}</p>
    `;

    // Display transformed hexagram info, if it exists
    const transformedHexDiv = document.getElementById('transformedHexagram');
    if (data.transformedHexagramInfo) {
        transformedHexDiv.innerHTML = `
            <h2>Transformed hexagram: ${data.transformedHexagramInfo.name.chinese}
             - ${data.transformedHexagramInfo.name.english} - 
               ${data.transformedHexagramInfo.hexagram}
             </h2>
            <p>${data.transformedHexagramInfo.judgement}</p>
            <p>${data.transformedHexagramInfo.images}</p>
        `;
    } else {
        transformedHexDiv.innerHTML = '';
    }
});
