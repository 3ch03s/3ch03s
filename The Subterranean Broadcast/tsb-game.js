const initialGameState = {
    currentBeat: 0,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    stability: 100,
    maxStability: 100,
    inventory: [],
    flags: {},
    scores: {
        attunement: 0,
        resistance: 0,
        corruption: 0
    }
};

let gameState = { ...initialGameState };

const titleScreen = document.getElementById('title-screen');
const gameScreen = document.getElementById('game-screen');
const inventoryScreen = document.getElementById('inventory-screen');
const startButton = document.getElementById('start-button');
const storyText = document.getElementById('story-text');
const choicesContainer = document.getElementById('choices-container');
const inventoryButton = document.getElementById('inventory-button');
const closeInventoryButton = document.getElementById('close-inventory');
const inventoryItems = document.getElementById('inventory-items');
const healthFill = document.getElementById('health-fill');
const healthValue = document.getElementById('health-value');
const staminaFill = document.getElementById('stamina-fill');
const staminaValue = document.getElementById('stamina-value');
const stabilityFill = document.getElementById('stability-fill');
const stabilityValue = document.getElementById('stability-value');
const restartButton = document.getElementById('restart-button');
const itemDescriptionBox = document.getElementById('item-description-box');
const itemDescriptionTitle = document.getElementById('item-description-title');
const itemDescriptionText = document.getElementById('item-description-text');
const closeDescriptionButton = document.getElementById('close-description');

const itemDescriptions = {
    "POCKET SCAN'R [Cracked]": "A handheld device of unknown origin, though it feels disturbingly familiar in your grip. Its cracked screen displays fluctuating waveforms and cryptic readings, apparently measuring the intensity and nature of the pervasive Subterranean Broadcast. Essential for navigating the tunnels—identifying areas of dangerous signal concentration or potentially 'safer' zones with weaker emissions. Whether built by earlier explorers trying to survive the signal, or perhaps a diagnostic tool belonging to whatever created this network, its purpose seems tied to understanding or at least quantifying the invisible madness permeating these depths.",
    "FERRITE DISC": "A small, smooth disc made of a dense, black ceramic-like material. It feels unnaturally cool to the touch and seems magnetically inert, yet holding it provides a noticeable dampening effect on the ambient sensory 'noise' – lessening the visual static and quieting the maddening whispers that ride the Broadcast signal. Its presence also appears disruptive or unpleasant to purely signal-based phenomena. Its precise origin is unknown, but it feels like a deliberate, if crude, attempt to create a personal shield against the psychic and spectral intrusions of the Subterranean Broadcast.",
    "RF Choke": "A metallic coil wrapped around a ferrite core. Appears designed to filter or suppress specific electromagnetic frequencies. Might offer protection against the Broadcast if used correctly.",
    "Lead Foil Scrap": "A thin, crumpled sheet of lead foil. Heavy for its size. Lead is known to block certain types of radiation and signal transmission. Could be used for makeshift shielding."
};

