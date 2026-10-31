const QUESTIONS = [
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/system-case.jpg",
    "choices": [
      "System Case",
      "CPU",
      "CPU Socket",
      "Motherboard"
    ],
    "answer": "System Case",
    "why": "It houses and protects all internal components, provides cooling, and organizes the hardware for easy access and maintenance."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cpu.jpg",
    "choices": [
      "CPU",
      "CPU Socket",
      "Motherboard",
      "RAM"
    ],
    "answer": "CPU",
    "why": "The CPU is the “brain” of the computer. It processes instructions, performs calculations, and manages tasks to run programs and control hardware."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cpu-socket.jpg",
    "choices": [
      "CPU Socket",
      "Motherboard",
      "RAM",
      "RAM Slot"
    ],
    "answer": "CPU Socket",
    "why": "It holds the processor in place on the and provides the electrical and physical connection between the CPU and the motherboard, allowing data and power to flow."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/motherboard.jpg",
    "choices": [
      "Motherboard",
      "RAM",
      "RAM Slot",
      "Power Supply"
    ],
    "answer": "Motherboard",
    "why": "The Motherboard is the main circuit board that connects all computer components, including the CPU, RAM, storage, and peripherals. It allows them to communicate and work together, acting as the backbone of the computer system."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/ram.jpg",
    "choices": [
      "RAM",
      "RAM Slot",
      "Power Supply",
      "Hard Disk Drive"
    ],
    "answer": "RAM",
    "why": "RAM temporarily stores data and programs that the computer is currently using, allowing the CPU to access information quickly."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/ram-slot.jpg",
    "choices": [
      "RAM Slot",
      "Power Supply",
      "Hard Disk Drive",
      "SATA Cable"
    ],
    "answer": "RAM Slot",
    "why": "A RAM slot holds the memory modules (RAM) on the and provides the connection for data transfer between the RAM and the CPU."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/power-supply.jpg",
    "choices": [
      "Power Supply",
      "Hard Disk Drive",
      "SATA Cable",
      "CD-ROM"
    ],
    "answer": "Power Supply",
    "why": "A power supply converts AC to DC, regulates and distributes power to all components."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/hard-disk-drive.jpg",
    "choices": [
      "Hard Disk Drive",
      "SATA Cable",
      "CD-ROM",
      "Heat Sink"
    ],
    "answer": "Hard Disk Drive",
    "why": "A hard drive stores all your computer’s data your files, photos, videos, apps, and even the operating system. It keeps everything saved even when the computer is turned off."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/sata-cable.jpg",
    "choices": [
      "SATA Cable",
      "CD-ROM",
      "Heat Sink",
      "Peripheral Connectors"
    ],
    "answer": "SATA Cable",
    "why": "It connects storage devices like HDDs or SSD."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cd-rom.jpg",
    "choices": [
      "CD-ROM",
      "Heat Sink",
      "Peripheral Connectors",
      "IDE Cable"
    ],
    "answer": "CD-ROM",
    "why": "It reads data stored on CDs, allowing the computer to access software, music, or files from the disc."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/heat-sink.jpg",
    "choices": [
      "Heat Sink",
      "Peripheral Connectors",
      "IDE Cable",
      "IDE Port"
    ],
    "answer": "Heat Sink",
    "why": "It removes heat from the CPU, GPU, or other components, helping prevent overheating and keeping the system cool."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/peripheral-connectors.jpg",
    "choices": [
      "Peripheral Connectors",
      "IDE Cable",
      "IDE Port",
      "Sound Card"
    ],
    "answer": "Peripheral Connectors",
    "why": "Provide ports for external devices (like keyboard, mouse, printer, or USB devices) to connect and communicate with the computer."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/ide-cable.jpg",
    "choices": [
      "IDE Cable",
      "IDE Port",
      "Sound Card",
      "LAN Card"
    ],
    "answer": "IDE Cable",
    "why": "It connects storage devices like hard drives and optical drives to the , allowing data transfer between them."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/ide-port.jpg",
    "choices": [
      "IDE Port",
      "Sound Card",
      "LAN Card",
      "LAN Port"
    ],
    "answer": "IDE Port",
    "why": "The IDE Port is used to connect older storage devices to the , such as: Hard Disk Drives/Optical drives."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/sound-card.jpg",
    "choices": [
      "Sound Card",
      "LAN Card",
      "LAN Port",
      "PS/2 Ports"
    ],
    "answer": "Sound Card",
    "why": "It processes and outputs sound, allowing the computer to play music, sounds, and recordings, and often provides inputs for microphones or musical instruments."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/lan-card.jpg",
    "choices": [
      "LAN Card",
      "LAN Port",
      "PS/2 Ports",
      "VGA Port"
    ],
    "answer": "LAN Card",
    "why": "It allows a computer to connect to a local area network (LAN) or the internet, enabling data communication with other devices."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/lan-port.jpg",
    "choices": [
      "LAN Port",
      "PS/2 Ports",
      "VGA Port",
      "Graphics Card"
    ],
    "answer": "LAN Port",
    "why": "It connects a computer to a network or the internet, enabling fast, stable communication and data sharing with other devices."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/ps-2-ports.jpg",
    "choices": [
      "PS/2 Ports",
      "VGA Port",
      "Graphics Card",
      "CMOS Battery"
    ],
    "answer": "PS/2 Ports",
    "why": "Allow a computer to connect a keyboard and mouse, enabling input for typing, navigation, and control."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/vga-port.jpg",
    "choices": [
      "VGA Port",
      "Graphics Card",
      "CMOS Battery",
      "North Bridge"
    ],
    "answer": "VGA Port",
    "why": "It transmits video signals from the computer to a monitor or display, allowing you to see the visual output."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/graphics-card.jpg",
    "choices": [
      "Graphics Card",
      "CMOS Battery",
      "North Bridge",
      "South Bridge"
    ],
    "answer": "Graphics Card",
    "why": "It processes and renders images, videos, and animations, improving visual performance for gaming, design, and multimedia applications."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cmos-battery.jpg",
    "choices": [
      "CMOS Battery",
      "North Bridge",
      "South Bridge",
      "SSD"
    ],
    "answer": "CMOS Battery",
    "why": "It provides power to the ’s CMOS chip, preserving system settings like date, time, and hardware configuration when the computer is turned off."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/north-bridge.jpg",
    "choices": [
      "North Bridge",
      "South Bridge",
      "SSD",
      "Cooling Fan"
    ],
    "answer": "North Bridge",
    "why": "The North Bridge is a part of older chipsets that manages high-speed communication between the CPU, RAM, graphics card, and the front-side bus, ensuring fast data transfer among these key components."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/south-bridge.jpg",
    "choices": [
      "South Bridge",
      "SSD",
      "Cooling Fan",
      "USB Port"
    ],
    "answer": "South Bridge",
    "why": "The South Bridge is part of older chipsets that manages slower I/O functions, handling communication between the CPU and devices like storage drives, USB and PS/2 ports, PCI slots, BIOS/CMOS, audio, networking, and system timers."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/ssd.jpg",
    "choices": [
      "SSD",
      "Cooling Fan",
      "USB Port",
      "HDMI Port"
    ],
    "answer": "SSD",
    "why": "A Solid State Drive stores data using flash memory. It is faster and more durable than a hard disk drive, and it keeps your files and operating system even when the computer is turned off."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cooling-fan.jpg",
    "choices": [
      "Cooling Fan",
      "USB Port",
      "HDMI Port",
      "Expansion Slot"
    ],
    "answer": "Cooling Fan",
    "why": "A cooling fan moves air through the computer case to remove heat from the CPU, GPU, and other parts, helping prevent overheating and keeping the system stable."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/usb-port.jpg",
    "choices": [
      "USB Port",
      "HDMI Port",
      "Expansion Slot",
      "BIOS Chip"
    ],
    "answer": "USB Port",
    "why": "A USB port lets you connect external devices such as flash drives, printers, keyboards, and phones so they can transfer data and sometimes receive power from the computer."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/hdmi-port.jpg",
    "choices": [
      "HDMI Port",
      "Expansion Slot",
      "BIOS Chip",
      "Thermal Paste"
    ],
    "answer": "HDMI Port",
    "why": "An HDMI port sends high-quality video and audio from the computer to a monitor, TV, or projector through a single cable."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/expansion-slot.jpg",
    "choices": [
      "Expansion Slot",
      "BIOS Chip",
      "Thermal Paste",
      "ATX Power Connector"
    ],
    "answer": "Expansion Slot",
    "why": "An expansion slot (such as PCIe ) on the lets you install extra cards like a graphics card, sound card, or network card to add or improve features."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/bios-chip.jpg",
    "choices": [
      "BIOS Chip",
      "Thermal Paste",
      "ATX Power Connector",
      "Front Panel Connectors"
    ],
    "answer": "BIOS Chip",
    "why": "The BIOS (or UEFI) chip stores firmware that starts the computer, checks hardware during boot, and helps load the operating system."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/thermal-paste.jpg",
    "choices": [
      "Thermal Paste",
      "ATX Power Connector",
      "Front Panel Connectors",
      "Drive Bay"
    ],
    "answer": "Thermal Paste",
    "why": "Thermal paste is a heat-transfer compound placed between the CPU and the heat sink. It fills tiny gaps so heat can leave the processor and keep it from overheating."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/atx-power-connector.jpg",
    "choices": [
      "ATX Power Connector",
      "Front Panel Connectors",
      "Drive Bay",
      "I/O Shield"
    ],
    "answer": "ATX Power Connector",
    "why": "The 24-pin ATX power connector is the main power plug from the power supply to the . It delivers electricity so the board and its parts can turn on and run."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/front-panel-connectors.jpg",
    "choices": [
      "Front Panel Connectors",
      "Drive Bay",
      "I/O Shield",
      "Jumpers"
    ],
    "answer": "Front Panel Connectors",
    "why": "Front panel connectors attach the case power button, reset button, and LED lights to the so you can turn the computer on and see power or drive activity."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/drive-bay.jpg",
    "choices": [
      "Drive Bay",
      "I/O Shield",
      "Jumpers",
      "Standoffs"
    ],
    "answer": "Drive Bay",
    "why": "A drive bay is a space inside the system unit that holds storage devices such as a hard drive, SSD cage, floppy drive, or optical drive in place."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/i-o-shield.jpg",
    "choices": [
      "I/O Shield",
      "Jumpers",
      "Standoffs",
      "Internal Speaker"
    ],
    "answer": "I/O Shield",
    "why": "The I/O shield is the metal plate at the back of the case. It lines up with the ports and protects the openings while giving access to USB, video, audio, and network ports."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/jumpers.jpg",
    "choices": [
      "Jumpers",
      "Standoffs",
      "Internal Speaker",
      "Cache Memory"
    ],
    "answer": "Jumpers",
    "why": "Jumpers are small plastic caps placed on pins. They set hardware options such as clearing CMOS settings or changing older drive and BIOS configurations."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/standoffs.jpg",
    "choices": [
      "Standoffs",
      "Internal Speaker",
      "Cache Memory",
      "ROM"
    ],
    "answer": "Standoffs",
    "why": "Standoffs are metal spacers that hold the above the case. They prevent short circuits and keep the board securely mounted inside the system unit."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/internal-speaker.jpg",
    "choices": [
      "Internal Speaker",
      "Cache Memory",
      "ROM",
      "SATA Power Cable"
    ],
    "answer": "Internal Speaker",
    "why": "The internal speaker or buzzer is a small speaker on or connected to the . It makes beep codes that help diagnose hardware problems during startup."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cache-memory.jpg",
    "choices": [
      "Cache Memory",
      "ROM",
      "SATA Power Cable",
      "Floppy Disk Drive"
    ],
    "answer": "Cache Memory",
    "why": "Cache memory is very fast memory inside or near the CPU. It stores frequently used data and instructions so the processor can work faster than using RAM alone."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/rom.jpg",
    "choices": [
      "ROM",
      "SATA Power Cable",
      "Floppy Disk Drive",
      "DisplayPort"
    ],
    "answer": "ROM",
    "why": "ROM, or Read-Only Memory, stores permanent startup instructions. The computer can read this firmware to boot and test hardware, and the data stays even when power is off."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/sata-power-cable.jpg",
    "choices": [
      "SATA Power Cable",
      "Floppy Disk Drive",
      "DisplayPort",
      "CPU Fan"
    ],
    "answer": "SATA Power Cable",
    "why": "A SATA power cable comes from the power supply and plugs into a hard drive, SSD, or optical drive to give it the electricity it needs to operate."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/floppy-disk-drive.jpg",
    "choices": [
      "Floppy Disk Drive",
      "DisplayPort",
      "CPU Fan",
      "PCI Slot"
    ],
    "answer": "Floppy Disk Drive",
    "why": "A floppy disk drive reads and writes data on floppy disks. It was used in older system units for saving small files and installing programs."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/displayport.jpg",
    "choices": [
      "DisplayPort",
      "CPU Fan",
      "PCI Slot",
      "AGP Slot"
    ],
    "answer": "DisplayPort",
    "why": "A DisplayPort sends high-quality video and audio from the computer to a monitor, similar to HDMI but often used on PCs."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/cpu-fan.jpg",
    "choices": [
      "CPU Fan",
      "PCI Slot",
      "AGP Slot",
      "SATA Port"
    ],
    "answer": "CPU Fan",
    "why": "The CPU fan sits on the processor heat sink inside the system unit. It blows air across the CPU so the processor does not overheat while the computer is running."
  },
  {
    "q": "In this picture, what are the long white slots called?",
    "image": "images/pci-slot.jpg",
    "choices": [
      "PCI Slot",
      "AGP Slot",
      "SATA Port",
      "DVD Drive"
    ],
    "answer": "PCI Slot",
    "why": "A PCI slot is a long expansion slot on the . In this picture the white slots are PCI slots. They hold older cards such as a sound card, network card, or modem."
  },
  {
    "q": "In this picture, what is the brown slot above the white slots called?",
    "image": "images/agp-slot.jpg",
    "choices": [
      "AGP Slot",
      "SATA Port",
      "DVD Drive",
      "NVMe SSD"
    ],
    "answer": "AGP Slot",
    "why": "An AGP slot was used only for a graphics card on older s. In this picture it is the brown slot above the white PCI slots. Newer computers use a PCIe slot instead."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/sata-port.jpg",
    "choices": [
      "SATA Port",
      "DVD Drive",
      "NVMe SSD",
      "Modem Card"
    ],
    "answer": "SATA Port",
    "why": "A SATA port is the L-shaped connector on the where a SATA data cable plugs in. It links a hard drive, SSD, or optical drive so data can move through the system unit."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/dvd-drive.jpg",
    "choices": [
      "DVD Drive",
      "NVMe SSD",
      "Modem Card",
      "Power Button"
    ],
    "answer": "DVD Drive",
    "why": "A DVD drive is an optical drive mounted in the system unit. It reads DVDs and CDs. The drive in the picture is a Blu-ray drive, which can also read DVDs."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/nvme-ssd.jpg",
    "choices": [
      "NVMe SSD",
      "Modem Card",
      "Power Button",
      "Front USB Ports"
    ],
    "answer": "NVMe SSD",
    "why": "An NVMe SSD is a small storage board that plugs into the M.2 slot on the . It keeps your files and operating system when the power is off, and it is much faster than a hard disk drive."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/modem-card.jpg",
    "choices": [
      "Modem Card",
      "Power Button",
      "Front USB Ports",
      "Molex Connector"
    ],
    "answer": "Modem Card",
    "why": "A modem card fits in an expansion slot inside the system unit. Older computers used it to connect to the internet through a telephone line. The jacks on the metal bracket are for the phone cable."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/power-button.jpg",
    "choices": [
      "Power Button",
      "Front USB Ports",
      "Molex Connector",
      "PCIe Power Plug"
    ],
    "answer": "Power Button",
    "why": "The power button is on the front of the system unit. Pressing it turns the computer on, or it tells the system to shut down. The small light near the button shows that the computer has power."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/front-usb-ports.jpg",
    "choices": [
      "Front USB Ports",
      "Molex Connector",
      "PCIe Power Plug",
      "Audio Jacks"
    ],
    "answer": "Front USB Ports",
    "why": "Front USB ports are built into the front of the system unit. They let you plug in a flash drive, phone, or other USB device without using the ports at the back of the case."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/molex-connector.jpg",
    "choices": [
      "Molex Connector",
      "PCIe Power Plug",
      "Audio Jacks",
      "Serial Port"
    ],
    "answer": "Molex Connector",
    "why": "A Molex connector is a 4-pin power plug from the power supply. It gives electricity to older hard drives, optical drives, and some fans. Yellow is 12 volts, red is 5 volts, and the black wires are ground."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/pcie-power-plug.jpg",
    "choices": [
      "PCIe Power Plug",
      "Audio Jacks",
      "Serial Port",
      "DVI Port"
    ],
    "answer": "PCIe Power Plug",
    "why": "A PCIe power plug is a 6-pin or 8-pin cable from the power supply. It gives a graphics card extra electricity when the expansion slot alone cannot supply enough power."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/audio-jacks.jpg",
    "choices": [
      "Audio Jacks",
      "Serial Port",
      "DVI Port",
      "eSATA Port"
    ],
    "answer": "Audio Jacks",
    "why": "Audio jacks are the round colored ports on the system unit. Pink is for a microphone, green is for speakers or headphones, and blue is the line input for other sound devices."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/serial-port.jpg",
    "choices": [
      "Serial Port",
      "DVI Port",
      "eSATA Port",
      "FireWire Port"
    ],
    "answer": "Serial Port",
    "why": "A serial port, also called a COM port, sends data one bit at a time. It is the 9-pin port on older system units. Mice, modems, and some other devices connected here."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/dvi-port.jpg",
    "choices": [
      "DVI Port",
      "eSATA Port",
      "FireWire Port",
      "Slot Bracket"
    ],
    "answer": "DVI Port",
    "why": "A DVI port sends digital video from the system unit to a monitor. On this graphics card, the white connector is the DVI port. It can show a sharper picture than the blue VGA port."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/esata-port.jpg",
    "choices": [
      "eSATA Port",
      "FireWire Port",
      "Slot Bracket",
      "Capacitors"
    ],
    "answer": "eSATA Port",
    "why": "An eSATA port connects an external SATA drive to the system unit. The ports labeled eSATA on this bracket are those external connections. They move data faster than many older USB ports."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/firewire-port.jpg",
    "choices": [
      "FireWire Port",
      "Slot Bracket",
      "Capacitors",
      "Berg Connector"
    ],
    "answer": "FireWire Port",
    "why": "A FireWire port, also called IEEE 1394, transfers data quickly. Computers used it for video cameras and external drives. The port in the picture is labeled FireWire 800."
  },
  {
    "q": "Which part of the system unit is shown in the picture?",
    "image": "images/slot-bracket.jpg",
    "choices": [
      "Slot Bracket",
      "Capacitors",
      "Berg Connector",
      "Floppy Cable"
    ],
    "answer": "Slot Bracket",
    "why": "A slot bracket is the metal plate at the back of an expansion card, or a cover over an empty slot. It closes the opening in the case, holds the card ports, and helps keep dust out of the system unit."
  },
  {
    "q": "Which parts are the cylinder components that smooth electricity on the motherboard and inside the power supply?",
    "image": "images/capacitors.jpg",
    "choices": [
      "Capacitors",
      "Berg Connector",
      "Floppy Cable",
      "Parallel Port"
    ],
    "answer": "Capacitors",
    "why": "Capacitors store and smooth electricity so the other parts get steady power. On a motherboard they are the small cylinder parts near the CPU and slots."
  },
  {
    "q": "Which small 4-pin plug in this picture supplies power to a floppy disk drive?",
    "image": "images/berg-connector.jpg",
    "choices": [
      "Berg Connector",
      "Floppy Cable",
      "Parallel Port",
      "PSU Switch"
    ],
    "answer": "Berg Connector",
    "why": "A Berg connector is the small 4-pin power plug for a floppy disk drive."
  },
  {
    "q": "Which cable is this ribbon that connects a floppy disk drive to the motherboard?",
    "image": "images/floppy-cable.jpg",
    "choices": [
      "Floppy Cable",
      "Parallel Port",
      "PSU Switch",
      "System Case"
    ],
    "answer": "Floppy Cable",
    "why": "A floppy ribbon cable carries data between the floppy disk drive and the motherboard."
  },
  {
    "q": "Which older printer port uses the wide plug shown in the picture?",
    "image": "images/parallel-port.jpg",
    "choices": [
      "Parallel Port",
      "PSU Switch",
      "System Case",
      "CPU"
    ],
    "answer": "Parallel Port",
    "why": "A parallel port, also called an LPT port, was used mainly to connect a printer. The computer side uses a 25-pin plug."
  },
  {
    "q": "What is the rocker switch on the back of this power supply called?",
    "image": "images/psu-switch.jpg",
    "choices": [
      "PSU Switch",
      "System Case",
      "CPU",
      "CPU Socket"
    ],
    "answer": "PSU Switch",
    "why": "The PSU switch turns electricity from the wall outlet on or off before it enters the system unit."
  }
];
