
// description live preview junk start
document.getElementById("descInput").addEventListener("input", function() {
    let preview = document.getElementById("descPreview");
    let text = this.value;

    if (text.trim() === "") {
        preview.textContent = "Preview will appear here";
    } else {
        // Replace {C:[color]} text {} with a styled span element
        let formattedText = text.replace(/\{C:([\w#]+)\}([\s\S]*?)\{\}/g, 
            (match, color, content) => `<span style="color:${color}">${content}</span>`);

        preview.innerHTML = formattedText; // Use innerHTML to apply styles
    }
});
// description live preview junk end

// description color junk start

function applyColor() {
    let input = document.getElementById("descInput");
    let color = document.getElementById("colorPicker").value;

    let selectedText = window.getSelection().toString();
    if (!selectedText) return;

    let coloredText = '{C:${color}}${selectedText}{}';

    input.setRangeText(coloredText, input.selectionStart, input.selectionEnd, "end");

    input.dispatchEvent(new Event("input"));
}
// description color junk end

// custom color name variables start
const colorMap = {
    red: "ff4c40",
    mult: "#ff4c40",
    blue: "0096ff",
    chips: "#0096ff",
    green:  "#35bd86",
    money: "#f5b244",
    gold: "#eaba44",
    attention: "#ff8f00",
    purple: "#7b559c",
    white: "#ffffff",
    inactive: "#b1b1b1",
    spades: "#292189",
    hearts: "#f11b52",
    clubs: "#074540",
    diamonds: "#f15a27",
    tarot: "#9e74ce",
    planet: "#00a7ca",
    spectral: "#2e76fd",
    edition: "#bfb5ff",
    dark_edition: "#6060fb",
    legendary: "#aa5bb5",
    enhanced: "#757cdc",
};
// custom color name variables end

// custom color injection start
document.getElementById("descInput").addEventListener("input", function() {
    let preview = document.getElementById("descPreview");
    let text = this.value;

    if (text.trim() === "") {
        preview.textContent = "Preview will appear here";
    } else {
        let formattedText = text.replace(/\{C:([\w#]+)\}([\s\S]*?)\{\}/g, (match, color, content) => {
            let finalColor = colorMap[color] || color; 
            return `<span style="color:${finalColor}">${content}</span>`;
        });

        preview.innerHTML = formattedText;
    }
});
// custom color injection end