const storyBeats = [
    {
        id: 1,
        text: "Cold metal bites into your cheek. A low, pervasive HUM vibrates through your bones. Nausea churns. You open your eyes. Dim, flickering light illuminates a space of rusting grates, thick cables snaking into darkness, and walls stained with something dark and greasy. The air tastes like ozone and copper.\n\nWhere... are you? WHO... are you? Your mind is a blank slate, a screen filled with static. Panic claws, but it feels distant, muffled.\n\nWeirder still are the patterns. Faint, shifting geometric shapes overlay your vision, pulsing faintly with the HUM. And the whispers... just beneath hearing, like radio static trying to resolve into words.\n\nYou push yourself up. Your clothes are unfamiliar – dark, synthetic fabric, oddly rigid in places, torn at the knee. Near your hand lies a device: metallic, handheld, with a cracked screen displaying jagged, luminous lines. A POCKET SCAN'R. It feels... familiar?",
        choices: [ { text: "Examine Yourself: Check clothes for clues, assess injuries.", nextBeat: 2, effect: () => { gameState.scores.resistance += 1; } }, { text: "Examine the SCAN'R: Try to understand the device.", nextBeat: 3, effect: () => { addToInventory("POCKET SCAN'R [Cracked]"); } }, { text: "Focus on the Patterns/Whispers: Try to make sense of the sensory anomalies.", nextBeat: 4, effect: () => { gameState.scores.attunement += 2; adjustStat("stability", -5); } } ]
    },
    {
        id: 2,
        text: "You pat down the strange suit. It's tough, insulated. Inside a chest pocket: nothing but lint. Inside another: a small, smooth, cool FERRITE DISC. It feels slightly calming to hold, subtly dampening the visual static. You have minor scrapes, a headache, but seem functional. The whispers recede slightly as you focus on the physical. A nagging feeling remains – this suit, this place...",
        choices: [ { text: "Hold onto the FERRITE DISC tightly. Try to get your bearings.", nextBeat: 5, effect: () => { gameState.scores.resistance += 1; addToInventory("FERRITE DISC"); } }, { text: "Pocket the disc. Examine the SCAN'R now.", nextBeat: 3, effect: () => { addToInventory("FERRITE DISC"); if (!gameState.inventory.includes("POCKET SCAN'R [Cracked]")) { addToInventory("POCKET SCAN'R [Cracked]"); } } } ]
    },
    {
        id: 3,
        text: "You pick up the SCAN'R. The cracked screen shows a chaotic waveform pulsing in sickly green. Numbers and labels flicker: \"Frequency,\" \"Signal Strength,\" \"Integrity?\" It seems to measure the pervasive HUM, the Broadcast. Instinctively, your fingers find worn buttons. Pressing one causes the waveform to briefly stabilize, showing repeating patterns hidden within the noise. Another button makes a needle icon sweep, indicating stronger signal emanations from a dark tunnel opening nearby. This tool feels like an extension of your senses... or perhaps it always was?",
        choices: [ { text: "Use the SCAN'R to scan for the weakest signal path. Safety first.", nextBeat: 5, effect: () => { gameState.scores.resistance += 1; if (!gameState.inventory.includes("POCKET SCAN'R [Cracked]")) { addToInventory("POCKET SCAN'R [Cracked]"); } } }, { text: "Follow the stronger signal into the dark tunnel. Curiosity (or something else?) pulls you.", nextBeat: 6, effect: () => { gameState.scores.attunement += 1; gameState.scores.corruption += 1; if (!gameState.inventory.includes("POCKET SCAN'R [Cracked]")) { addToInventory("POCKET SCAN'R [Cracked]"); } } }, { text: "Try to tune the SCAN'R to the frequency of the whispers you hear.", nextBeat: 7, effect: () => { gameState.scores.attunement += 2; gameState.scores.corruption += 1; adjustStat("stability", -10); if (!gameState.inventory.includes("POCKET SCAN'R [Cracked]")) { addToInventory("POCKET SCAN'R [Cracked]"); } } } ]
    },
    {
        id: 4,
        text: "You close your eyes, letting the external fade. You focus on the visual patterns, the static whispers. It's uncomfortable, nauseating... but also... intriguing? The patterns seem to react to your focus, becoming more complex, almost architectural. The whispers coalesce momentarily – not words, but pure *intent*... hunger... connection... broadcast... You feel a strange resonance deep within you, a pull towards the HUM. A sharp pain lances through your temple, then fades, leaving a lingering metallic taste.",
        choices: [ { text: "Pull back! This feels dangerous. Grab the SCAN'R and look for a way out.", nextBeat: 3, effect: () => { gameState.scores.resistance += 2; gameState.scores.corruption += 1; adjustStat("stability", 5); if (!gameState.inventory.includes("POCKET SCAN'R [Cracked]")) { addToInventory("POCKET SCAN'R [Cracked]"); } } }, { text: "Embrace the sensation. Try to understand the *intent* further.", nextBeat: 7, effect: () => { gameState.scores.attunement += 3; gameState.scores.corruption += 2; adjustStat("stability", -15); } } ]
    },
    {
        id: 5,
        text: "You move cautiously away from your starting point, SCAN'R (if you have it) readings guiding you or instinct driving you. You reach a junction of two distinct tunnels.\n\nPath 1: A cramped maintenance conduit, relatively clear, marked with faded hazard symbols. Emergency lights flicker intermittently. The HUM is less oppressive here. The SCAN'R confirms weaker signal readings.\n\nPath 2: A larger tunnel thick with cables. The HUM is stronger, vibrating the floor. Strange, glowing fungi pulse on the walls, casting an eerie green light. The air feels thick, charged. The whispers seem louder here, and the SCAN'R needle jumps.",
        choices: [ { text: "Take Path 1 (Maintenance Conduit). Seems safer.", nextBeat: 8, effect: () => { gameState.scores.resistance += 1; } }, { text: "Take Path 2 (Fungal Tunnel). The energy draws you.", nextBeat: 9, effect: () => { gameState.scores.attunement += 1; gameState.scores.corruption += 1; } } ]
    },
     {
        id: 6,
        text: "You follow the stronger signal into the oppressive darkness. The HUM intensifies, becoming a physical pressure. Thick, greasy cables cover the walls and floor like metallic vines. The SCAN'R screen glitches wildly, displaying [DANGER: HIGH SIGNAL | INTEGRITY COMPROMISED]. The whispers are clearer now, insistent, promising... what? Power? Knowledge? Release? You feel a tingling under your skin. Ahead, you see movement – a jerky, flickering shape.",
        choices: [ { text: "Prepare for a threat. Find cover among the cables.", nextBeat: 10, effect: () => { gameState.scores.resistance += 1; adjustStat("stamina", -5); } }, { text: "Try to 'harmonize' with the signal, project calm using the whispers' cadence.", nextBeat: 11, effect: () => { gameState.scores.attunement += 3; gameState.scores.corruption += 2; adjustStat("stability", -20); } } ]
    },
     {
        id: 7,
        text: "You focus intensely on the SCAN'R (or just the whispers in your mind if you embraced them earlier). You try to match the frequency, to synchronize. The device whines, or your head screams. The world flashes white, then settles. The whispers flood your mind – not words, but raw data, emotions, commands... *Seek the Node... Harmonize... Become Carrier...* It's overwhelming, painful, yet parts of you *recognize* this. You feel... empowered? Changed? Your hand holding the SCAN'R seems to flicker, less solid. A memory fragment surfaces: chanting in darkness, the taste of copper, the feeling of *belonging*.",
        choices: [ { text: "This is too much! Fight it! Try to block it out!", nextBeat: 12, effect: () => { gameState.scores.resistance += 4; gameState.scores.corruption += 3; adjustStat("health", -10); adjustStat("stability", -25); } }, { text: "Accept the inflow. Follow the command. Seek the Node.", nextBeat: 13, effect: () => { gameState.scores.attunement += 5; gameState.flags.knowsNodeCommand = true; if (!gameState.inventory.includes("POCKET SCAN'R [Cracked]")) { addToInventory("POCKET SCAN'R [Cracked]"); } } } ]
    },
    {
        id: 8,
        text: "You squeeze into the maintenance conduit. Dust cakes your clothes instantly, and the tight space presses in. The flickering lights cast dancing shadows that play tricks on your eyes. Ahead, the conduit seems to split again.\n\nOne branch continues straight, relatively clear but descending slightly. The other turns sharply right, partially blocked by fallen debris. You spot something metallic glinting amidst the rubble.",
        choices: [
            { text: "Continue straight down the clearer path.", nextBeat: 15 },
            { text: "Investigate the debris and the glinting object.", nextBeat: 16, effect: () => { adjustStat("stamina", -5); } }
        ]
    },
    {
        id: 9,
        text: "You venture into the tunnel coated in pulsing, bio-luminescent fungi. The air is humid and smells faintly sweet, underneath the ever-present ozone. Spores drift lazily, catching the sickly green light. The SCAN'R shows moderate, fluctuating signal strength, seemingly tied to the fungi's pulses.\n\nWalking carefully, you notice patches where the fungi seems to have *consumed* the cables, integrating them into its strange structure. One particularly large cluster directly ahead blocks most of the tunnel.",
        choices: [
            { text: "Attempt to push through the fungal cluster carefully.", nextBeat: 17, effect: () => { gameState.scores.corruption += 2; adjustStat("health", -5); adjustStat("stamina", -10); } },
            { text: "Use the SCAN'R to analyze the large cluster.", nextBeat: 18, effect: () => { gameState.scores.attunement += 1; adjustStat("stability", -5); } },
            { text: "Look for a way around the cluster, maybe behind cables.", nextBeat: 19, effect: () => { gameState.scores.resistance += 1; adjustStat("stamina", -10); } }
        ]
    },
    {
        id: 10,
        text: "You duck behind a thick bundle of greasy cables, holding your breath. The flickering shape – a Static Phantom – drifts closer. It seems less a creature, more a localized tear in reality filled with visual noise and crackling audio. It pauses, turning its 'head' made of swirling static towards your hiding spot. It hasn't seen you yet, but it seems drawn to... something.",
        choices: [
            { text: "Stay perfectly still and hope it passes.", nextBeat: 20, effect: () => { adjustStat("stamina", -5); } },
            { text: "Attempt to flee while its attention drifts.", nextBeat: 21, effect: () => { gameState.scores.resistance += 1; adjustStat("stamina", -15); } },
            {
                text: "Use the FERRITE DISC defensively.",
                condition: () => gameState.inventory.includes("FERRITE DISC"),
                nextBeat: 22,
                effect: () => { gameState.scores.resistance += 2; adjustStat("stability", 5); }
            },
             {
                text: "Try to disrupt it with the SCAN'R from cover.",
                condition: () => gameState.inventory.includes("POCKET SCAN'R [Cracked]"),
                nextBeat: 23,
                effect: () => { gameState.scores.corruption += 1; adjustStat("stability", -10); }
            }
        ]
    },
    {
        id: 11,
        text: "Focusing your will, you try to mimic the cadence of the whispers, projecting a sense of calm resonance towards the flickering Static Phantom. It halts its jerky movements. The swirling static within its form seems to... stabilize slightly? Its crackling lessens, replaced by a low, questioning hum. It turns fully towards you, not aggressively, but with unnerving focus. It seems to be *listening*.",
        choices: [
            { text: "Deepen the resonance, attempt communication.", nextBeat: 24, effect: () => { gameState.scores.attunement += 4; gameState.scores.corruption += 2; adjustStat("stability", -15); } },
            { text: "Slowly back away while maintaining the resonance.", nextBeat: 25, effect: () => { gameState.scores.attunement += 1; gameState.scores.resistance += 1; adjustStat("stamina", -5); } },
            { text: "Break the resonance suddenly and bolt.", nextBeat: 21, effect: () => { gameState.scores.resistance += 1; gameState.scores.corruption += 1; adjustStat("stability", -5); adjustStat("stamina", -15); } }
        ]
    },
    {
        id: 12,
        text: "The world swims back into focus. Your head throbs, and a wave of weakness washes over you. The intense sensory input, the attempted synchronization... it nearly broke you. You feel fragile, exposed. Looking around, you realize you've somehow stumbled back near the initial junction, the choice between the maintenance conduit and the fungal tunnel.",
        choices: [
            { text: "Take the Maintenance Conduit (Path 1). Need safety now.", nextBeat: 8, effect: () => { gameState.scores.resistance += 2; } },
            { text: "Take the Fungal Tunnel (Path 2). Still feel... drawn.", nextBeat: 9, effect: () => { gameState.scores.attunement += 1; gameState.scores.corruption += 1; } },
            { text: "Just rest here for a moment. Try to recover.", nextBeat: 26, effect: () => { adjustStat("health", 5); adjustStat("stamina", 10); adjustStat("stability", 5); } }
        ]
    },
    {
        id: 13,
        text: "You surrender to the whispers, letting them guide your steps. The command - *Seek the Node... Harmonize... Become Carrier...* - echoes in your mind, feeling less like an intrusion and more like... purpose. The path ahead seems clearer, the ambient static less jarring, as if the Broadcast itself is smoothing the way.\n\nYou move through tunnels pulsing with energy. The SCAN'R (if you consult it) shows increasingly high, yet strangely stable, signal readings. Ahead, you see a chamber entrance, marked with unfamiliar, complex geometric symbols that resonate with the patterns in your vision.",
        choices: [
            { text: "Enter the chamber without hesitation.", nextBeat: 27 },
            {
                text: "Use the SCAN'R to analyze the symbols and chamber entrance.",
                condition: () => gameState.inventory.includes("POCKET SCAN'R [Cracked]"),
                nextBeat: 28,
                effect: () => { gameState.scores.attunement += 1; gameState.scores.resistance += 1; adjustStat("stability", -5); }
            },
            {
                text: "Recite the command 'Become Carrier' as you enter.",
                condition: () => gameState.flags.knowsNodeCommand,
                nextBeat: 29,
                effect: () => { gameState.scores.attunement += 3; gameState.scores.corruption += 1; }
            }
        ]
    },
    {
        id: 14,
        text: "[Developer Note: This branch currently ends here. More content coming soon!]",
        choices: [ { text: "Restart from Beginning", nextBeat: 0, effect: restartGame } ]
    },
    {
        id: 15,
        text: "The clear conduit descends gradually. The air grows colder, damper. Water drips steadily from unseen cracks above. The HUM is noticeably weaker here, almost peaceful... if not for the oppressive silence. Up ahead, you hear a faint, rhythmic *clicking* sound.",
        choices: [
            { text: "Proceed cautiously towards the clicking sound.", nextBeat: 30 },
            { text: "Use the SCAN'R to check for signals despite the quiet.", nextBeat: 31 },
            { text: "Search the walls for any hidden panels or markings.", nextBeat: 32 }
        ]
    },
    {
        id: 16,
        text: "You carefully shift aside chunks of rusted metal and broken piping. The glinting object is a small, metallic canister, dented but intact. It's labeled with faded letters: 'RF Choke - Type III'. Nearby, half-buried, is a tattered piece of Lead Foil Scrap.",
        choices: [
            { text: "Take the RF Choke and the Lead Foil.", nextBeat: 33, effect: () => { addToInventory("RF Choke"); addToInventory("Lead Foil Scrap"); gameState.scores.resistance += 1;} },
            { text: "Ignore the items and continue down the main conduit (Path 1).", nextBeat: 15 },
            { text: "Examine the debris more thoroughly for anything else.", nextBeat: 34 }
        ]
    },
     {
        id: 17,
        text: "Holding your breath, you push through the dense fungal mass. It yields with a wet, tearing sound, releasing a puff of thick spores that make you cough violently. Slimy tendrils brush against your suit. You stumble through to the other side, feeling itchy and slightly nauseous. The air here feels even heavier.",
        choices: [
            { text: "Press onward quickly, ignoring the discomfort.", nextBeat: 35, effect: () => { gameState.scores.corruption += 1; adjustStat("stamina", -5); } },
            { text: "Check yourself for any attached tendrils or growths.", nextBeat: 36, effect: () => { gameState.scores.resistance += 1; } },
            { text: "Use the SCAN'R to check your own bio-signature.", nextBeat: 37, effect: () => { adjustStat("stability", -5); } }
        ]
    },
    {
        id: 18,
        text: "You hold the SCAN'R up to the large fungal cluster. The device emits a low whine as it analyzes. The screen flickers, displaying complex bio-resonant frequencies intertwined with the Broadcast signal. It seems the fungus isn't just growing *near* the signal, it's actively *metabolizing* it, becoming a living part of the network. The SCAN'R identifies a slightly weaker resonance point near the base.",
        choices: [
            { text: "Try to disrupt the weaker resonance point with the SCAN'R.", nextBeat: 38, effect: () => { gameState.scores.corruption += 1; adjustStat("stability", -10); } },
            { text: "Carefully push through near the identified weak point.", nextBeat: 17, effect: () => { gameState.scores.corruption += 1; adjustStat("health", -3); adjustStat("stamina", -8); } },
            { text: "Record the bio-resonant data (if possible) and look for another way.", nextBeat: 19, effect: () => { gameState.flags.fungalDataRecorded = true; gameState.scores.resistance += 1; adjustStat("stamina", -10); } }
        ]
    },
    {
        id: 19,
        text: "You scan the edges of the tunnel near the fungal mass. Behind a thick tangle of hanging cables, partially obscured by shadow, you find a narrow gap leading into darkness. It looks like a tight squeeze, possibly another maintenance access.",
        choices: [
            { text: "Squeeze through the narrow gap.", nextBeat: 39, effect: () => { adjustStat("stamina", -5); } },
            { text: "Forget it, try pushing through the main fungal mass.", nextBeat: 17, effect: () => { gameState.scores.corruption += 2; adjustStat("health", -5); adjustStat("stamina", -10); } },
        ]
    },
     {
        id: 20,
        text: "You remain frozen, every muscle tense. The Static Phantom hovers near your hiding spot, the crackling noise almost deafening. After a moment that stretches into an eternity, its flickering form seems to lose focus. It drifts slowly onwards, down the corridor, leaving behind a faint scent of ozone and a lingering sense of unease.",
        choices: [
            { text: "Wait a moment longer, then proceed cautiously.", nextBeat: 40 },
            { text: "Try to follow it from a safe distance.", nextBeat: 41, effect: () => { adjustStat("stamina", -10); } },
        ]
    },
    {
        id: 21,
        text: "You bolt! The Static Phantom emits a piercing shriek of distorted noise and surges after you, moving faster than you thought possible. Its flickering form stretches, trying to engulf you. The air crackles with energy.",
        choices: [
            { text: "Keep running, dodge obstacles!", nextBeat: 42, effect: () => { adjustStat("stamina", -20); gameState.scores.corruption += 1; } },
            { text: "Try to use the environment - pull down cables?", nextBeat: 43, effect: () => { adjustStat("stamina", -15); gameState.scores.resistance += 1; } },
            { text: "Turn and face it - use FERRITE DISC?", condition: () => gameState.inventory.includes("FERRITE DISC"), nextBeat: 22, effect: () => { adjustStat("health", -10); } },
            { text: "Turn and face it - use SCAN'R disruption?", condition: () => gameState.inventory.includes("POCKET SCAN'R [Cracked]"), nextBeat: 23, effect: () => { adjustStat("health", -10); adjustStat("stability", -5); } },
        ]
    },
     {
        id: 22,
        text: "You hold the FERRITE DISC out like a ward. As the Static Phantom draws near, the disc grows noticeably warmer in your hand. The phantom seems to *recoil* slightly, its form flickering more chaotically where it nears the disc. It halts its advance, emitting a low, frustrated buzz.",
        choices: [
            { text: "Press the advantage - move towards it with the disc.", nextBeat: 44, effect: () => { gameState.scores.resistance += 1; gameState.scores.corruption += 1; } },
            { text: "Use the pause to back away slowly.", nextBeat: 40 },
            { text: "While it's hesitant, try to flee.", nextBeat: 21, effect: () => { adjustStat("stamina", -10); } }
        ]
    },
    {
        id: 23,
        text: "Fumbling with the SCAN'R, you try to overload its sensors or emit a counter-frequency. The device screeches, screen flashing wildly. The Static Phantom reacts violently, its form expanding and contracting rapidly. It lets out a burst of pure static that washes over you, making your vision swim and ears ring.",
        choices: [
            { text: "The disruption worked! Press the attack?", nextBeat: 45, effect: () => { gameState.scores.corruption += 2; adjustStat("stability", -10); } },
            { text: "It's stunned! Flee now!", nextBeat: 40, effect: () => { adjustStat("stamina", -5); } },
            { text: "The feedback is too much! Drop the SCAN'R and run!", nextBeat: 21, effect: () => { gameState.inventory = gameState.inventory.filter(item => item !== "POCKET SCAN'R [Cracked]"); adjustStat("stamina", -15); } }
        ]
    },
    {
        id: 24,
        text: "You push deeper, opening your mind further to the resonance. Images, fractured and alien, flood your thoughts – glimpses of vast, humming machinery, endless tunnels stretching into darkness, geometric patterns folding in on themselves. The phantom doesn't 'speak,' but projects raw *sensation* – loneliness, confusion, a longing for connection... or integration.",
        choices: [
            { text: "Offer connection, embrace the integration.", nextBeat: 46, effect: () => { gameState.scores.attunement += 5; gameState.scores.corruption += 3; adjustStat("stability", -20); } },
            { text: "Ask 'What are you?' through resonant thoughts.", nextBeat: 47, effect: () => { gameState.scores.attunement += 2; adjustStat("stability", -10); } },
            { text: "This is too much, sever the connection now!", nextBeat: 12, effect: () => { gameState.scores.resistance += 3; gameState.scores.corruption += 2; adjustStat("health", -5); adjustStat("stability", -15); } },
        ]
    },
     {
        id: 25,
        text: "Maintaining the calming resonance, you slowly back away from the Static Phantom. It remains focused on you, humming quietly, but makes no move to follow. You retreat down the corridor, the strange connection fading with distance. The encounter leaves you drained but strangely thoughtful.",
        choices: [
            { text: "Continue down the corridor.", nextBeat: 40 },
            { text: "Rest briefly to recover stability.", nextBeat: 26, effect: () => { adjustStat("stamina", 5); adjustStat("stability", 10); } }
        ]
    },
    {
        id: 26,
        text: "You lean against the cold, damp wall near the junction, focusing on your breathing. The immediate sensory overload recedes, leaving a dull ache behind your eyes. You feel slightly more grounded, the panic lessening. The choice remains: the safer-seeming conduit, or the strangely alluring fungal tunnel?",
        choices: [
            { text: "Feeling better. Take the Maintenance Conduit (Path 1).", nextBeat: 8 },
            { text: "Feeling better. Take the Fungal Tunnel (Path 2).", nextBeat: 9 },
            { text: "Rest a little longer.", nextBeat: 26, effect: () => { adjustStat("stamina", 5); adjustStat("stability", 5); } }
        ]
    },
    {
        id: 27,
        text: "You step into the chamber. The HUM here is intense, a palpable vibration that resonates deep within your bones, yet it feels... harmonious. The walls are covered in the same complex symbols, glowing softly. In the center of the room stands a pillar of what looks like solidified static, pulsing with the rhythm of the Broadcast. It feels like a focal point, a place of power.",
        choices: [
            { text: "Approach the pillar.", nextBeat: 48 },
            { text: "Examine the symbols on the walls.", nextBeat: 49 },
            { text: "Meditate, try to fully harmonize with the chamber's energy.", nextBeat: 50, effect: () => { gameState.scores.attunement += 3; adjustStat("stability", -10); } }
        ]
    },
    {
        id: 28,
        text: "PLACEHOLDER FOR BEAT 28 (SCAN CHAMBER)",
        choices: [
             { text: "Enter chamber now", nextBeat: 27 }
        ]
    },
     {
        id: 29,
        text: "PLACEHOLDER FOR BEAT 29 (ENTER CHAMBER RECITING COMMAND)",
        choices: [
             { text: "Continue", nextBeat: 48 }
        ]
    },
    {
        id: 30,
        text: "Rounding a bend, you see the source of the clicking: several Cable-Ticks, parasitic insectoids about the size of your fist, are methodically chewing through the insulation of a thick power conduit. Sparks occasionally fly from their mandibles as they bite into the wiring.",
        choices: [
             { text: "Attempt to sneak past them.", nextBeat: 51, effect: () => { adjustStat("stamina", -10); gameState.scores.resistance += 1; } },
             { text: "Try to scare them off by banging on a nearby pipe.", nextBeat: 52, effect: () => { adjustStat("stamina", -5); gameState.scores.corruption += 1; } },
             { text: "Use the SCAN'R to analyze their energy consumption.", condition: () => gameState.inventory.includes("POCKET SCAN'R [Cracked]"), nextBeat: 53, effect: () => { adjustStat("stability", -5); } }
        ]
    },
     { id: 31, text: "SCANNING THE QUIET - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 32, text: "CONDUIT SEARCH - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 33, text: "You quickly pocket the RF Choke and the Lead Foil scrap, the cool metal grounding against your palm. The path ahead seems clearer now.", choices: [{ text: "Continue down main conduit", nextBeat: 15 }] },
     { id: 34, text: "DEEPER DEBRIS SEARCH - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 35, text: "BEYOND THE FUNGI - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 36, text: "POST-FUNGAL CHECK - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 37, text: "SELF-SCAN - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 38, text: "DISRUPT FUNGUS - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 39, text: "NARROW GAP - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 40, text: "PAST THE PHANTOM - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 41, text: "SHADOWING PHANTOM - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 42, text: "ESCAPE ATTEMPT - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 43, text: "DESPERATE MEASURES - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 44, text: "PUSHING BACK PHANTOM - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 45, text: "DISRUPTED PHANTOM - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 46, text: "PHANTOM MERGE? - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 47, text: "PHANTOM QUERY - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 48, text: "THE STATIC PILLAR - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 49, text: "CHAMBER SYMBOLS - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 50, text: "CHAMBER MEDITATION - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 51, text: "SNEAKING PAST TICKS - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 52, text: "STARTLING TICKS - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
     { id: 53, text: "SCANNING TICKS - PLACEHOLDER", choices: [{ text: "Continue", nextBeat: 14 }] },
];

let typingTimeout;

function updateStatsDisplay() {
    const healthPercent = (gameState.health / gameState.maxHealth) * 100;
    healthFill.style.width = `${healthPercent}%`;
    healthValue.textContent = `${gameState.health}/${gameState.maxHealth}`;
    if (healthPercent <= 25) healthFill.style.backgroundColor = '#a00';
    else if (healthPercent <= 50) healthFill.style.backgroundColor = '#f80';
    else healthFill.style.backgroundColor = '#f00';

    const staminaPercent = (gameState.stamina / gameState.maxStamina) * 100;
    staminaFill.style.width = `${staminaPercent}%`;
    staminaValue.textContent = `${gameState.stamina}/${gameState.maxStamina}`;
    if (staminaPercent <= 25) staminaFill.style.backgroundColor = '#0a0';
    else if (staminaPercent <= 50) staminaFill.style.backgroundColor = '#af0';
    else staminaFill.style.backgroundColor = '#0f0';

    const stabilityPercent = (gameState.stability / gameState.maxStability) * 100;
    stabilityFill.style.width = `${stabilityPercent}%`;
    stabilityValue.textContent = `${gameState.stability}/${gameState.maxStability}`;
     if (stabilityPercent <= 25) stabilityFill.style.backgroundColor = '#f08';
    else if (stabilityPercent <= 50) stabilityFill.style.backgroundColor = '#08f';
    else stabilityFill.style.backgroundColor = '#0af';
}

function adjustStat(stat, amount) {
    const maxStatKey = `max${stat.charAt(0).toUpperCase() + stat.slice(1)}`;
    if (gameState.hasOwnProperty(stat) && gameState.hasOwnProperty(maxStatKey)) {
        gameState[stat] += amount;
        gameState[stat] = Math.max(0, Math.min(gameState[maxStatKey], gameState[stat]));
    } else {
        console.error(`Invalid stat or maxStatKey: ${stat}, ${maxStatKey}`);
    }
    updateStatsDisplay();
}

function addToInventory(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
        console.log(`Added ${item} to inventory.`);
        if (inventoryScreen.style.display === 'flex') {
            displayInventory();
        }
    } else {
        console.log(`${item} is already in inventory.`);
    }
}

