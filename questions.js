const QUESTIONS = [
  {
    q: "Which part is called the brain of the computer?",
    choices: ["RAM", "CPU", "Power supply", "Hard disk drive"],
    answer: "CPU",
    why: "The CPU processes instructions, performs calculations, and controls the hardware."
  },
  {
    q: "Which part is the main circuit board that connects the CPU, memory, storage, and other parts?",
    choices: ["Motherboard", "System bus", "I/O shield", "Drive bay"],
    answer: "Motherboard",
    why: "The motherboard is the backbone of the system unit. The other parts plug into it and communicate through it."
  },
  {
    q: "Which memory holds the data and programs the computer is using right now?",
    choices: ["ROM", "Cache only", "RAM", "CMOS battery"],
    answer: "RAM",
    why: "RAM is temporary memory. The CPU can read it quickly, and its contents are lost when the power goes off."
  },
  {
    q: "What does the power supply do?",
    choices: [
      "It stores the operating system",
      "It converts AC from the wall into DC for the parts",
      "It renders images for the monitor",
      "It reads CDs and DVDs"
    ],
    answer: "It converts AC from the wall into DC for the parts",
    why: "The power supply changes household AC into the DC voltages the system unit needs, then sends that power to the parts."
  },
  {
    q: "Which drive stores files on spinning magnetic disks and keeps them when the computer is off?",
    choices: ["Hard disk drive", "RAM", "Cache memory", "CPU fan"],
    answer: "Hard disk drive",
    why: "A hard disk drive keeps files, photos, programs, and the operating system even after shutdown."
  },
  {
    q: "Which storage device uses flash memory and is faster and more durable than a hard disk drive?",
    choices: ["Floppy disk drive", "CD-ROM", "SSD", "CMOS battery"],
    answer: "SSD",
    why: "A solid state drive stores data in flash memory. It has no spinning disk, so it is faster and tougher than a hard drive."
  },
  {
    q: "What holds the processor in place and connects it electrically to the motherboard?",
    choices: ["CPU socket", "RAM slot", "AGP slot", "SATA port"],
    answer: "CPU socket",
    why: "The CPU socket locks the processor onto the motherboard so data and power can flow between them."
  },
  {
    q: "Which part keeps the date, time, and hardware settings when the computer is turned off?",
    choices: ["Cooling fan", "CMOS battery", "Heat sink", "Slot bracket"],
    answer: "CMOS battery",
    why: "The CMOS battery powers the CMOS chip so those settings stay saved without the main power supply."
  },
  {
    q: "Which chip stores the firmware that starts the computer and checks the hardware?",
    choices: ["BIOS chip", "Sound card", "LAN card", "Graphics card"],
    answer: "BIOS chip",
    why: "The BIOS, or UEFI, chip holds startup firmware. It tests the hardware and helps load the operating system."
  },
  {
    q: "What are the metal spacers that hold the motherboard above the case?",
    choices: ["Standoffs", "Jumpers", "Molex connectors", "Berg connectors"],
    answer: "Standoffs",
    why: "Standoffs keep the motherboard from touching the metal case, which prevents short circuits."
  },
  {
    q: "What is the metal plate at the back of the case that lines up with the motherboard ports?",
    choices: ["I/O shield", "Drive bay", "North bridge", "Thermal paste"],
    answer: "I/O shield",
    why: "The I/O shield frames the rear ports, such as USB, video, audio, and network, and covers the extra openings."
  },
  {
    q: "Which part houses the internal components, helps cooling, and makes the hardware easier to reach?",
    choices: ["System case", "Expansion slot", "System bus", "ROM"],
    answer: "System case",
    why: "The system case, or chassis, protects the parts inside and gives them an organized place with airflow."
  },
  {
    q: "What is placed between the CPU and the heat sink so heat can cross the tiny gaps?",
    choices: ["Thermal paste", "SATA cable", "Jumper", "Cache memory"],
    answer: "Thermal paste",
    why: "Thermal paste fills microscopic gaps between the processor and the heat sink so heat leaves the CPU."
  },
  {
    q: "Which memory is very fast and sits inside or near the CPU?",
    choices: ["Cache memory", "Floppy disk", "DVD drive", "Parallel port"],
    answer: "Cache memory",
    why: "Cache keeps frequently used data and instructions close to the processor so it does not have to wait for RAM."
  },
  {
    q: "Which memory stores permanent startup instructions that remain when the power is off?",
    choices: ["ROM", "RAM", "Cache memory", "System bus"],
    answer: "ROM",
    why: "ROM, or read-only memory, holds firmware the computer can read in order to boot and test the hardware."
  },
  {
    q: "What carries data, addresses, and control signals between the CPU, memory, and other parts?",
    choices: ["System bus", "Power button", "Audio jack", "Slot bracket"],
    answer: "System bus",
    why: "The system bus is the pathway on the motherboard that lets the main parts communicate."
  },
  {
    q: "On older motherboards, which chipset part handles high-speed links among the CPU, RAM, and graphics?",
    choices: ["North bridge", "South bridge", "Modem card", "Internal speaker"],
    answer: "North bridge",
    why: "The north bridge managed fast traffic between the CPU, RAM, graphics card, and the front-side bus."
  },
  {
    q: "On older motherboards, which chipset part handles slower devices such as storage, USB, and audio?",
    choices: ["South bridge", "North bridge", "CPU fan", "NVMe SSD"],
    answer: "South bridge",
    why: "The south bridge managed slower input and output, including drives, USB, PS/2, PCI, BIOS, audio, and networking."
  },
  {
    q: "On the audio jacks, what is the pink port for?",
    choices: ["Microphone", "Speakers", "Line input", "Network cable"],
    answer: "Microphone",
    why: "Pink is the microphone jack. Green is for speakers or headphones, and blue is the line input."
  },
  {
    q: "Which plug is the main 24-pin power connection from the power supply to the motherboard?",
    choices: ["ATX power connector", "Berg connector", "PS/2 port", "HDMI port"],
    answer: "ATX power connector",
    why: "The 24-pin ATX connector delivers the main electricity the motherboard needs to turn on and run."
  },
  {
    q: "Which motherboard connector is L-shaped and is where a SATA data cable plugs in?",
    choices: ["SATA port", "VGA port", "Serial port", "FireWire port"],
    answer: "SATA port",
    why: "A SATA port links a hard drive, SSD, or optical drive so data can move through the system unit."
  },
  {
    q: "Which older slot was used only for a graphics card and is often brown?",
    choices: ["AGP slot", "RAM slot", "PCI slot", "M.2 slot"],
    answer: "AGP slot",
    why: "AGP was a graphics-only slot on older boards. Newer computers use a PCIe slot for the graphics card."
  },
  {
    q: "What makes the beep codes you hear when the computer starts?",
    choices: ["Internal speaker", "Graphics card", "Cooling fan", "DVD drive"],
    answer: "Internal speaker",
    why: "The small motherboard speaker or buzzer beeps during startup to help diagnose hardware problems."
  },
  {
    q: "Which cable gives a graphics card extra electricity beyond what the expansion slot provides?",
    choices: ["PCIe power plug", "Floppy cable", "IDE cable", "SATA data cable"],
    answer: "PCIe power plug",
    why: "A 6-pin or 8-pin PCIe power plug runs from the power supply to the graphics card."
  },
  {
    q: "Which port is also called IEEE 1394 and was used for cameras and fast external drives?",
    choices: ["FireWire port", "Parallel port", "PS/2 port", "VGA port"],
    answer: "FireWire port",
    why: "FireWire, or IEEE 1394, transfers data quickly. FireWire 800 is one version of that port."
  },
  {
    q: "Which older port is also called LPT and was used mainly for printers?",
    choices: ["Parallel port", "Serial port", "LAN port", "DisplayPort"],
    answer: "Parallel port",
    why: "A parallel port is the wide printer port on older system units. The computer side uses a 25-pin plug."
  },
  {
    q: "Which port is also called a COM port and sends data one bit at a time through 9 pins?",
    choices: ["Serial port", "HDMI port", "USB port", "eSATA port"],
    answer: "Serial port",
    why: "A serial, or COM, port was used by older mice, modems, and similar devices."
  },
  {
    q: "Which 4-pin drive plug uses a yellow 12-volt wire, a red 5-volt wire, and black ground wires?",
    choices: ["Molex connector", "Berg connector", "Front panel connector", "DisplayPort"],
    answer: "Molex connector",
    why: "A Molex connector powers older hard drives, optical drives, and some fans."
  },
  {
    q: "Which small 4-pin plug supplies power to a floppy disk drive?",
    choices: ["Berg connector", "ATX power connector", "HDMI port", "DVI port"],
    answer: "Berg connector",
    why: "The Berg connector is the floppy-drive power plug. It is smaller than a Molex plug."
  },
  {
    q: "Which storage board plugs into the M.2 slot and is much faster than a hard disk drive?",
    choices: ["NVMe SSD", "CD-ROM", "Floppy disk drive", "Sound card"],
    answer: "NVMe SSD",
    why: "An NVMe SSD is a small board that sits in the M.2 slot and keeps files even when the power is off."
  },
  {
    q: "What is the rocker on the back of the power supply that turns wall power on or off?",
    choices: ["PSU switch", "Power button", "Reset button", "Jumper"],
    answer: "PSU switch",
    why: "The PSU switch controls electricity from the outlet before it enters the system unit. The power button is on the front of the case."
  }
];
