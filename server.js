/**
 * This is the server-side code for an I Ching project.
 * 
 * The API endpoint '/generate-hexagram' makes a request to the random.org
 * API to get 18 randomly generated 0s and 1s, which are then used to
 * calculate the hexagram and its changing lines.
 * 
 * Based on a coin tossing method, the hexagram is calculated by grouping
 * the 18 random numbers into sets of three. Each set of three numbers
 * corresponds to a single line in the hexagram. The numbers are then
 * summed and the result is used to determine the line type:
 * - 0: Changing yin - all three numbers are 0, thus the line is changing
 * - 1: Non-changing yin - one number is 1, thus the line is non-changing
 * - 2: Non-changing yang - two numbers are 1, thus the line is non-changing
 * - 3: Changing yang - all three numbers are 1, thus the line is changing
 * 
 * In case the random.org API is not available, the server falls back to
 * generating random bits using the crypto module of Node.js.
 * 
 */

import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Source of hexagrams.json: https://gist.github.com/krry/7e2b3282702685a65ffc717730c73180
const hexagrams = JSON.parse(await fs.readFile('hexagrams.json', 'utf-8'));

app.use(express.static('public')); 

app.get('/generate-hexagram', async (req, res) => {
    const url = "https://www.random.org/integers/?num=18&min=0&max=1&col=1&base=10&format=plain&rnd=new";
    try {
        const response = await fetch(url);
        const data = await response.text();
        //const coinTosses = data.trim().split('\n').map(num => parseInt(num, 10));
        const coinTosses = data ? data.trim().split('\n').map(num => parseInt(num, 10)) : generateRandomBitsFallback();

        // Grouping the coin tosses into sets of three
        const groupedTosses = [];
        for (let i = 0; i < coinTosses.length; i += 3) {
            groupedTosses.push(coinTosses.slice(i, i + 3));
        }

        // Determine the lines 
        const hexagramLines = groupedTosses.map(toss => {
            const sum = toss.reduce((acc, curr) => acc + curr, 0);
            switch (sum) {
                case 0: return 'Changing yin'; // ---x--- 
                case 1: return 'Non-changing yin'; // --- ---
                case 2: return 'Non-changing yang'; // -------
                case 3: return 'Changing yang'; // ---o---
                default: throw new Error('Unexpected sum of coin tosses');
            }
        });

        // Calculate the new hexagram by applying changes
        const newHexagramLines = hexagramLines.map(line => {
            if (line === 'Changing yin') return 'Non-changing yang';
            if (line === 'Changing yang') return 'Non-changing yin';
            return line; // No change for non-changing lines
        });

        const originalBinaryString = linesToBinaryString(hexagramLines);
        const transformedBinaryString = linesToBinaryString(newHexagramLines);

        const originalHexagramInfo = getHexagramInfo(originalBinaryString);
        const transformedHexagramInfo = getHexagramInfo(transformedBinaryString);

        // Prepare the response
        const responseObj = {
            originalHexagram: hexagramLines,
            transformedHexagram: newHexagramLines
        };

        // Add hexagram info to the response
        responseObj.originalHexagramInfo = originalHexagramInfo;
        responseObj.transformedHexagramInfo = transformedHexagramInfo;

        res.json(responseObj);
        console.log(data, coinTosses, groupedTosses, hexagramLines, newHexagramLines, responseObj)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate hexagram' });
    }
});

function generateRandomBitsFallback() {
    console.log('Falling back to generating random bits using crypto module');
    // Generate 18 random bytes
    const randomBytes = crypto.randomBytes(18);
    // Convert each byte to bits and take the last bit of each to ensure it's 0 or 1
    return Array.from(randomBytes).flatMap(byte => byte & 1);
}

function linesToBinaryString(lines) {
    return lines.map(line => {
        switch(line) {
            case 'Non-changing yin': return '0';
            case 'Non-changing yang': return '1';
            case 'Changing yin': return '0';
            case 'Changing yang': return '1';
            default: throw new Error('Unexpected line type');
        }
    }).join('');
}

function getHexagramInfo(binaryString) {
    const key = `0b${binaryString}`;
    const hexagram = hexagrams[key];
    if (!hexagram) {
        throw new Error(`Hexagram not found for key: ${key}`);
    }
    return hexagram;
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