function displayInventory() {
    inventoryItems.innerHTML = '';
    const inventorySize = 24;

    for (let i = 0; i < inventorySize; i++) {
        const itemSlot = document.createElement('div');
        if (i < gameState.inventory.length) {
            const itemName = gameState.inventory[i];
            itemSlot.classList.add('inventory-item');
            itemSlot.textContent = itemName;
            itemSlot.addEventListener('click', () => showItemDescription(itemName));
        } else {
            itemSlot.classList.add('inventory-item', 'empty-slot');
            itemSlot.textContent = '[Empty]';
        }
        inventoryItems.appendChild(itemSlot);
    }
}

function showItemDescription(itemName) {
    const description = itemDescriptions[itemName];
    if (description) {
        itemDescriptionTitle.textContent = itemName;
        itemDescriptionText.textContent = description;
        itemDescriptionBox.style.display = 'flex';
    } else {
        itemDescriptionTitle.textContent = itemName;
        itemDescriptionText.textContent = "No detailed information available for this item.";
        itemDescriptionBox.style.display = 'flex';
        console.warn(`No description found for item: ${itemName}`);
    }
}

function gameOver(message) {
    clearTimeout(typingTimeout);
    storyText.innerHTML = `<p style="color:red; font-weight:bold;">${message}</p><p>TRANSMISSION LOST</p>`;
    choicesContainer.innerHTML = '';

    const restartBtn = document.createElement('button');
    restartBtn.textContent = "Restart Transmission";
    restartBtn.classList.add('choice');
    restartBtn.style.marginTop = '20px';
    restartBtn.addEventListener('click', restartGame);
    choicesContainer.appendChild(restartBtn);
    storyText.scrollTop = storyText.scrollHeight;
}

