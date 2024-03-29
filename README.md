# I Ching 

This is a simple website which generates I Ching hexagrams by fetching random numbers from https://www.random.org/.
In case random.org is offline, the hexagrams are generated with randomBytes from Node's crypto library. 

## Logic for drawing the hexagrams
The logic for drawing the hexagrams is based on a coin-tossing method I've used myself, to keep things simple.

Original method:
1. Toss three coins at once six times; each individual coin ends up either 0 (yin) or 1 (yang)
2. To enable the changing of the lines, the result of each throw is weighted as follows:
   - Two yins, one yang -> unchanging yin line
   - Two yangs, one yin -> unchanging yang line
   - Three yins -> changing yin line; becomes a yang line in the transformed hexagram
   - Three yangs -> changing yang line; becomes a yin line in the transformed hexagram
3. Draw a line according to the rules above after each throw
4. Look up what's said about the drawn hexagram in the original Book of Changes or any entity of your choosing

Implementation:
1. The server fetches 18 randomly generated binary digits from random.org )
2. This is split into six arrays of length 3; each array represents a line
3. The line (and whether it's changing or not) is calculated with an accumulated sum:
   - if the sum of the bit array is 0, there are zero yangs, meaning it is a changing yin line (000)
   - if the sum is 1, there is one yang and two yins, making it an unchanging yin line (010)
   - if the sum is 2, there are two yangs and one yin, making it an unchanging yang line (110)
   - if the sum is 3, there are three yangs and no yins, making it a changing yang line (111)
4. The hexagram is converted to a binary string, and its corresponding description is fetched from hexagrams.json (shoutout @krry as it's taken from here: https://gist.github.com/krry/7e2b3282702685a65ffc717730c73180)

In this version, the drawing of the hexagram happens all at once, whereas traditionally each line is drawn one by one. 

TODOS:
- styling
- individual line examination
- figure out how to display the hexagrams
- saving readings?
- additional resources, links etc
