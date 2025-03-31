// templates go here, enter them in the format
// 
// [name]: ` (that's a backtick)
// script stuff script stuff '{{variable name}}' for variables
// more script stuff and all, 'variable name_TF}}' for a true or false box
// it'll clean up all of your variable names too, removes the TF from the end and replaces underscores with spaces.
// the rest is up to you :p
// ` (ends in a backtick)

const templates = {
    jokers: `
    SMODS.Joker { -- {{Name}} --
       key = '{{Key}}',

       -- description of the joker.
       loc_txt = {
           name = '{{Name}}',
           text = {
               {{Description}},
           }
       },

       -- config of the joker. Variables go here.
       config = {
           extra = {
               chips = {{Chips}},
               chips_gain = {{Chips_gain}}
           }
       },
       -- rarity level, 0 = common, 1 = uncommon, 2 = rare, 3 = legendary.
       rarity = '{{Rarity}}',

       -- atlas the joker uses for texture(s).
       atlas = '{{Atlas}}',

       -- where on the atlas texture the joker is located.
       pos = {
           x = {{Atlas_X}},
           y = {{Atlas_Y}}
       },
       -- cost of the joker in the shop.
       cost = {{Cost}},

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
   }
    `,

    decks: `
    SMODS.Back{ --{{Name}}
    name = "{{Name}}",      -- name of the deck (in code)
    key = "{{Key}}",       -- key used to call the deck 
    atlas = '{{Atlas}}',        -- atlas referenced for deck texture
    pos = {             -- position of the texture on the atlas
        x = 0,
        y = 0,
        },

    config = {              -- config for the deck, can include hands, discards, consumables, vouchers, money, etc.
        hands = {{Hands_Modifier}},
        discards = {{Discards_Modifier}},
        consumables = {'{{Consumables_Modifier}}'},
        money = {{Money_Modifier}},
    },

    unlocked = {{Unlocked_TF}},
    discovered = {{Discovered_TF}},

    loc_txt = {
        name = "{{Name}}", -- name the deck appears as in game
        text = {            -- description text for the deck
            {{Description}},
        }
    },
    loc_vars = function(self)   --variable setup
        return { vars = { 
            self.config.discards,   -- #1#
            self.config.hands,      -- #2#
            self.config.consumables,-- #3#
            self.config.money,      -- #4#
        }}
    end,`

};


/*
 z     ttttttttrctmccccccitcccccccccctjccsttttttttttrctmccccccccccccrsctttttttttttttccdteccccc     z 
 z    ttttttttecccccccccccccccccccccctjcttttttttttttrcccccccccccccccrsctttttttttttttcccccccccct    z 
 z    ttttttusdbdkhdbhjncccccccccccjtccctttttttttttmiclgccccccccccccilntttttttttttrlckncccccccl    z 
 z    tttttrj5ikkztkk07cccccccccccccccottttttttttttehtcccccccccccccthfttttttttttttncccccccccmtc    z 
 z    ttttka5kkpzztk5flccccccccccctoccottttttttttttehtcccccccccccccthfttttttttttttncticcccccmtc    z 
 z    ttqf0gkqvuqztkfaacccccccccdicccirtttttttttttchgccccccccccccficgltttttttttttpkccccccccifcc    z 
 z    ttsi7flzzzzztki09cccccccccftccctttttw                                       xccccccccedcc    z 
 z    tkd5kvzkzxkztk5flccccccccrscct                                                    iitccc5    z 
 z    k5bkkvzzzzzkc5kgcccccccccrw                                                           s5k    z 
 z    dbfkzxuztuzkgbddcccccyyy                                                                     z 
 z    5kszkvzzzxk5ckcccccr                                                                         z 
 z    kkszzzzzzxkkc5cccc                                                                           z 
 z    9kszzzzzzxk9cgcks                                                                            z 
 z    8kszzzzzzxk8ch                                                                               z 
 z    kkszzzzzzxkkz                                                                                z 
 z    kzukzzzzzxk                                                                                  z 
 z    kzzzzzzz                                                                                     z 
 z    kzzzzzz                                                                                      z 
 z    zksz                                                                                         z 
 z    zz                                                                                           z 
 z                                                                                                 z 
 z           ttz                                                                                   z 
 z         zrPPZt                                                                                  z 
 z       zaWPPPPPtz                                                              ztaawz            z 
 z     tcPPPPPPPPtz                                                             tPPPPPRt           z 
 z     tcPPPPPPZt                                                             ykPPPPPPPPqz         z 
 z     yjWPPPWuz                                                              ykPPPPPPPPP3t        z 
 z        kkm                                                                 ykPPPPPPPPP3t        z 
 z     z      zz                                                                tPPPPPPPP3t        z 
 z       zzzzz                                                                  tPPPPPPPP3t        z 
 z                                                                               ztaaaaaz          z 
 z                                                                              z         z        z 
 z                                                                               zzzzzzzzz         z 
 z                                                                                                 z 
 z                                                                                                 z 
 z                                                                                                 z 
 z                                                                                                 z 
 z                      zzzrrrrrrrrrrrrrrrrrrrrrrrrrrr                                             z 
 z              zzzzzzzzzufMMMMMMMMMMMMMMMMMMMMMMMMMMMfffzzzzzzzz                                  z 
 z               zzzzzzzzzzfffMMMMMMMMMMMMMMMMMMMMMMMMMMMfuzzzzzzzzzzz                             z 
 z                    zzzzzzzzjjjjjjjj4RRRRRRRRRRRRRZjjjjzzzzzzzzzzzzz                             z 
 z                            zzzzzzzzywwwwwwwwwwwwwxzzzzzzz                                       z 
 z    z                                                                                            z 
 z    zzzz                                                            zzzzzzzzzzzz           zz    z 
 z    ttxzzz                                                       zzzzttttttttttzzzzzz  zzzzzt    z 
 z    ttttttttttttttttttttttttzzzzzzzzzzz         zzzzzzz   zzzzttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttzzzzzzzzzzzvtttzzzzzzuttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z 
 z    itttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt    z
 */