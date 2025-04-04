# Install Pillow: pip install Pillow
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import random
import textwrap
import math

# --- Configuration ---
PAGE_WIDTH = 1700  # Approx A4 ratio (pixels)
PAGE_HEIGHT = 2200
MARGIN_LEFT = 150
MARGIN_RIGHT = 150
MARGIN_TOP = 100
MARGIN_BOTTOM = 150
TEXT_AREA_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT

OUTPUT_DIR = "PROJECT_AMBER_DOCS"

# --- Fonts ---
# Try to load specific fonts, fall back to common ones
try:
    # A typewriter-like font (e.g., Courier New, Lucida Console)
    FONT_BODY_PATH = "cour.ttf" # Courier New often available
    FONT_BODY_SIZE = 38
    FONT_BODY = ImageFont.truetype(FONT_BODY_PATH, FONT_BODY_SIZE)
except IOError:
    print(f"Warning: Font '{FONT_BODY_PATH}' not found. Using PIL default.")
    FONT_BODY_SIZE = 38
    FONT_BODY = ImageFont.load_default()

try:
    # A bolder font for headers (e.g., Arial Bold, Impact)
    FONT_HEADER_PATH = "arialbd.ttf" # Arial Bold often available
    FONT_HEADER_SIZE = 48
    FONT_HEADER_BOLD = ImageFont.truetype(FONT_HEADER_PATH, FONT_HEADER_SIZE)
    FONT_HEADER_REGULAR = ImageFont.truetype("arial.ttf", FONT_HEADER_SIZE) # Regular for comparison
    FONT_STAMP = ImageFont.truetype(FONT_HEADER_PATH, 70)
    FONT_CLASSIFICATION = ImageFont.truetype(FONT_HEADER_PATH, 40)
except IOError:
    print(f"Warning: Font '{FONT_HEADER_PATH}' not found. Using PIL default for headers.")
    FONT_HEADER_SIZE = 48
    FONT_HEADER_BOLD = ImageFont.load_default()
    FONT_HEADER_REGULAR = ImageFont.load_default()
    FONT_STAMP = ImageFont.load_default()
    FONT_CLASSIFICATION = ImageFont.load_default()

try:
    # A simple handwriting font (e.g., Comic Sans MS - ironically fitting sometimes, or find a free one)
    FONT_HANDWRITING_PATH = "comic.ttf" # Or use a better free handwriting font TTF
    FONT_HANDWRITING_SIZE = 36
    FONT_HANDWRITING = ImageFont.truetype(FONT_HANDWRITING_PATH, FONT_HANDWRITING_SIZE)
except IOError:
    print(f"Warning: Font '{FONT_HANDWRITING_PATH}' not found. Using PIL default for handwriting.")
    FONT_HANDWRITING_SIZE = 36
    FONT_HANDWRITING = ImageFont.load_default()


# --- Colors ---
COLOR_BACKGROUND = (245, 240, 220) # Aged paper yellow-ish white
COLOR_TEXT = (20, 20, 20) # Dark grey/black
COLOR_RED = (180, 0, 0)
COLOR_REDACTED = (0, 0, 0)
COLOR_STAMP = (0, 50, 150, 180) # Semi-transparent blue
COLOR_STAMP_RED = (180, 0, 0, 180) # Semi-transparent red
COLOR_HANDWRITING = (50, 50, 150) # Faded blue ink

# --- Helper Functions ---

def add_noise(image, amount=0.03):
    """Adds subtle grayscale noise to the image."""
    width, height = image.size
    noise = Image.effect_noise((width, height), amount * 255) # Scale amount
    noise = noise.convert("L").convert("RGB") # Convert noise to RGB
    noisy_image = Image.blend(image.convert("RGB"), noise, alpha=amount / 2) # Blend subtly
    return noisy_image

def add_aging(image, intensity=0.15):
    """Apply a yellowish tint for aging."""
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(1.0 - intensity) # Reduce color saturation slightly
    # Apply yellow overlay
    yellow = Image.new('RGB', image.size, (255, 250, 200))
    image = Image.blend(image, yellow, alpha=intensity * 0.5)
    return image

