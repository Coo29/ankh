let templates = {}; // Store loaded templates

// Template loading here:
async function loadTemplates() {
    const templateSelect = document.getElementById("templateSelect");
    
    templates['example'] = `
    Hello, {{name}}! You have {{items}} items.
    `;
    
    // Add the predefined template to the dropdown
    const exampleOption = document.createElement("option");
    exampleOption.value = 'example';
    exampleOption.textContent = 'Example Template';
    templateSelect.appendChild(exampleOption);

    templates['jokers'] = `
    SMODS.Joker { -- {{Name}} --
       key = '{{Name}}',

           -- description of the joker.
        loc_txt = {
            name = '{{Name}}',
            text = {
                "{{Description}}",
            }
        },

           -- config of the joker. Variables go here.
        config = {
           extra = {
                chips = '{{Chips}}',
                chips_gain = '{{Chips_gain}}'
                mult = '{{Mult}}',
                mult_gain = '{{Mult_gain}}',
                Xmult = '{{Xmult}}',
                Xmult_gain = '{{Xmult_gain}}',
                money = '{{Money}}',
                money_gain = '{{Money_gain}}',

         }
     },
            -- rarity level, 0 = common, 1 = uncommon, 2 = rare, 3 = legendary.
        rarity = '{{Rarity}}',

            -- atlas the joker uses for texture(s).
        atlas = '{{Atlas}}',
    
            -- where on the atlas texture the joker is located.
        pos = {
            x = '{{Atlas_X}}',
            y = '{{Atlas_Y}}'
        },
            -- cost of the joker in the shop.
        cost = '{{Cost}}',

            -- whether it is unlocked by default.
        unlocked = '{{Unlocked_TF}}',

            -- whether it is discovered by default.
        discovered = '{{Discovered_TF}}',

            -- whether blueprint can copy this joker.
        blueprint_compat = '{{Compat_with_Blueprint_TF}}',

            -- whether this joker can have the perishable sticker.
        perishable_compat = '{{Compat_with_Perishable_TF}}',
            -- whether this joker can have the eternal sticker.
        eternal_compat = '{{Compat_with_Eternal_TF}}',

            -- whether duplicates of this joker can appear in the shop by default.
        allow_duplicates = '{{Allow_duplicates_TF}}',

            -- loc_vars works with the config and gives you text variables to work with.
            -- these are formatted as #n#, where n is the position in the variable table.
        loc_vars = function(self, info_queue, card)
            return {
                vars = {
                        -- #1#
                    card.ability.extra.chips,
                        -- #2#
                    card.ability.extra.chips_gain,
                        -- #3#
                    card.ability.extra.mult,
                        -- #4#
                    card.ability.extra.mult_gain,
                        -- #5#
                    card.ability.extra.Xmult,
                        -- #6#
                    card.ability.extra.Xmult_gain,
                        -- #7#
                    card.ability.extra.money,
                        -- #8#
                    card.ability.extra.money_gain,
                    }
                }
        end,
    }
    `;
    
    // Add the predefined template to the dropdown
    const jokers = document.createElement("option");
    jokers.value = 'jokers';
    jokers.textContent = 'Jokers';
    templateSelect.appendChild(jokers);
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

        let input;
        
        if (varName.endsWith("TF")) {
            // Create a dropdown for variables ending with TF
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
        } else {
            // Create a text input for other variables
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
document.getElementById("templateSelect").addEventListener("change", () => {
    loadTemplate();
});

document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("generateButton").addEventListener("click", generateScript);
document.getElementById("exportButton").addEventListener("click", exportScript);

// Load the templates when the page loads
document.addEventListener("DOMContentLoaded", loadTemplates);
