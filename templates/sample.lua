-- Sample Lua Script
local myModule = {}

-- Configuration
local config = {
    name = "{{NAME}}",
    version = "{{VERSION}}",
    description = "{{DESCRIPTION}}"
}

-- Initialize module
function myModule.init()
    print("Initializing " .. config.name)
    -- {{CUSTOM_INIT_CODE}}
    return true
end

-- Main function
function myModule.run()
    -- {{CUSTOM_RUN_CODE}}
    return 0
end

return myModule