def draw_wrapped_text(draw, text, y_pos, font, color, max_width, line_spacing=1.4):
    """Draws text, wrapping it within the max_width."""
    lines = textwrap.wrap(text, width=int(max_width / (font.size * 0.55))) # Estimate wrap width
    line_height = font.getbbox("Ay")[3] * line_spacing # Height based on font + spacing
    for line in lines:
        try:
            # Use getbbox for better positioning with different fonts
            bbox = font.getbbox(line)
            text_width = bbox[2] - bbox[0]
            draw.text((MARGIN_LEFT, y_pos), line, font=font, fill=color)
        except AttributeError: # Fallback for default font
             text_width = draw.textlength(line, font=font)
             draw.text((MARGIN_LEFT, y_pos), line, font=font, fill=color)
        y_pos += line_height
    return y_pos

def draw_redaction(draw, x, y, width, height, bleed=0.05):
    """Draws a black redaction box with optional text bleed."""
    draw.rectangle([x, y, x + width, y + height], fill=COLOR_REDACTED)
    # Optional: Add subtle grey character bleed around edges
    if bleed > 0 and random.random() < 0.5: # Only sometimes add bleed
        bleed_chars = "".join(random.choices("█▓▒░abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=int(width/15)))
        bleed_color = (80, 80, 80, 90) # Very faint grey
        try:
            bleed_font = ImageFont.truetype(FONT_BODY_PATH, int(FONT_BODY_SIZE * 0.8))
            # Draw slightly offset bleed text
            draw.text((x - random.randint(0,5), y + random.randint(-2,2)), bleed_chars, font=bleed_font, fill=bleed_color)
            draw.text((x + width - bleed_font.getlength(bleed_chars) + random.randint(0,5), y + height - bleed_font.size + random.randint(-2,2)), bleed_chars[::-1], font=bleed_font, fill=bleed_color)
        except Exception:
             pass # Ignore if bleed font fails


def draw_stamp(image, text, x, y, color, font, angle):
    """Draws rotated text stamp."""
    txt_layer = Image.new('RGBA', (font.getlength(text) + 20, font.size + 20), (0,0,0,0))
    draw_txt = ImageDraw.Draw(txt_layer)
    draw_txt.text((10, 10), text, font=font, fill=color)

    rotated_txt = txt_layer.rotate(angle, expand=True, fillcolor=(0,0,0,0))
    image.paste(rotated_txt, (x - rotated_txt.width // 2, y - rotated_txt.height // 2), rotated_txt)

def add_classification_header_footer(draw, page_num):
    """Adds TOP SECRET markings."""
    header_text = "TOP SECRET // SRF EYES ONLY // AMBER"
    footer_text = "TOP SECRET // SRF EYES ONLY // AMBER"
    page_text = f"Page {page_num} of 10"

    header_bbox = FONT_CLASSIFICATION.getbbox(header_text)
    footer_bbox = FONT_CLASSIFICATION.getbbox(footer_text)
    page_bbox = FONT_CLASSIFICATION.getbbox(page_text)

    header_width = header_bbox[2] - header_bbox[0]
    footer_width = footer_bbox[2] - footer_bbox[0]
    page_width = page_bbox[2] - page_bbox[0]

    # Header - Centered
    draw.text(((PAGE_WIDTH - header_width) / 2, MARGIN_TOP / 2.5), header_text, font=FONT_CLASSIFICATION, fill=COLOR_RED)
    draw.line([(MARGIN_LEFT / 2, MARGIN_TOP - 10), (PAGE_WIDTH - MARGIN_RIGHT / 2, MARGIN_TOP - 10)], fill=COLOR_RED, width=3)

    # Footer - Centered Text, Page Number Right
    draw.text(((PAGE_WIDTH - footer_width) / 2, PAGE_HEIGHT - MARGIN_BOTTOM / 1.5), footer_text, font=FONT_CLASSIFICATION, fill=COLOR_RED)
    draw.text((PAGE_WIDTH - MARGIN_RIGHT - page_width, PAGE_HEIGHT - MARGIN_BOTTOM / 1.5), page_text, font=FONT_CLASSIFICATION, fill=COLOR_RED)
    draw.line([(MARGIN_LEFT / 2, PAGE_HEIGHT - MARGIN_BOTTOM + 10), (PAGE_WIDTH - MARGIN_RIGHT / 2, PAGE_HEIGHT - MARGIN_BOTTOM + 10)], fill=COLOR_RED, width=3)

def create_document_page(page_num, content_func):
    """Creates a single page image."""
    img = Image.new('RGB', (PAGE_WIDTH, PAGE_HEIGHT), COLOR_BACKGROUND)
    draw = ImageDraw.Draw(img)

    add_classification_header_footer(draw, page_num)

    current_y = MARGIN_TOP + 50 # Start content below header line

    # Call the function specific to this page's content
    content_func(img, draw, current_y) # Add 'img' as the first argument

    # --- Post Processing ---
    # Apply effects randomly or based on page content needs
    if random.random() < 0.7: # High chance of aging
        img = add_aging(img, intensity=random.uniform(0.05, 0.2))
    if random.random() < 0.5: # Medium chance of noise
        img = add_noise(img, amount=random.uniform(0.01, 0.04))

    # Example: Add a random coffee stain overlay (if you have stain images)
    # if random.random() < 0.2 and os.path.exists("coffee_stain.png"):
    #     try:
    #         stain = Image.open("coffee_stain.png").convert("RGBA")
    #         stain_size = random.randint(200, 500)
    #         stain = stain.resize((stain_size, stain_size))
    #         stain = stain.rotate(random.randint(0, 360), expand=True)
    #         stain_x = random.randint(0, PAGE_WIDTH - stain.width)
    #         stain_y = random.randint(0, PAGE_HEIGHT - stain.height)
    #         img.paste(stain, (stain_x, stain_y), stain)
    #     except Exception as e:
    #         print(f"Could not apply stain: {e}")

    # Slight blur sometimes
    if random.random() < 0.05:
         img = img.filter(ImageFilter.GaussianBlur(radius=0.5))

    # Save the image
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    img_path = os.path.join(OUTPUT_DIR, f"project_amber_p{page_num}.png")
    img.save(img_path)
    print(f"Saved: {img_path}")

# --- Page Content Functions ---

def page_1_content(img, draw, current_y): # Add 'img' here
    title = "PROJECT AMBER: ANOMALY-01 RESONANCE ANALYSIS"
    subtitle = "INITIAL ASSESSMENT & DATA OVERVIEW"
    bbox_title = FONT_HEADER_BOLD.getbbox(title)
    bbox_subtitle = FONT_HEADER_REGULAR.getbbox(subtitle)
    draw.text(((PAGE_WIDTH - (bbox_title[2]-bbox_title[0])) / 2, current_y), title, font=FONT_HEADER_BOLD, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.5
    draw.text(((PAGE_WIDTH - (bbox_subtitle[2]-bbox_subtitle[0])) / 2, current_y), subtitle, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 2.5

    current_y = draw_wrapped_text(draw, "PROJECT CODE: SRF-AMB-01", current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y = draw_wrapped_text(draw, "DATE RANGE: 1994.01.15 - 1994.02.28 (Initial Phase)", current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y = draw_wrapped_text(draw, "LEAD INVESTIGATOR: Dr. Lena Harmon (SRF-002)", current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y = draw_wrapped_text(draw, "CLEARANCE: LEVEL 4 (AMBER EYES ONLY)", current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE
    current_y = draw_wrapped_text(draw, "DISTRIBUTION: DIR. INGRAM (SRF-001), [REDACTED], AMBER TEAM", current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("DISTRIBUTION: DIR. INGRAM (SRF-001), "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED]"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE * 1.5

    current_y = draw_wrapped_text(draw, "ABSTRACT:", current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE * 0.5
    abstract_text = ("Project AMBER initiated following the discovery of ANOMALY-01 (Ref: INC#1994-01) to map and analyze the complex resonance patterns emitted by the crystalline structure found in Shaft 7-B. Initial data indicates a highly complex, potentially non-linear signal exhibiting anomalous interactions with standard sensor equipment and potentially correlating with observed environmental and psycho-cognitive phenomena. The resonance profile appears dynamic and may possess properties beyond current theoretical models. Further analysis is critical but hampered by signal instability and [REDACTED]. Hazard potential assessed as HIGH.")
    current_y = draw_wrapped_text(draw, abstract_text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("instability and "), current_y - FONT_BODY_SIZE*2.5 , FONT_BODY.getlength("[REDACTED]"), FONT_BODY_SIZE*1.1)

    # Add Stamp
    draw_stamp(img, "SRF CLASSIFIED", PAGE_WIDTH - MARGIN_RIGHT - 200, PAGE_HEIGHT - MARGIN_BOTTOM - 250, COLOR_STAMP_RED, FONT_STAMP, -25)


def page_2_content(img, draw, current_y): # Add 'img' here
    title = "1. INTRODUCTION & MANDATE"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Following the initial encounter with ANOMALY-01 by Drs. Harmon and Reyes on 1994.01.15 (Ref: INC#1994-01), Project AMBER was formally established under Directive SRF-DIR-94-003. The primary mandate is the comprehensive mapping, analysis, and characterization of the unique resonance signature emanating from ANOMALY-01 and associated geological formations within Shaft 7-B.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Key objectives include:\n"
            "- Identification of baseline frequencies and harmonic structures.\n"
            "- Analysis of signal complexity, modulation, and potential information encoding.\n"
            "- Correlation of resonance patterns with environmental factors (seismic, electromagnetic, [REDACTED]).\n"
            "- Assessment of passive resonance effects on SRF equipment and personnel.\n"
            "- Development of predictive models for resonance behaviour (if feasible).")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("- Correlation of resonance patterns with environmental factors (seismic, electromagnetic, "), current_y - FONT_BODY_SIZE*3.9 , FONT_BODY.getlength("[REDACTED]"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Initial reconnaissance (INC#1994-01) highlighted significant challenges, including sensor malfunction, localized temporal flux sensations reported by SRF-004 (Reyes), and extreme signal interference across multiple spectra. Standard geological survey equipment proved inadequate or unreliable in close proximity to ANOMALY-01.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)

    # Add handwriting
    draw.text((PAGE_WIDTH - MARGIN_RIGHT - 450, current_y + 50), "Reyes' initial report\n is key here - the subjective\n effects can't be ignored.\n - LH", font=FONT_HANDWRITING, fill=COLOR_HANDWRITING)

def page_3_content(img, draw, current_y): # Add 'img' here
    title = "2. METHODOLOGY"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("A multi-spectrum sensor suite was deployed in and around Shaft 7-B, focusing on non-invasive, remote monitoring where possible due to initial contact hazards. Key instrumentation includes:")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE * 0.5

    text = ("- Wide-band Resonance Spectrometers (Modified Cryo-cooled Array)\n"
            "- High-sensitivity Geophones and Seismic Accelerometers\n"
            "- Full Spectrum EM Detectors (RF to Gamma Ray)\n"
            "- [REDACTED] Probes (Model SRF-Psi-7)\n"
            "- Chronometric Anomaly Detectors (CAD Array - Delta Configuration)\n"
            "- Environmental Sensors (Temp, Pressure, Radiation [Alpha, Beta, Gamma, Neutron])")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("- "), current_y - FONT_BODY_SIZE*3.9 , FONT_BODY.getlength("[REDACTED] Probes (Model SRF-Psi-7)"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Data is logged continuously via shielded fiber optic lines to the Geology Lab (SRF-GL-01) for primary analysis. Cross-correlation algorithms are used to identify relationships between resonance patterns and other sensor readings. Sensor calibration is performed remotely every [REDACTED] hours, though anomalous readings frequently necessitate manual recalibration or sensor resets.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("remotely every "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED]"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Significant data loss and corruption were noted from proximal sensors during high-energy resonance events or periods of increased fluctuation, particularly affecting the [REDACTED] probes and standard EM detectors. Data integrity verification protocols are continuously running.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("particularly affecting the "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED] probes"), FONT_BODY_SIZE*1.1)

def page_4_content(img, draw, current_y): # Add 'img' here
    title = "3. INITIAL FINDINGS (Phase 1: 1994.01.15 - 1994.01.31)"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Initial resonance analysis identified a primary carrier frequency fluctuating around ~143.46 Hz, consistent with preliminary readings from EVD-01A (Anomaly Fragment). However, this carrier is heavily modulated by a complex, dynamic pattern of sub-harmonics and overtones spanning a wide spectrum ([REDACTED] MHz range observed).")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("spanning a wide spectrum ("), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED] MHz range observed"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("The pattern exhibits characteristics inconsistent with known natural geological phenomena. It displays features suggestive of high-order complexity, possibly fractal structures in the frequency domain, and periods of seemingly quasi-periodic behavior interspersed with chaotic fluctuations. No simple repeating motif has been isolated.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Early correlations (Confidence Level: LOW) suggest potential links between specific resonance modes and minor environmental shifts (e.g., temperature fluctuations near Shaft 7-B entrance, micro-seismic tremors). Further data required for confirmation.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Auditory phenomena reported during INC#1994-01 ('inhuman singing', 'geometric whispers' - Reyes, M.) align temporally with specific high-amplitude, complex waveform bursts recorded by the resonance spectrometers. This suggests a direct psycho-acoustic interaction, though the mechanism remains unknown. Possible [REDACTED] effect.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("Possible "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED] effect"), FONT_BODY_SIZE*1.1)

    # Add Stamp
    draw_stamp(img, "PRELIMINARY DATA", MARGIN_LEFT + 200, PAGE_HEIGHT - MARGIN_BOTTOM - 200, COLOR_STAMP, FONT_STAMP, 15)

def page_5_content(img, draw, current_y): # Add 'img' here
    title = "4. RESONANCE & COGNITIVE EFFECTS (Ref: INC#1994-02)"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Analysis of data coinciding with Incident #1994-02 (Widespread Sensory/Psychological Disturbance) reveals strong temporal correlations between specific low-frequency resonance patterns (< 50 Hz range, often below audible threshold) and the onset/intensity of reported phenomena.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Specifically, a pervasive low-frequency 'hum' (~25-35 Hz range) consistently matches periods of increased reports of nightmares, paranoia, and derealization across facility personnel (See Psych Profile Composite EVD-05). Amplitude spikes in this range often precede clusters of acute symptom reporting.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Furthermore, specific complex harmonic clusters, particularly those involving [REDACTED] phase relationships, appear linked to the content of reported hallucinations (e.g., 'impossible geometries', 'entities of shifting angles'). This suggests the resonance may not only induce effects but actively transmit hazardous memetic or informational content.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("particularly those involving "), current_y - FONT_BODY_SIZE*2.8 , FONT_BODY.getlength("[REDACTED] phase relationships"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("The causal relationship remains ambiguous. Is the resonance directly influencing cognition, or is it reacting to the collective psychological state of the facility personnel? Dr. Miller (SRF-003) has noted extreme sensitivity and theorizes a potential feedback loop, but Project AMBER's mandate is limited to passive observation and analysis, not active experimentation (Ref: Project QUARTZ).")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)

    # Add handwriting
    draw.text((MARGIN_LEFT + 50, current_y + 60), "Is it reading us?\nThe patterns seem to\nshift *before* psych reports peak sometimes.\nCorrelation =/= Causation, but...\nthis feels different.\n- LH", font=FONT_HANDWRITING, fill=COLOR_HANDWRITING)


def page_6_content(img, draw, current_y): # Add 'img' here
    title = "5. ANALYSIS: POST-INCIDENT #1994-04"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Incident #1994-04 (Unauthorized Resonance Test - Miller, S.) on 1994.02.20 resulted in a significant and permanent alteration to the ANOMALY-01 resonance baseline. Sensor logs (Ref: EVD-06) confirm the absorption of Miller's unauthorized 8.1 Hz ping, followed by localized temporal/spatial distortion.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Post-incident analysis by Project AMBER confirms the primary carrier frequency shifted upwards by approximately +0.02 Hz to a new baseline fluctuating around ~143.48 Hz. More significantly, the complexity and amplitude of harmonic/sub-harmonic modulations increased dramatically.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("The resonance pattern now exhibits significantly more chaotic behavior, with longer periods of high-amplitude, broadband noise-like signals. The previously observed quasi-periodic structures are less frequent and more unstable. Overall 'signal energy' output has increased by approx. [REDACTED]%.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("increased by approx. "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED]%"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Subjectively, the character of the resonance feels more 'aggressive' or 'agitated' based on waveform analysis and correlation with subsequent (though difficult to quantify) increases in equipment malfunction rates and reported personnel unease. Miller's attempt at 'communication' or 'harmonization' appears to have provoked ANOMALY-01, fundamentally altering its behavior and increasing ambient hazard levels facility-wide.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Speculation (Harmon): Miller's signal may have provided [REDACTED] or acted as a catalyst, 'teaching' the anomaly or unlocking a more volatile operational state. Implications for Project QUARTZ's resonance manipulation goals are dire.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("provided "), current_y - FONT_BODY_SIZE*2.8 , FONT_BODY.getlength("[REDACTED] or acted as a catalyst, 'teaching' the anomaly"), FONT_BODY_SIZE*1.1)

    # Add Stamp
    draw_stamp(img, "REVISED FINDINGS", PAGE_WIDTH - MARGIN_RIGHT - 500, MARGIN_TOP + 100, COLOR_STAMP, FONT_STAMP, 5)

def page_7_content(img, draw, current_y): # Add 'img' here
    title = "6. DATA OVERLOAD & SIGNAL COMPLEXITY ESCALATION"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Following INC#1994-04, the volume and complexity of resonance data captured by Project AMBER sensors increased exponentially. Data rates from the primary spectrometers exceeded projected limits by over [REDACTED]%, overwhelming initial logging and analysis systems.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("limits by over "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED]%"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Standard spectral analysis techniques (FFT, Wavelet Transform) struggle to resolve meaningful patterns within the increasingly noise-dominated signal. Algorithms designed to detect repeating motifs or predictable structures are failing, indicating either extreme stochasticity or a level of complexity beyond their design parameters.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Preliminary attempts using [REDACTED] analysis suggest the post-INC#1994-04 resonance may exhibit properties of self-similarity across multiple time scales, indicative of complex chaotic dynamics or potentially information-rich fractal structures. However, processing power limitations hinder conclusive analysis.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("using "), current_y - FONT_BODY_SIZE*2.8 , FONT_BODY.getlength("[REDACTED] analysis"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE * 1.5

    # Simulate a crude graph sketch (redacted)
    graph_y = current_y
    draw.rectangle([MARGIN_LEFT + 50, graph_y, MARGIN_LEFT + 550, graph_y + 300], outline=COLOR_TEXT, width=2)
    draw.line([MARGIN_LEFT + 50, graph_y + 280, MARGIN_LEFT + 550, graph_y + 280], fill=COLOR_TEXT, width=2) # X-axis
    draw.line([MARGIN_LEFT + 70, graph_y, MARGIN_LEFT + 70, graph_y + 300], fill=COLOR_TEXT, width=2) # Y-axis
    draw.text((MARGIN_LEFT + 200, graph_y + 285), "Time (Post INC-04)", font=ImageFont.truetype(FONT_BODY_PATH, 24), fill=COLOR_TEXT)
    draw.text((MARGIN_LEFT + 75, graph_y + 10), "Signal Complexity", font=ImageFont.truetype(FONT_BODY_PATH, 24), fill=COLOR_TEXT)
    # Draw a simple exponential-looking curve
    points = []
    for i in range(10):
        px = MARGIN_LEFT + 80 + i * 45
        py = graph_y + 260 - int(math.exp(i * 0.5) * 5)
        points.append((px, py))
    draw.line(points, fill=COLOR_RED, width=3)
    draw_redaction(draw, MARGIN_LEFT + 50, graph_y, 500, 300, bleed=0) # Redact the whole graph area
    draw.text((MARGIN_LEFT + 150, graph_y + 130), "[REDACTED GRAPH DATA]", font=FONT_HEADER_REGULAR, fill=(200,200,200)) # Label redaction
    current_y += 350

    # Add handwriting
    draw.text((PAGE_WIDTH - MARGIN_RIGHT - 400, graph_y + 20), "Can't keep up.\nPatterns becoming\nself-aware?\nFeels like it.\n- LH", font=FONT_HANDWRITING, fill=COLOR_HANDWRITING, angle=-5)

def page_8_content(img, draw, current_y): # Add 'img' here
    title = "7. HAZARD ASSESSMENT UPDATE (1994.02.25)"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Based on the observed permanent alteration of the ANOMALY-01 resonance profile following INC#1994-04, the increased signal energy output, and the apparent correlation with escalating psychological disturbances (INC#1994-02), the ambient hazard level associated with Project AMBER's subject matter is upgraded to LEVEL 4 - SEVERE.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Specific concerns include:\n"
            "- Increased potential for acute psycho-cognitive effects from ambient resonance exposure, even outside Shaft 7-B immediate proximity.\n"
            "- Possible memetic transmission vector via the resonance itself, potentially capable of implanting complex data or inducing specific behavioral changes (Ref: EVD-05 recurring themes, Miller's fixation).\n"
            "- Unknown long-term effects of chronic exposure to the altered resonance profile.\n"
            "- Potential for the altered resonance to trigger unforeseen interactions with other facility systems or projects (e.g., Project OPAL bio-samples, [REDACTED]).")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("- Potential for the altered resonance to trigger unforeseen interactions with other facility systems or projects (e.g., Project OPAL bio-samples, "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED]"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Recommendations:\n"
            "1. Implement stricter access controls and exposure time limits for all personnel operating near Shaft 7-B.\n"
            "2. Enhance psycho-cognitive monitoring protocols for all facility staff (Ref: INC#1994-02 concerns).\n"
            "3. Investigate potential shielding methods against specific resonance frequencies identified as hazardous (feasibility uncertain).\n"
            "4. URGENT review of Project QUARTZ protocols in light of AMBER findings regarding resonance instability and reactivity. Proceeding with active manipulation attempts under current conditions is deemed EXTREMELY HIGH RISK.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)

    # Add stamp overlapping text/redaction slightly
    draw_stamp(img, "HAZARD LEVEL 4", MARGIN_LEFT + 50, current_y - 400, COLOR_STAMP_RED, FONT_STAMP, 10)


def page_9_content(draw, current_y):
    title = "8. PROJECT STATUS (As of 1994.03.10)"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    text = ("Project AMBER faces significant operational challenges due to escalating data volume and ambient resonance instability. Data analysis is currently backlogged by approximately [REDACTED] days due to processing limitations and the need for developing new analytical models capable of handling the signal complexity.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("approximately "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED] days"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE

    text = ("Increasing resonance interference is affecting instrumentation within the Geology Lab (SRF-GL-01), despite shielding upgrades. Intermittent communication failures with remote sensors in Shaft 7-B are becoming more frequent. Maintaining a clean baseline for analysis is proving increasingly difficult.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Dr. Harmon has formally logged concerns (Ref: Memo HAR-94-018) regarding the continuation of Project QUARTZ experiments under Dr. Miller. AMBER data strongly suggests ANOMALY-01 is in a highly reactive and unstable state following INC#1994-04. Further active resonance manipulation attempts carry an unacceptably high risk of catastrophic cascade failure, potentially exceeding current facility containment capabilities.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    current_y += FONT_BODY_SIZE

    text = ("Request submitted for additional computational resources and consultation with [REDACTED] Theoretical Division regarding non-linear dynamics and potential infohazard signal processing. Response pending.")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("consultation with "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED] Theoretical Division"), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE * 2

    # Add stamp
    draw_stamp(img, "URGENT REVIEW REQUIRED", PAGE_WIDTH - MARGIN_RIGHT - 300, current_y, COLOR_STAMP_RED, FONT_STAMP, -10)


def page_10_content(img, draw, current_y): # Add 'img' here
    title = "ADDENDUM: FRAGMENTARY NOTES (L. Harmon, SRF-GL-01, Date Uncertain)"
    bbox_title = FONT_HEADER_REGULAR.getbbox(title)
    draw.text((MARGIN_LEFT, current_y), title, font=FONT_HEADER_REGULAR, fill=COLOR_TEXT)
    current_y += FONT_HEADER_SIZE * 1.8

    # Simulate torn/damaged look - maybe draw fewer lines, add gaps
    text = ("...comms down again. Lab sealed since [DATE CORRUPT]. Resonance amplitude off the charts... feels like the whole structure is vibrating now. Can hear it in the walls...")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH * 0.9) # Slightly narrower text block
    current_y += FONT_BODY_SIZE * 1.5

    text = ("The patterns in the static... they're not random. Trying to map the frequency shift after Reyes' team went missing (INC-05). Did they hear it too? Did they [REDACTED]...")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH * 0.95)
    # Redaction over fragmented thought
    redaction_x = MARGIN_LEFT + FONT_BODY.getlength("Did they ")
    redaction_y = current_y - FONT_BODY_SIZE*1.4
    draw_redaction(draw, redaction_x, redaction_y, TEXT_AREA_WIDTH - redaction_x + MARGIN_LEFT - 50, FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE * 2.0 # Larger gap

    text = ("Miller... Quartz... triggered the cascade? Warnings ignored. Ingram [REDACTED ACTION]...")
    current_y = draw_wrapped_text(draw, text, current_y, FONT_BODY, COLOR_TEXT, TEXT_AREA_WIDTH * 0.8)
    draw_redaction(draw, MARGIN_LEFT + FONT_BODY.getlength("Ingram "), current_y - FONT_BODY_SIZE*1.4 , FONT_BODY.getlength("[REDACTED ACTION]..."), FONT_BODY_SIZE*1.1)
    current_y += FONT_BODY_SIZE * 1.5

    text = ("Sensors failing. Power fluctuations. The geometry... it's wrong outside the viewport... It's coming through the [DATA CORRUPT // LOG ENDS]")
    # End text abruptly
    wrapped_lines = textwrap.wrap(text, width=int((TEXT_AREA_WIDTH*0.7) / (FONT_BODY.size * 0.55)))
    line_height = FONT_BODY.getbbox("Ay")[3] * 1.4
    for i, line in enumerate(wrapped_lines):
         if i == len(wrapped_lines) -1: # Last line
              # Cut off last line partway
              cutoff = random.randint(10, len(line) - 15)
              line = line[:cutoff] + "..."
         draw.text((MARGIN_LEFT, current_y), line, font=FONT_BODY, fill=COLOR_TEXT)
         current_y += line_height
         if i > 0 and random.random() < 0.4: # Randomly skip drawing some lines
             current_y += line_height * random.choice([1, 1, 2]) # Add gaps

    # Add large CORRUPT stamp
    draw_stamp(img, "DATA CORRUPT", PAGE_WIDTH // 2, PAGE_HEIGHT // 2 + 100, COLOR_STAMP_RED, ImageFont.truetype(FONT_HEADER_PATH, 150), -35)
    # Add smaller stamp
    draw_stamp(img, "LOG FRAGMENT", PAGE_WIDTH - MARGIN_RIGHT - 250, PAGE_HEIGHT - MARGIN_BOTTOM - 200, COLOR_STAMP, FONT_STAMP, 5)

# --- Main Execution ---
page_functions = [
    page_1_content, page_2_content, page_3_content, page_4_content, page_5_content,
    page_6_content, page_7_content, page_8_content, page_9_content, page_10_content
]

for i, func in enumerate(page_functions):
    create_document_page(i + 1, func)

print(f"\nGenerated 10 pages in the '{OUTPUT_DIR}' directory.")
print("Ensure you have the necessary fonts (or adjust paths/fallback) and Pillow installed (`pip install Pillow`).")