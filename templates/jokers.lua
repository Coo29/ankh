    SMODS.Joker { -- {{NAME}} --
       key = '{{NAME}}',

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
                    card.ability.extra.mult,
                        -- #2#
                    card.ability.extra.gain,
                    }
                }
        end,

        --[[
            -- calculate is where the scoring and effects of the joker are handled. 
        calculate = function(self, card, context)
                -- context.joker_main takes place when the joker is meant to score.
            if context.joker_main then
                return {
                        -- adds the number contained in the mult variable to the score.
                mult_mod = card.ability.extra.mult,
                        -- message is the text that appears when the joker scores.
                        -- localize is used to make sure the text works across multiple languages.
                    message  = localize {
                        type = 'variable',
                        key = 'a_mult',
                        vars = {
                            card.ability.extra.mult
                        }
                    }
                }
            end
                -- context.after takes place after the hand is scored.
                -- context.blueprint applies if the joker is a blueprint copy.
            if context.after and not context.blueprint then
                            -- adds the gain variable to the base mult number.
                        card.ability.extra.mult = card.ability.extra.mult + card.ability.extra.gain
                    return {
                            -- another message, just prints the text.
                        message = "Yippie!",
                        colour = G.C.MULT,
                            -- plays the sound effect yippie.ogg. the prefix is needed.
                        play_sound("Coo29_yippie"),
                            -- needed, can be changed to context.other_card to apply to another card.
                        card = card
                    }
            end
        end

        --]]
    }