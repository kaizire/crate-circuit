import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image

PPTX = Path(r"C:\Users\Edu Gajeto\Documents\PART OF THE COMPUTER HARDWARE ERROL JOHN.pptx")
OUT = Path(r"C:\Users\Edu Gajeto\crate-circuit\images")
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
OUT.mkdir(exist_ok=True)

NAMES = {
    2: "System Case",
    3: "CPU",
    4: "CPU Socket",
    5: "Motherboard",
    6: "RAM",
    7: "RAM Slot",
    8: "Power Supply",
    9: "Hard Disk Drive",
    10: "SATA Cable",
    11: "CD-ROM",
    12: "Heat Sink",
    13: "Peripheral Connectors",
    14: "IDE Cable",
    15: "IDE Port",
    16: "Sound Card",
    17: "LAN Card",
    18: "LAN Port",
    19: "PS/2 Ports",
    20: "VGA Port",
    21: "Graphics Card",
    22: "CMOS Battery",
    23: "North Bridge",
    24: "South Bridge",
    25: "SSD",
    26: "Cooling Fan",
    27: "USB Port",
    28: "HDMI Port",
    29: "Expansion Slot",
    30: "BIOS Chip",
    31: "Thermal Paste",
    32: "ATX Power Connector",
    33: "Front Panel Connectors",
    34: "Drive Bay",
    35: "I/O Shield",
    36: "Jumpers",
    37: "Standoffs",
    38: "Internal Speaker",
    39: "Cache Memory",
    40: "ROM",
    41: "SATA Power Cable",
    42: "Floppy Disk Drive",
    43: "DisplayPort",
    44: "CPU Fan",
    45: "PCI Slot",
    46: "AGP Slot",
    47: "SATA Port",
    48: "DVD Drive",
    49: "NVMe SSD",
    50: "Modem Card",
    51: "Power Button",
    52: "Front USB Ports",
    53: "Molex Connector",
    54: "PCIe Power Plug",
    55: "Audio Jacks",
    56: "Serial Port",
    57: "DVI Port",
    58: "eSATA Port",
    59: "FireWire Port",
    60: "Slot Bracket",
}

PROMPTS = {
    "PCI Slot": "In this picture, what are the long white slots called?",
    "AGP Slot": "In this picture, what is the brown slot above the white slots called?",
}


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def clean_why(chunks, name):
    text = " ".join(chunks)
    for label in ("System Case/Chassis", "MOTHERBOARD", "Audio/Sound Card", "PS/2 Mouse and Keyboard", name):
        text = re.sub(re.escape(label), "", text, count=1, flags=re.I)
    text = text.replace("C onnects", "Connects")
    text = re.sub(r"\s+", " ", text).strip(" ./")
    if not text:
        return name + " is a part of the system unit."
    text = text[0].upper() + text[1:]
    if text.startswith("Is "):
        text = f"The {name} is " + text[3:]
    elif re.match(r"^(Houses|Holds|Connects|Reads|Remove|Processes|Provides|Allows|Transmits) ", text):
        text = "It " + text[0].lower() + text[1:]
        text = text.replace("It remove ", "It removes ", 1)
    if not text.endswith("."):
        text += "."
    return text


def save_image(blob, dest):
    from io import BytesIO

    image = Image.open(BytesIO(blob))
    image.seek(0)
    if image.mode in ("RGBA", "LA", "P"):
        rgba = image.convert("RGBA")
        base = Image.new("RGB", rgba.size, (255, 255, 255))
        base.paste(rgba, mask=rgba.getchannel("A"))
        image = base
    else:
        image = image.convert("RGB")
    image.thumbnail((900, 640))
    image.save(dest, "JPEG", quality=82, optimize=True)


def main():
    z = zipfile.ZipFile(PPTX)
    items = []
    for number, name in NAMES.items():
        rel = ET.fromstring(z.read(f"ppt/slides/_rels/slide{number}.xml.rels"))
        target = None
        for node in rel:
            href = node.get("Target", "")
            if node.get("Type", "").endswith("/image") and not href.endswith("image1.jpeg"):
                target = "ppt/" + href.replace("../", "")
                break
        slide = ET.fromstring(z.read(f"ppt/slides/slide{number}.xml"))
        chunks = [t.text.strip() for t in slide.findall(".//" + A + "t") if t.text and t.text.strip()]
        filename = slug(name) + ".jpg"
        save_image(z.read(target), OUT / filename)
        items.append({
            "part": name,
            "image": "images/" + filename,
            "q": PROMPTS.get(name, "Which part of the system unit is shown in the picture?"),
            "why": clean_why(chunks, name),
        })

    extras = [
        ("Capacitors", Path(r"C:\Users\Edu Gajeto\AppData\Local\Temp\ppt-part-images\capacitors.jpg"),
         "Which parts are the cylinder components that smooth electricity on the motherboard and inside the power supply?",
         "Capacitors store and smooth electricity so the other parts get steady power. On a motherboard they are the small cylinder parts near the CPU and slots."),
        ("Berg Connector", Path(r"C:\Users\Edu Gajeto\AppData\Local\Temp\ppt-part-images\berg.jpg"),
         "Which small 4-pin plug in this picture supplies power to a floppy disk drive?",
         "A Berg connector is the small 4-pin power plug for a floppy disk drive."),
        ("Floppy Cable", Path(r"C:\Users\Edu Gajeto\AppData\Local\Temp\ppt-part-images\floppy_cable.jpg"),
         "Which cable is this ribbon that connects a floppy disk drive to the motherboard?",
         "A floppy ribbon cable carries data between the floppy disk drive and the motherboard."),
        ("Parallel Port", Path(r"C:\Users\Edu Gajeto\AppData\Local\Temp\ppt-part-images\parallel_port.jpg"),
         "Which older printer port uses the wide plug shown in the picture?",
         "A parallel port, also called an LPT port, was used mainly to connect a printer. The computer side uses a 25-pin plug."),
        ("PSU Switch", Path(r"C:\Users\Edu Gajeto\AppData\Local\Temp\ppt-part-images\atx_psu.jpg"),
         "What is the rocker switch on the back of this power supply called?",
         "The PSU switch turns electricity from the wall outlet on or off before it enters the system unit."),
    ]
    for name, src, prompt, why in extras:
        filename = slug(name) + ".jpg"
        save_image(src.read_bytes(), OUT / filename)
        items.append({"part": name, "image": "images/" + filename, "q": prompt, "why": why})

    names = [item["part"] for item in items]
    questions = []
    for index, item in enumerate(items):
        choices = [item["part"]]
        step = 1
        while len(choices) < 4:
            other = names[(index + step) % len(names)]
            step += 1
            if other not in choices:
                choices.append(other)
        questions.append({
            "q": item["q"],
            "image": item["image"],
            "choices": choices,
            "answer": item["part"],
            "why": item["why"],
        })

    body = "const QUESTIONS = " + json.dumps(questions, indent=2, ensure_ascii=False) + ";\n"
    Path(r"C:\Users\Edu Gajeto\crate-circuit\questions.js").write_text(body, encoding="utf-8")
    print("questions", len(questions))
    print("images", len(list(OUT.glob("*.jpg"))))


if __name__ == "__main__":
    main()
