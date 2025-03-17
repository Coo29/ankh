
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

// description custom colors start
const colorMap = {
    mult: "red",
    chips: "blue",

};

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