function displayBeat(beatId) {
    const beat = storyBeats.find(b => b.id === beatId);
    if (!beat) {
        console.error(`Beat with ID ${beatId} not found`);
        storyText.innerHTML = `<p style="color:red;">Error: Story beat ${beatId} could not be loaded.</p>`;
        choicesContainer.innerHTML = '';
        return;
    }

    console.log(`--- Displaying Beat ${beatId} ---`);
    console.log("Current Scores:", JSON.stringify(gameState.scores));
    console.log("Current Flags:", JSON.stringify(gameState.flags));
    console.log("Current Inventory:", gameState.inventory.join(', '));

    gameState.currentBeat = beatId;

    storyText.innerHTML = '';
    let formattedText = beat.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\n/g, '<br>');

    typeText(`<p>${formattedText}</p>`, storyText, 0, 15);

    displayChoices(beat.choices);
}

function typeText(fullText, element, index = 0, speed = 15) {
    clearTimeout(typingTimeout);

    if (index < fullText.length) {
        element.innerHTML = fullText.substring(0, index + 1);
        index++;
        typingTimeout = setTimeout(() => typeText(fullText, element, index, speed), speed);
        element.scrollTop = element.scrollHeight;
    } else {
        element.scrollTop = element.scrollHeight;
    }
}

