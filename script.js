async function loadTemplates() {
    const templateSelect = document.getElementById("templateSelect");

    Object.keys(templates).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the first letter
        templateSelect.appendChild(option);
    });
}

// file upload stuff start
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
        const templateContent = reader.result;
        templates[file.name] = templateContent;
        
        // Add the uploaded template to the dropdown
        const templateSelect = document.getElementById("templateSelect");
        const option = document.createElement("option");
        option.value = file.name;
        option.textContent = file.name;
        templateSelect.appendChild(option);
    };
    reader.readAsText(file);
}
// file upload stuff end

// template stuff junk start
function loadTemplate() {
    const selectedTemplate = document.getElementById("templateSelect").value;
    const variableInputs = document.getElementById("variableInputs");
    
    variableInputs.innerHTML = ""; // Clear previous inputs

    if (!selectedTemplate || !templates[selectedTemplate]) return;

    let templateContent = templates[selectedTemplate];

    let matches = [...templateContent.matchAll(/{{(\w+)}}/g)];
    let uniqueVars = new Set(matches.map(match => match[1]));

    uniqueVars.forEach(varName => {
        if (varName === "Description") return; // Skip Description

        let displayName = varName.replace(/TF$/, "").replace(/_/g, " ");

        let wrapper = document.createElement("div");
        wrapper.classList.add("variable-wrapper");

        let label = document.createElement("label");
        label.textContent = displayName + ":";

        let input;
        
        if (varName.endsWith("TF")) { // Dropdown list for true/false
            input = document.createElement("select");
            input.id = varName;
            
            let trueOption = document.createElement("option");
            trueOption.value = "true";
            trueOption.textContent = "True";
            input.appendChild(trueOption);
            
            let falseOption = document.createElement("option");
            falseOption.value = "false";
            falseOption.textContent = "False";
            input.appendChild(falseOption);
        } 
        else if (varName.endsWith("Rarity")) { // Dropdown for rarity
            input = document.createElement("select");
            input.id = varName;

            ["Common", "Uncommon", "Rare", "Legendary"].forEach((rarity, index) => {
                let option = document.createElement("option");
                option.value = (index + 1).toString();
                option.textContent = rarity;
                input.appendChild(option);
            });
        } 
        else { 
            // Text input for all other variables
            input = document.createElement("input");
            input.type = "text";
            input.id = varName;
            input.placeholder = `Enter value for ${displayName}`;
        }

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        variableInputs.appendChild(wrapper);
    });
}
// template setup junk end

// export button start
function generateScript() {
    const selectedTemplate = document.getElementById("templateSelect").value;
    if (!selectedTemplate || !templates[selectedTemplate]) {
        alert("Please select a template first.");
        return;
    }

    let scriptContent = templates[selectedTemplate];

    // Handle Description variable separately
    const descriptionInput = document.getElementById("descInput").value.trim();
    if (descriptionInput) {
        // Wrap each line in quotes
        const formattedDescription = descriptionInput
            .split("\n")  // Split into lines
            .map(line => `"${line}"`)  // Wrap each line in quotes
            .join(",\n");  // Join with commas for Lua formatting

        // Replace {{Description}} in template
        scriptContent = scriptContent.replace(/{{Description}}/g, formattedDescription);
    }

    // Replace other variables except Description
    let matches = [...scriptContent.matchAll(/{{(\w+)}}/g)];
    matches.forEach(match => {
        const varName = match[1];

        // Skip Description since it's handled separately
        if (varName === "Description") return;

        const inputElement = document.getElementById(varName);
        if (inputElement) {
            const value = inputElement.value;
            scriptContent = scriptContent.replace(new RegExp(`{{${varName}}}`, 'g'), value);
        }
    });

    // Show the generated Lua script inside the textarea
    document.getElementById("output").value = scriptContent;

    // Enable the export button
    document.getElementById("exportButton").disabled = false;
}
// export button end

// actual export script stuff start
function exportScript() {
    const scriptContent = document.getElementById("output").textContent;
    if (!scriptContent) return;

    const blob = new Blob([scriptContent], { type: 'application/lua' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "script.lua";
    link.click();
}
// actual export script stuff end

// listeners (these prolly do something) start
document.getElementById("templateSelect").addEventListener("change", () => {
    loadTemplate();
});
document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("generateButton").addEventListener("click", generateScript);
document.getElementById("exportButton").addEventListener("click", exportScript);
// listeners end

// loads templates
document.addEventListener("DOMContentLoaded", loadTemplates);
