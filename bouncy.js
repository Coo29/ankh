// literally the exact same as my other webpages, gives the text a bouncy effect with individual lettering

document.addEventListener("DOMContentLoaded", () => {
    const textElements = document.querySelectorAll(".bouncy-text");
    
    textElements.forEach((el) => {
        let letters = el.innerText.split("");
        el.innerHTML = "";
        letters.forEach((letter, i) => {
            const span = document.createElement("span");
            if (letter === " ") {
                span.innerHTML = "&nbsp;";
                span.style.wordBreak = 'keep-all';
                el.appendChild(span);
            }
            else {
                span.innerText = letter;
                span.style.display = "inline-block";
                span.style.animation = `bounce 2s ${i * 0.1}s infinite ease-in-out`;
                span.style.wordBreak = 'normal';
                span.style.wordWrap = 'keep-all';
                el.appendChild(span);
            }
        });
    });
});