function displayChoices(choices) {
    choicesContainer.innerHTML = '';

    if (!choices || choices.length === 0) {
        if (gameState.health > 0 && gameState.stability > 0) {
             if (gameState.currentBeat !== 14) { // Specific check for placeholder end beat
                const endMessage = document.createElement('p');
                endMessage.innerHTML = "<i>The signal fades... for now.</i>";
                endMessage.style.marginTop = '15px';
                choicesContainer.appendChild(endMessage);

                const restartBtn = document.createElement('button');
                restartBtn.textContent = "Restart Transmission";
                restartBtn.classList.add('choice');
                restartBtn.addEventListener('click', restartGame);
                choicesContainer.appendChild(restartBtn);
             } else { // Handle placeholder end beat explicitly
                  const devNote = document.createElement('p');
                  const beat = storyBeats.find(b => b.id === gameState.currentBeat);
                  devNote.innerHTML = beat ? beat.text : "End of current content."; // Display placeholder text
                   choicesContainer.appendChild(devNote);
                  const restartBtn = document.createElement('button');
                  restartBtn.textContent = "Restart Transmission";
                  restartBtn.classList.add('choice');
                  restartBtn.addEventListener('click', restartGame);
                  choicesContainer.appendChild(restartBtn);
             }
        }
        return;
    }

    let displayedChoiceCount = 0;
    choices.forEach((choice) => {
        let showChoice = true;
        if (choice.condition) {
            try {
                showChoice = choice.condition();
            } catch (e) {
                console.error(`Error evaluating condition for choice "${choice.text}":`, e);
                showChoice = false;
            }
        }

        if (showChoice) {
            displayedChoiceCount++;
            const choiceButton = document.createElement('button');
            choiceButton.classList.add('choice');

            let choiceText = choice.text;
            const predictedChanges = predictStatChanges(choice.effect);
            if (predictedChanges.length > 0) {
                choiceText += ` (${predictedChanges.join(', ')})`;
            }

            choiceButton.innerHTML = choiceText;
            choiceButton.setAttribute('data-number', displayedChoiceCount);

            choiceButton.addEventListener('click', () => makeChoice(choice));

            choicesContainer.appendChild(choiceButton);
        }
    });

     // If there were choices defined but none were displayable due to conditions
     if (displayedChoiceCount === 0 && choices.length > 0) {
         const noValidChoiceMessage = document.createElement('p');
         noValidChoiceMessage.innerHTML = "<i>There seems to be nothing more you can do here right now...</i>";
         noValidChoiceMessage.style.marginTop = '15px';
         choicesContainer.appendChild(noValidChoiceMessage);

         const restartBtn = document.createElement('button');
         restartBtn.textContent = "Restart Transmission";
         restartBtn.classList.add('choice');
         restartBtn.addEventListener('click', restartGame);
         choicesContainer.appendChild(restartBtn);
     }
}


