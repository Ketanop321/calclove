document.addEventListener('DOMContentLoaded', async function () {
    const text = "Hello! I am Ketan Kumar, a noob web developer pursuing BCA from a piece of shit college in Patna. I built this love calculator for fun purposes only.";
    const typingEffect = document.getElementById('typing-effect');
    let index = 0;

    function type() {
        if (index < text.length) {
            typingEffect.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 50); // Adjust typing speed here if needed
        }
    }

    type();

    // Load names from the server if available
    try {
        const response = await fetch('/api/get-names');
        const latestNames = await response.json();
        if (latestNames) {
            document.getElementById('name1').value = latestNames.name1;
            document.getElementById('name2').value = latestNames.name2;
        }
    } catch (error) {
        console.error('Error fetching names:', error);
    }
});

var name1 = document.getElementById("name1");
var name2 = document.getElementById("name2");
var calcBtn = document.querySelector("#btn");
var loveScore = Math.floor(Math.random() * 100) + 1;

var reloadBtn = document.getElementById("reload");

// Track active intervals so they can be cleared on repeated clicks
var heartIntervals = [];

const body = document.querySelector("body");

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "fas fa-heart";
    heart.style.left = (Math.random() * 100) + "vw";
    heart.style.animationDuration = (Math.random() * 3) + 2 + "s";
    body.appendChild(heart);
}

// Love Score Counter
function love() {
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    (async function () {
        var i = 0;
        while (i < loveScore) {
            document.getElementById("score").innerHTML = i + "%";
            await sleep(20);
            i++;
        }
    })();
}

const hash = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// Add event listener to button
calcBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    // Validate inputs before doing anything
    if (name1.value === "" && name2.value === "") {
        alert("You can't leave fields empty");
        return;
    } else if (name1.value === "") {
        alert("Please Enter Your Name");
        return;
    } else if (name2.value === "") {
        alert("Please Enter His/Her Name");
        return;
    }

    // Clear any previous heart animation intervals
    heartIntervals.forEach(function (id) { clearInterval(id); });
    heartIntervals = [];

    // Increase the chance of getting a love score greater than 90%
    let randomFactor = Math.random();
    if (
        hash(name1.value.toUpperCase()) === 493572976860604 &&
        hash(name2.value.toUpperCase()) === 8563725863411927
    ) {
        loveScore = Math.floor(Math.random() * (100 - 90) + 90);
    } else if (randomFactor < 0.15) { // Adjust this factor to increase chances
        loveScore = Math.floor(Math.random() * (100 - 90) + 90);
    } else {
        loveScore = Math.floor(Math.random() * 100) + 1;
    }

    love();
    if (loveScore > 90) {
        heartIntervals.push(setInterval(createHeart, 100));
        heartIntervals.push(setInterval(function () {
            var heartArr = document.querySelectorAll(".fa-heart");
            if (heartArr.length > 200) {
                heartArr[0].remove();
            }
        }, 100));
    }

    // Save names to the server
    try {
        await fetch('/api/save-names', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name1: name1.value,
                name2: name2.value
            })
        });
    } catch (error) {
        console.error('Error saving names:', error);
    }
});

// Function to reset the values
function reset() {
    window.location.reload();
}

function validateName(inputId) {
    let input = document.getElementById(inputId);
    let value = input.value;
    let regex = /^[A-Za-z ]+$/;

    if (!regex.test(value)) {
        alert("Please enter only characters in the name field.");
        input.value = value.replace(/[^A-Za-z ]/g, ''); // Remove any non-alphabetic characters
    }
}
