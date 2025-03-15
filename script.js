let templates = {}; // Store loaded templates

// Function to load templates from a predefined list or uploaded files
async function loadTemplates() {
    const templateSelect = document.getElementById("templateSelect");
    
    // Predefined templates (for simplicity, just one example)
    templates['example'] = "Hello, {{name}}! You have {{items}} items.";
    
    // Add the predefined template to the dropdown
    const option = document.createElement("option");
    option.value = 'example';
    option.textContent = 'Example Template';
    templateSelect.appendChild(option);
}

// Function to handle file upload and load custom template
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

// Function to generate input fields for the variables in the selected template
function loadTemplate() {
    const selectedTemplate = document.getElementById("templateSelect").value;
    const variableInputs = document.getElementById("variableInputs");
    
    variableInputs.innerHTML = ""; // Clear previous inputs

    if (!selectedTemplate || !templates[selectedTemplate]) return;

    let templateContent = templates[selectedTemplate];

    // Find all unique variables using regex
    let matches = [...templateContent.matchAll(/{{(\w+)}}/g)];
    let uniqueVars = new Set(matches.map(match => match[1]));

    uniqueVars.forEach(varName => {
        let displayName = varName.replace(/TF$/, "").replace(/_/g, " "); // Cleaned-up name

        let wrapper = document.createElement("div");
        wrapper.classList.add("variable-wrapper");

        let label = document.createElement("label");
        label.textContent = displayName + ":";

        let input = document.createElement("input");
        input.type = "text";
        input.id = varName;
        input.placeholder = `Enter value for ${displayName}`;

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        variableInputs.appendChild(wrapper);
    });
}

// Function to generate the Lua script from the template and user inputs
function generateScript() {
    const selectedTemplate = document.getElementById("templateSelect").value;
    if (!selectedTemplate || !templates[selectedTemplate]) {
        alert("Please select a template first.");
        return;
    }

    let scriptContent = templates[selectedTemplate];

    // Replace all variables with user input
    let matches = [...scriptContent.matchAll(/{{(\w+)}}/g)];
    matches.forEach(match => {
        const varName = match[1];
        const inputElement = document.getElementById(varName);
        if (inputElement) {
            const value = inputElement.value;
            scriptContent = scriptContent.replace(new RegExp(`{{${varName}}}`, 'g'), value);
        }
    });

    // Display the generated Lua script
    document.getElementById("output").textContent = scriptContent;

    // Enable the export button
    document.getElementById("exportButton").disabled = false;
}

// Function to export the generated Lua script as a .lua file
function exportScript() {
    const scriptContent = document.getElementById("output").textContent;
    if (!scriptContent) return;

    const blob = new Blob([scriptContent], { type: 'application/lua' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "script.lua";
    link.click();
}

// Event listeners
document.getElementById("templateSelect").addEventListener("change", loadTemplate);
document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("generateButton").addEventListener("click", generateScript);
document.getElementById("exportButton").addEventListener("click", exportScript);

// Load the templates when the page loads
document.addEventListener("DOMContentLoaded", loadTemplates);