function predictStatChanges(effectFunction) {
    if (!effectFunction) return [];

    const changes = [];
    // Temporary function to capture calls within the effect's scope
    const predictAdjustStat = (stat, amount) => {
        if (stat === 'health' || stat === 'stamina' || stat === 'stability') {
            if (amount !== 0) {
                 changes.push(`${amount > 0 ? '+' : ''}${amount} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`);
            }
        }
        // Don't actually change gameState here
    };

    // More robust simulation: Define local mocks for game state manipulation functions
    try {
        // Create a string representation of the effect function's body
        let effectString = effectFunction.toString();
        // Find the function body (between first { and last })
        const bodyMatch = effectString.match(/\{([\s\S]*)\}/);
        if (bodyMatch && bodyMatch[1]) {
            let effectBody = bodyMatch[1];

            // Replace calls to actual functions with calls to predictive mocks
            effectBody = effectBody.replace(/adjustStat\(/g, 'predictAdjustStat(');
            // Ignore inventory changes
            effectBody = effectBody.replace(/addToInventory\(.*?\);?/g, '');
            // Ignore flag changes
            effectBody = effectBody.replace(/gameState\.flags\.\w+\s*=\s*.*?;?/g, '');
            // Ignore score changes
            effectBody = effectBody.replace(/gameState\.scores\.\w+\s*[+\-*/%]=\s*.*?;?/g, '');


             // Create and run the simulated function
            const simulatedEffect = new Function('predictAdjustStat', 'gameState', effectBody);
             // Pass the predictive function and a *copy* of relevant gameState parts if needed, but often not necessary if logic only calls predictAdjustStat
            simulatedEffect(predictAdjustStat, {}); // Pass empty object or clone if absolutely needed

        } else {
             console.warn("Could not parse effect function body for prediction:", effectString);
        }

    } catch (e) {
        console.error("Error predicting stat changes:", e, "Function:", effectFunction.toString());
    }

    return changes;
}


function makeChoice(choice) {
    clearTimeout(typingTimeout);

    console.log(`Chose: "${choice.text}" | Attempting effect...`);
    if (choice.effect) {
        try {
            choice.effect();
            console.log("Effect applied successfully.");
        } catch (e) {
            console.error("Error executing choice effect:", e);
        }
    } else {
        console.log("Choice has no effect function.");
    }

    updateStatsDisplay(); // Update display after effect runs

    // Check game over conditions AFTER applying effects
    if (gameState.health <= 0) {
        gameOver("Physical trauma overwhelmed your system.");
        return; // Stop further processing
    }
    if (gameState.stability <= 0) {
        gameOver("Your mind fractured under the strain. The Broadcast claims you.");
        return; // Stop further processing
    }

    // Proceed to the next beat or handle end of path
    if (choice.nextBeat === 0) { // Explicit restart check
        console.log("Choice leads to restart.");
        // The restart effect should handle the screen transition
    } else if (choice.nextBeat !== undefined && choice.nextBeat !== null) {
        console.log(`Proceeding to beat ${choice.nextBeat}`);
        // Use setTimeout to allow current JS execution stack to clear before potentially heavy text rendering
        setTimeout(() => {
            displayBeat(choice.nextBeat);
        }, 50); // Small delay
    } else {
        console.log("Choice leads to no defined next beat (end of path?).");
        // Display an end-of-path message or standard restart options if needed
        displayChoices([]); // This will now trigger the end-of-content/restart logic inside displayChoices
    }
}


function startGame() {
    console.log("--- Starting New Game ---");
    titleScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    inventoryScreen.style.display = 'none'; // Ensure closed
    itemDescriptionBox.style.display = 'none'; // Ensure closed

    // Deep copy initial state to prevent mutation issues on restart
    gameState = JSON.parse(JSON.stringify(initialGameState));

    updateStatsDisplay();
    displayInventory(); // Pre-populate inventory view logic if needed, even if hidden
    displayBeat(1); // Start at the first beat
}

function restartGame() {
     console.log("--- Restarting Game ---");
     clearTimeout(typingTimeout); // Stop any ongoing text typing
     // Clear dynamic content
     storyText.innerHTML = '';
     choicesContainer.innerHTML = '';
     // Hide overlay screens
     inventoryScreen.style.display = 'none';
     itemDescriptionBox.style.display = 'none';
     // Hide game screen, show title
     gameScreen.style.display = 'none';
     titleScreen.style.display = 'flex';
     // gameState will be reset when startGame is called next
}

// --- Event Listeners ---

startButton.addEventListener('click', startGame);

inventoryButton.addEventListener('click', () => {
    if (itemDescriptionBox.style.display === 'flex') return; // Don't open if item description is shown
    displayInventory(); // Update inventory display every time it's opened
    inventoryScreen.style.display = 'flex';
});

closeInventoryButton.addEventListener('click', () => {
    inventoryScreen.style.display = 'none';
});

closeDescriptionButton.addEventListener('click', () => {
    itemDescriptionBox.style.display = 'none';
});

restartButton.addEventListener('click', restartGame);

// Keyboard listener for shortcuts
window.addEventListener('keydown', (e) => {
    // Prioritize closing modals with Escape
    if (itemDescriptionBox.style.display === 'flex') {
        if (e.key === 'Escape') {
            e.preventDefault(); // Prevent other Escape actions
            closeDescriptionButton.click();
        }
        return; // Don't process other keys if modal is open
    }

    if (inventoryScreen.style.display === 'flex') {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'i') {
             e.preventDefault(); // Prevent other Escape/i actions
             closeInventoryButton.click();
        }
        return; // Don't process other keys if modal is open
    }

    // Handle game screen keys only if it's active and no modals are open
    if (gameScreen.style.display === 'flex') {
        const keyNum = parseInt(e.key);
        // Check for number keys 1-9 to trigger choices
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
             e.preventDefault(); // Prevent browser find shortcut (often Ctrl+1..9) or other defaults
            const choices = choicesContainer.querySelectorAll('.choice');
            // Find button whose data-number matches the pressed key
            const targetChoice = Array.from(choices).find(button => parseInt(button.getAttribute('data-number')) === keyNum);
            if (targetChoice) {
                targetChoice.click(); // Simulate click
            }
        }
        // Toggle inventory with 'i'
        else if (e.key.toLowerCase() === 'i') {
            e.preventDefault(); // Prevent inserting 'i' if focus is somehow in a text field
            inventoryButton.click();
        }
         // Potentially add Escape key listener for pausing or options menu later
         // else if (e.key === 'Escape') {
         //    // e.preventDefault(); // Optional: prevent default escape behavior if needed
         // }
    }
});


window.addEventListener('load', () => {
    console.log("Window loaded. Game ready.");
    // Any initial setup that needs the DOM fully loaded can go here
});