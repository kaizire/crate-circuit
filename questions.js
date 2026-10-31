const QUESTIONS = [
  {
    "part": "System Case",
    "q": "What is the correct function of this part?",
    "image": "images/system-case.jpg",
    "choices": [
      "Houses and protects the internal parts and helps keep them cool.",
      "The main circuit board that connects all parts so they can work together.",
      "Carries data between a SATA storage drive and the motherboard.",
      "The motherboard connector for older IDE storage drives."
    ],
    "answer": "Houses and protects the internal parts and helps keep them cool.",
    "why": "Houses and protects the internal parts and helps keep them cool."
  },
  {
    "part": "CPU",
    "q": "What is the correct function of this part?",
    "image": "images/cpu.jpg",
    "choices": [
      "Processes instructions and runs programs; it is the brain of the computer.",
      "Temporarily stores data and programs the computer is using right now.",
      "Reads data stored on compact discs.",
      "Processes and outputs sound, and can take microphone or instrument input."
    ],
    "answer": "Processes instructions and runs programs; it is the brain of the computer.",
    "why": "Processes instructions and runs programs; it is the brain of the computer."
  },
  {
    "part": "CPU Socket",
    "q": "What is the correct function of this part?",
    "image": "images/cpu-socket.jpg",
    "choices": [
      "Holds the processor on the motherboard and connects it electrically.",
      "Holds the RAM modules and connects them to the motherboard.",
      "Pulls heat away from the CPU or GPU to help prevent overheating.",
      "Lets the computer connect to a wired network or the internet."
    ],
    "answer": "Holds the processor on the motherboard and connects it electrically.",
    "why": "Holds the processor on the motherboard and connects it electrically."
  },
  {
    "part": "Motherboard",
    "q": "What is the correct function of this part?",
    "image": "images/motherboard.jpg",
    "choices": [
      "The main circuit board that connects all parts so they can work together.",
      "Converts AC from the wall into DC power for the parts.",
      "Provide ports so external devices can connect to the computer.",
      "The Ethernet jack that plugs a network cable into the computer."
    ],
    "answer": "The main circuit board that connects all parts so they can work together.",
    "why": "The main circuit board that connects all parts so they can work together."
  },
  {
    "part": "RAM",
    "q": "What is the correct function of this part?",
    "image": "images/ram.jpg",
    "choices": [
      "Temporarily stores data and programs the computer is using right now.",
      "Stores files and the operating system on spinning disks even when power is off.",
      "An older ribbon cable that connects hard drives or optical drives to the motherboard.",
      "Older round ports used to connect a keyboard and mouse."
    ],
    "answer": "Temporarily stores data and programs the computer is using right now.",
    "why": "Temporarily stores data and programs the computer is using right now."
  },
  {
    "part": "RAM Slot",
    "q": "What is the correct function of this part?",
    "image": "images/ram-slot.jpg",
    "choices": [
      "Holds the RAM modules and connects them to the motherboard.",
      "Carries data between a SATA storage drive and the motherboard.",
      "The motherboard connector for older IDE storage drives.",
      "Sends analog video from the computer to a monitor."
    ],
    "answer": "Holds the RAM modules and connects them to the motherboard.",
    "why": "Holds the RAM modules and connects them to the motherboard."
  },
  {
    "part": "Power Supply",
    "q": "What is the correct function of this part?",
    "image": "images/power-supply.jpg",
    "choices": [
      "Converts AC from the wall into DC power for the parts.",
      "Reads data stored on compact discs.",
      "Processes and outputs sound, and can take microphone or instrument input.",
      "Renders images, video, and games for the display."
    ],
    "answer": "Converts AC from the wall into DC power for the parts.",
    "why": "Converts AC from the wall into DC power for the parts."
  },
  {
    "part": "Hard Disk Drive",
    "q": "What is the correct function of this part?",
    "image": "images/hard-disk-drive.jpg",
    "choices": [
      "Stores files and the operating system on spinning disks even when power is off.",
      "Pulls heat away from the CPU or GPU to help prevent overheating.",
      "Lets the computer connect to a wired network or the internet.",
      "Keeps the date, time, and BIOS settings when the computer is off."
    ],
    "answer": "Stores files and the operating system on spinning disks even when power is off.",
    "why": "Stores files and the operating system on spinning disks even when power is off."
  },
  {
    "part": "SATA Cable",
    "q": "What is the correct function of this part?",
    "image": "images/sata-cable.jpg",
    "choices": [
      "Carries data between a SATA storage drive and the motherboard.",
      "Provide ports so external devices can connect to the computer.",
      "The Ethernet jack that plugs a network cable into the computer.",
      "On older boards, manages fast links among the CPU, RAM, and graphics."
    ],
    "answer": "Carries data between a SATA storage drive and the motherboard.",
    "why": "Carries data between a SATA storage drive and the motherboard."
  },
  {
    "part": "CD-ROM",
    "q": "What is the correct function of this part?",
    "image": "images/cd-rom.jpg",
    "choices": [
      "Reads data stored on compact discs.",
      "An older ribbon cable that connects hard drives or optical drives to the motherboard.",
      "Older round ports used to connect a keyboard and mouse.",
      "On older boards, manages slower devices such as storage, USB, and audio."
    ],
    "answer": "Reads data stored on compact discs.",
    "why": "Reads data stored on compact discs."
  },
  {
    "part": "Heat Sink",
    "q": "What is the correct function of this part?",
    "image": "images/heat-sink.jpg",
    "choices": [
      "Pulls heat away from the CPU or GPU to help prevent overheating.",
      "The motherboard connector for older IDE storage drives.",
      "Sends analog video from the computer to a monitor.",
      "Stores files in flash memory; faster and tougher than a hard disk drive."
    ],
    "answer": "Pulls heat away from the CPU or GPU to help prevent overheating.",
    "why": "Pulls heat away from the CPU or GPU to help prevent overheating."
  },
  {
    "part": "Peripheral Connectors",
    "q": "What is the correct function of this part?",
    "image": "images/peripheral-connectors.jpg",
    "choices": [
      "Provide ports so external devices can connect to the computer.",
      "Processes and outputs sound, and can take microphone or instrument input.",
      "Renders images, video, and games for the display.",
      "Moves air through the case to remove heat from the parts."
    ],
    "answer": "Provide ports so external devices can connect to the computer.",
    "why": "Provide ports so external devices can connect to the computer."
  },
  {
    "part": "IDE Cable",
    "q": "What is the correct function of this part?",
    "image": "images/ide-cable.jpg",
    "choices": [
      "An older ribbon cable that connects hard drives or optical drives to the motherboard.",
      "Lets the computer connect to a wired network or the internet.",
      "Keeps the date, time, and BIOS settings when the computer is off.",
      "Lets you plug in flash drives, printers, keyboards, and phones."
    ],
    "answer": "An older ribbon cable that connects hard drives or optical drives to the motherboard.",
    "why": "An older ribbon cable that connects hard drives or optical drives to the motherboard."
  },
  {
    "part": "IDE Port",
    "q": "What is the correct function of this part?",
    "image": "images/ide-port.jpg",
    "choices": [
      "The motherboard connector for older IDE storage drives.",
      "The Ethernet jack that plugs a network cable into the computer.",
      "On older boards, manages fast links among the CPU, RAM, and graphics.",
      "Sends high-quality video and audio to a monitor or TV on one cable."
    ],
    "answer": "The motherboard connector for older IDE storage drives.",
    "why": "The motherboard connector for older IDE storage drives."
  },
  {
    "part": "Sound Card",
    "q": "What is the correct function of this part?",
    "image": "images/sound-card.jpg",
    "choices": [
      "Processes and outputs sound, and can take microphone or instrument input.",
      "Older round ports used to connect a keyboard and mouse.",
      "On older boards, manages slower devices such as storage, USB, and audio.",
      "Lets you install extra cards such as graphics, sound, or network cards."
    ],
    "answer": "Processes and outputs sound, and can take microphone or instrument input.",
    "why": "Processes and outputs sound, and can take microphone or instrument input."
  },
  {
    "part": "LAN Card",
    "q": "What is the correct function of this part?",
    "image": "images/lan-card.jpg",
    "choices": [
      "Lets the computer connect to a wired network or the internet.",
      "Sends analog video from the computer to a monitor.",
      "Stores files in flash memory; faster and tougher than a hard disk drive.",
      "Stores firmware that starts the computer and checks the hardware."
    ],
    "answer": "Lets the computer connect to a wired network or the internet.",
    "why": "Lets the computer connect to a wired network or the internet."
  },
  {
    "part": "LAN Port",
    "q": "What is the correct function of this part?",
    "image": "images/lan-port.jpg",
    "choices": [
      "The Ethernet jack that plugs a network cable into the computer.",
      "Renders images, video, and games for the display.",
      "Moves air through the case to remove heat from the parts.",
      "Fills tiny gaps so heat can pass from the CPU to the heat sink."
    ],
    "answer": "The Ethernet jack that plugs a network cable into the computer.",
    "why": "The Ethernet jack that plugs a network cable into the computer."
  },
  {
    "part": "PS/2 Ports",
    "q": "What is the correct function of this part?",
    "image": "images/ps-2-ports.jpg",
    "choices": [
      "Older round ports used to connect a keyboard and mouse.",
      "Keeps the date, time, and BIOS settings when the computer is off.",
      "Lets you plug in flash drives, printers, keyboards, and phones.",
      "The 24-pin plug that delivers main power to the motherboard."
    ],
    "answer": "Older round ports used to connect a keyboard and mouse.",
    "why": "Older round ports used to connect a keyboard and mouse."
  },
  {
    "part": "VGA Port",
    "q": "What is the correct function of this part?",
    "image": "images/vga-port.jpg",
    "choices": [
      "Sends analog video from the computer to a monitor.",
      "On older boards, manages fast links among the CPU, RAM, and graphics.",
      "Sends high-quality video and audio to a monitor or TV on one cable.",
      "Attach the power button, reset button, and case lights to the board."
    ],
    "answer": "Sends analog video from the computer to a monitor.",
    "why": "Sends analog video from the computer to a monitor."
  },
  {
    "part": "Graphics Card",
    "q": "What is the correct function of this part?",
    "image": "images/graphics-card.jpg",
    "choices": [
      "Renders images, video, and games for the display.",
      "On older boards, manages slower devices such as storage, USB, and audio.",
      "Lets you install extra cards such as graphics, sound, or network cards.",
      "A space in the case that holds a hard drive, SSD cage, or optical drive."
    ],
    "answer": "Renders images, video, and games for the display.",
    "why": "Renders images, video, and games for the display."
  },
  {
    "part": "CMOS Battery",
    "q": "What is the correct function of this part?",
    "image": "images/cmos-battery.jpg",
    "choices": [
      "Keeps the date, time, and BIOS settings when the computer is off.",
      "Stores files in flash memory; faster and tougher than a hard disk drive.",
      "Stores firmware that starts the computer and checks the hardware.",
      "The metal plate at the back of the case that lines up with the motherboard ports."
    ],
    "answer": "Keeps the date, time, and BIOS settings when the computer is off.",
    "why": "Keeps the date, time, and BIOS settings when the computer is off."
  },
  {
    "part": "North Bridge",
    "q": "What is the correct function of this part?",
    "image": "images/north-bridge.jpg",
    "choices": [
      "On older boards, manages fast links among the CPU, RAM, and graphics.",
      "Moves air through the case to remove heat from the parts.",
      "Fills tiny gaps so heat can pass from the CPU to the heat sink.",
      "Small caps on pins that set hardware options such as clearing CMOS."
    ],
    "answer": "On older boards, manages fast links among the CPU, RAM, and graphics.",
    "why": "On older boards, manages fast links among the CPU, RAM, and graphics."
  },
  {
    "part": "South Bridge",
    "q": "What is the correct function of this part?",
    "image": "images/south-bridge.jpg",
    "choices": [
      "On older boards, manages slower devices such as storage, USB, and audio.",
      "Lets you plug in flash drives, printers, keyboards, and phones.",
      "The 24-pin plug that delivers main power to the motherboard.",
      "Metal spacers that hold the motherboard above the case to prevent shorts."
    ],
    "answer": "On older boards, manages slower devices such as storage, USB, and audio.",
    "why": "On older boards, manages slower devices such as storage, USB, and audio."
  },
  {
    "part": "SSD",
    "q": "What is the correct function of this part?",
    "image": "images/ssd.jpg",
    "choices": [
      "Stores files in flash memory; faster and tougher than a hard disk drive.",
      "Sends high-quality video and audio to a monitor or TV on one cable.",
      "Attach the power button, reset button, and case lights to the board.",
      "Makes beep codes during startup to help diagnose hardware problems."
    ],
    "answer": "Stores files in flash memory; faster and tougher than a hard disk drive.",
    "why": "Stores files in flash memory; faster and tougher than a hard disk drive."
  },
  {
    "part": "Cooling Fan",
    "q": "What is the correct function of this part?",
    "image": "images/cooling-fan.jpg",
    "choices": [
      "Moves air through the case to remove heat from the parts.",
      "Lets you install extra cards such as graphics, sound, or network cards.",
      "A space in the case that holds a hard drive, SSD cage, or optical drive.",
      "Very fast memory near the CPU for frequently used data."
    ],
    "answer": "Moves air through the case to remove heat from the parts.",
    "why": "Moves air through the case to remove heat from the parts."
  },
  {
    "part": "USB Port",
    "q": "What is the correct function of this part?",
    "image": "images/usb-port.jpg",
    "choices": [
      "Lets you plug in flash drives, printers, keyboards, and phones.",
      "Stores firmware that starts the computer and checks the hardware.",
      "The metal plate at the back of the case that lines up with the motherboard ports.",
      "Stores permanent startup instructions that stay even when power is off."
    ],
    "answer": "Lets you plug in flash drives, printers, keyboards, and phones.",
    "why": "Lets you plug in flash drives, printers, keyboards, and phones."
  },
  {
    "part": "HDMI Port",
    "q": "What is the correct function of this part?",
    "image": "images/hdmi-port.jpg",
    "choices": [
      "Sends high-quality video and audio to a monitor or TV on one cable.",
      "Fills tiny gaps so heat can pass from the CPU to the heat sink.",
      "Small caps on pins that set hardware options such as clearing CMOS.",
      "Brings electricity from the power supply to a SATA drive."
    ],
    "answer": "Sends high-quality video and audio to a monitor or TV on one cable.",
    "why": "Sends high-quality video and audio to a monitor or TV on one cable."
  },
  {
    "part": "Expansion Slot",
    "q": "What is the correct function of this part?",
    "image": "images/expansion-slot.jpg",
    "choices": [
      "Lets you install extra cards such as graphics, sound, or network cards.",
      "The 24-pin plug that delivers main power to the motherboard.",
      "Metal spacers that hold the motherboard above the case to prevent shorts.",
      "Reads and writes small files on floppy disks in older systems."
    ],
    "answer": "Lets you install extra cards such as graphics, sound, or network cards.",
    "why": "Lets you install extra cards such as graphics, sound, or network cards."
  },
  {
    "part": "BIOS Chip",
    "q": "What is the correct function of this part?",
    "image": "images/bios-chip.jpg",
    "choices": [
      "Stores firmware that starts the computer and checks the hardware.",
      "Attach the power button, reset button, and case lights to the board.",
      "Makes beep codes during startup to help diagnose hardware problems.",
      "Sends high-quality video and audio to a monitor, often used on PCs."
    ],
    "answer": "Stores firmware that starts the computer and checks the hardware.",
    "why": "Stores firmware that starts the computer and checks the hardware."
  },
  {
    "part": "Thermal Paste",
    "q": "What is the correct function of this part?",
    "image": "images/thermal-paste.jpg",
    "choices": [
      "Fills tiny gaps so heat can pass from the CPU to the heat sink.",
      "A space in the case that holds a hard drive, SSD cage, or optical drive.",
      "Very fast memory near the CPU for frequently used data.",
      "Sits on the CPU heat sink and blows air across the processor."
    ],
    "answer": "Fills tiny gaps so heat can pass from the CPU to the heat sink.",
    "why": "Fills tiny gaps so heat can pass from the CPU to the heat sink."
  },
  {
    "part": "ATX Power Connector",
    "q": "What is the correct function of this part?",
    "image": "images/atx-power-connector.jpg",
    "choices": [
      "The 24-pin plug that delivers main power to the motherboard.",
      "The metal plate at the back of the case that lines up with the motherboard ports.",
      "Stores permanent startup instructions that stay even when power is off.",
      "An older long expansion slot for cards such as sound, network, or modem."
    ],
    "answer": "The 24-pin plug that delivers main power to the motherboard.",
    "why": "The 24-pin plug that delivers main power to the motherboard."
  },
  {
    "part": "Front Panel Connectors",
    "q": "What is the correct function of this part?",
    "image": "images/front-panel-connectors.jpg",
    "choices": [
      "Attach the power button, reset button, and case lights to the board.",
      "Small caps on pins that set hardware options such as clearing CMOS.",
      "Brings electricity from the power supply to a SATA drive.",
      "An older slot used only for a graphics card; newer boards use PCIe."
    ],
    "answer": "Attach the power button, reset button, and case lights to the board.",
    "why": "Attach the power button, reset button, and case lights to the board."
  },
  {
    "part": "Drive Bay",
    "q": "What is the correct function of this part?",
    "image": "images/drive-bay.jpg",
    "choices": [
      "A space in the case that holds a hard drive, SSD cage, or optical drive.",
      "Metal spacers that hold the motherboard above the case to prevent shorts.",
      "Reads and writes small files on floppy disks in older systems.",
      "The L-shaped motherboard connector where a SATA data cable plugs in."
    ],
    "answer": "A space in the case that holds a hard drive, SSD cage, or optical drive.",
    "why": "A space in the case that holds a hard drive, SSD cage, or optical drive."
  },
  {
    "part": "I/O Shield",
    "q": "What is the correct function of this part?",
    "image": "images/i-o-shield.jpg",
    "choices": [
      "The metal plate at the back of the case that lines up with the motherboard ports.",
      "Makes beep codes during startup to help diagnose hardware problems.",
      "Sends high-quality video and audio to a monitor, often used on PCs.",
      "An optical drive that reads DVDs and CDs."
    ],
    "answer": "The metal plate at the back of the case that lines up with the motherboard ports.",
    "why": "The metal plate at the back of the case that lines up with the motherboard ports."
  },
  {
    "part": "Jumpers",
    "q": "What is the correct function of this part?",
    "image": "images/jumpers.jpg",
    "choices": [
      "Small caps on pins that set hardware options such as clearing CMOS.",
      "Very fast memory near the CPU for frequently used data.",
      "Sits on the CPU heat sink and blows air across the processor.",
      "A small fast storage board that plugs into the M.2 slot."
    ],
    "answer": "Small caps on pins that set hardware options such as clearing CMOS.",
    "why": "Small caps on pins that set hardware options such as clearing CMOS."
  },
  {
    "part": "Standoffs",
    "q": "What is the correct function of this part?",
    "image": "images/standoffs.jpg",
    "choices": [
      "Metal spacers that hold the motherboard above the case to prevent shorts.",
      "Stores permanent startup instructions that stay even when power is off.",
      "An older long expansion slot for cards such as sound, network, or modem.",
      "An older expansion card that connected to the internet through a phone line."
    ],
    "answer": "Metal spacers that hold the motherboard above the case to prevent shorts.",
    "why": "Metal spacers that hold the motherboard above the case to prevent shorts."
  },
  {
    "part": "Internal Speaker",
    "q": "What is the correct function of this part?",
    "image": "images/internal-speaker.jpg",
    "choices": [
      "Makes beep codes during startup to help diagnose hardware problems.",
      "Brings electricity from the power supply to a SATA drive.",
      "An older slot used only for a graphics card; newer boards use PCIe.",
      "Turns the computer on or tells it to shut down."
    ],
    "answer": "Makes beep codes during startup to help diagnose hardware problems.",
    "why": "Makes beep codes during startup to help diagnose hardware problems."
  },
  {
    "part": "Cache Memory",
    "q": "What is the correct function of this part?",
    "image": "images/cache-memory.jpg",
    "choices": [
      "Very fast memory near the CPU for frequently used data.",
      "Reads and writes small files on floppy disks in older systems.",
      "The L-shaped motherboard connector where a SATA data cable plugs in.",
      "USB jacks on the front of the case for easy plug-in."
    ],
    "answer": "Very fast memory near the CPU for frequently used data.",
    "why": "Very fast memory near the CPU for frequently used data."
  },
  {
    "part": "ROM",
    "q": "What is the correct function of this part?",
    "image": "images/rom.jpg",
    "choices": [
      "Stores permanent startup instructions that stay even when power is off.",
      "Sends high-quality video and audio to a monitor, often used on PCs.",
      "An optical drive that reads DVDs and CDs.",
      "A 4-pin power plug for older drives and some fans."
    ],
    "answer": "Stores permanent startup instructions that stay even when power is off.",
    "why": "Stores permanent startup instructions that stay even when power is off."
  },
  {
    "part": "SATA Power Cable",
    "q": "What is the correct function of this part?",
    "image": "images/sata-power-cable.jpg",
    "choices": [
      "Brings electricity from the power supply to a SATA drive.",
      "Sits on the CPU heat sink and blows air across the processor.",
      "A small fast storage board that plugs into the M.2 slot.",
      "Extra 6-pin or 8-pin power from the PSU to a graphics card."
    ],
    "answer": "Brings electricity from the power supply to a SATA drive.",
    "why": "Brings electricity from the power supply to a SATA drive."
  },
  {
    "part": "Floppy Disk Drive",
    "q": "What is the correct function of this part?",
    "image": "images/floppy-disk-drive.jpg",
    "choices": [
      "Reads and writes small files on floppy disks in older systems.",
      "An older long expansion slot for cards such as sound, network, or modem.",
      "An older expansion card that connected to the internet through a phone line.",
      "Colored round ports for microphone, speakers, and line input."
    ],
    "answer": "Reads and writes small files on floppy disks in older systems.",
    "why": "Reads and writes small files on floppy disks in older systems."
  },
  {
    "part": "DisplayPort",
    "q": "What is the correct function of this part?",
    "image": "images/displayport.jpg",
    "choices": [
      "Sends high-quality video and audio to a monitor, often used on PCs.",
      "An older slot used only for a graphics card; newer boards use PCIe.",
      "Turns the computer on or tells it to shut down.",
      "A 9-pin COM port that sends data one bit at a time."
    ],
    "answer": "Sends high-quality video and audio to a monitor, often used on PCs.",
    "why": "Sends high-quality video and audio to a monitor, often used on PCs."
  },
  {
    "part": "CPU Fan",
    "q": "What is the correct function of this part?",
    "image": "images/cpu-fan.jpg",
    "choices": [
      "Sits on the CPU heat sink and blows air across the processor.",
      "The L-shaped motherboard connector where a SATA data cable plugs in.",
      "USB jacks on the front of the case for easy plug-in.",
      "Sends digital video from the computer to a monitor."
    ],
    "answer": "Sits on the CPU heat sink and blows air across the processor.",
    "why": "Sits on the CPU heat sink and blows air across the processor."
  },
  {
    "part": "PCI Slot",
    "q": "What is the correct function of this part?",
    "image": "images/pci-slot.jpg",
    "choices": [
      "An older long expansion slot for cards such as sound, network, or modem.",
      "An optical drive that reads DVDs and CDs.",
      "A 4-pin power plug for older drives and some fans.",
      "Connects an external SATA drive to the system unit."
    ],
    "answer": "An older long expansion slot for cards such as sound, network, or modem.",
    "why": "An older long expansion slot for cards such as sound, network, or modem."
  },
  {
    "part": "AGP Slot",
    "q": "What is the correct function of this part?",
    "image": "images/agp-slot.jpg",
    "choices": [
      "An older slot used only for a graphics card; newer boards use PCIe.",
      "A small fast storage board that plugs into the M.2 slot.",
      "Extra 6-pin or 8-pin power from the PSU to a graphics card.",
      "A fast IEEE 1394 port used for cameras and external drives."
    ],
    "answer": "An older slot used only for a graphics card; newer boards use PCIe.",
    "why": "An older slot used only for a graphics card; newer boards use PCIe."
  },
  {
    "part": "SATA Port",
    "q": "What is the correct function of this part?",
    "image": "images/sata-port.jpg",
    "choices": [
      "The L-shaped motherboard connector where a SATA data cable plugs in.",
      "An older expansion card that connected to the internet through a phone line.",
      "Colored round ports for microphone, speakers, and line input.",
      "The metal plate on an expansion card, or a cover for an empty slot."
    ],
    "answer": "The L-shaped motherboard connector where a SATA data cable plugs in.",
    "why": "The L-shaped motherboard connector where a SATA data cable plugs in."
  },
  {
    "part": "DVD Drive",
    "q": "What is the correct function of this part?",
    "image": "images/dvd-drive.jpg",
    "choices": [
      "An optical drive that reads DVDs and CDs.",
      "Turns the computer on or tells it to shut down.",
      "A 9-pin COM port that sends data one bit at a time.",
      "Store and smooth electricity on the motherboard and in the power supply."
    ],
    "answer": "An optical drive that reads DVDs and CDs.",
    "why": "An optical drive that reads DVDs and CDs."
  },
  {
    "part": "NVMe SSD",
    "q": "What is the correct function of this part?",
    "image": "images/nvme-ssd.jpg",
    "choices": [
      "A small fast storage board that plugs into the M.2 slot.",
      "USB jacks on the front of the case for easy plug-in.",
      "Sends digital video from the computer to a monitor.",
      "The small 4-pin power plug for a floppy disk drive."
    ],
    "answer": "A small fast storage board that plugs into the M.2 slot.",
    "why": "A small fast storage board that plugs into the M.2 slot."
  },
  {
    "part": "Modem Card",
    "q": "What is the correct function of this part?",
    "image": "images/modem-card.jpg",
    "choices": [
      "An older expansion card that connected to the internet through a phone line.",
      "A 4-pin power plug for older drives and some fans.",
      "Connects an external SATA drive to the system unit.",
      "A ribbon cable that carries data to the floppy disk drive."
    ],
    "answer": "An older expansion card that connected to the internet through a phone line.",
    "why": "An older expansion card that connected to the internet through a phone line."
  },
  {
    "part": "Power Button",
    "q": "What is the correct function of this part?",
    "image": "images/power-button.jpg",
    "choices": [
      "Turns the computer on or tells it to shut down.",
      "Extra 6-pin or 8-pin power from the PSU to a graphics card.",
      "A fast IEEE 1394 port used for cameras and external drives.",
      "An older LPT port used mainly to connect a printer."
    ],
    "answer": "Turns the computer on or tells it to shut down.",
    "why": "Turns the computer on or tells it to shut down."
  },
  {
    "part": "Front USB Ports",
    "q": "What is the correct function of this part?",
    "image": "images/front-usb-ports.jpg",
    "choices": [
      "USB jacks on the front of the case for easy plug-in.",
      "Colored round ports for microphone, speakers, and line input.",
      "The metal plate on an expansion card, or a cover for an empty slot.",
      "The rocker on the back of the power supply that turns wall power on or off."
    ],
    "answer": "USB jacks on the front of the case for easy plug-in.",
    "why": "USB jacks on the front of the case for easy plug-in."
  },
  {
    "part": "Molex Connector",
    "q": "What is the correct function of this part?",
    "image": "images/molex-connector.jpg",
    "choices": [
      "A 4-pin power plug for older drives and some fans.",
      "A 9-pin COM port that sends data one bit at a time.",
      "Store and smooth electricity on the motherboard and in the power supply.",
      "Houses and protects the internal parts and helps keep them cool."
    ],
    "answer": "A 4-pin power plug for older drives and some fans.",
    "why": "A 4-pin power plug for older drives and some fans."
  },
  {
    "part": "PCIe Power Plug",
    "q": "What is the correct function of this part?",
    "image": "images/pcie-power-plug.jpg",
    "choices": [
      "Extra 6-pin or 8-pin power from the PSU to a graphics card.",
      "Sends digital video from the computer to a monitor.",
      "The small 4-pin power plug for a floppy disk drive.",
      "Processes instructions and runs programs; it is the brain of the computer."
    ],
    "answer": "Extra 6-pin or 8-pin power from the PSU to a graphics card.",
    "why": "Extra 6-pin or 8-pin power from the PSU to a graphics card."
  },
  {
    "part": "Audio Jacks",
    "q": "What is the correct function of this part?",
    "image": "images/audio-jacks.jpg",
    "choices": [
      "Colored round ports for microphone, speakers, and line input.",
      "Connects an external SATA drive to the system unit.",
      "A ribbon cable that carries data to the floppy disk drive.",
      "Holds the processor on the motherboard and connects it electrically."
    ],
    "answer": "Colored round ports for microphone, speakers, and line input.",
    "why": "Colored round ports for microphone, speakers, and line input."
  },
  {
    "part": "Serial Port",
    "q": "What is the correct function of this part?",
    "image": "images/serial-port.jpg",
    "choices": [
      "A 9-pin COM port that sends data one bit at a time.",
      "A fast IEEE 1394 port used for cameras and external drives.",
      "An older LPT port used mainly to connect a printer.",
      "The main circuit board that connects all parts so they can work together."
    ],
    "answer": "A 9-pin COM port that sends data one bit at a time.",
    "why": "A 9-pin COM port that sends data one bit at a time."
  },
  {
    "part": "DVI Port",
    "q": "What is the correct function of this part?",
    "image": "images/dvi-port.jpg",
    "choices": [
      "Sends digital video from the computer to a monitor.",
      "The metal plate on an expansion card, or a cover for an empty slot.",
      "The rocker on the back of the power supply that turns wall power on or off.",
      "Temporarily stores data and programs the computer is using right now."
    ],
    "answer": "Sends digital video from the computer to a monitor.",
    "why": "Sends digital video from the computer to a monitor."
  },
  {
    "part": "eSATA Port",
    "q": "What is the correct function of this part?",
    "image": "images/esata-port.jpg",
    "choices": [
      "Connects an external SATA drive to the system unit.",
      "Store and smooth electricity on the motherboard and in the power supply.",
      "Houses and protects the internal parts and helps keep them cool.",
      "Holds the RAM modules and connects them to the motherboard."
    ],
    "answer": "Connects an external SATA drive to the system unit.",
    "why": "Connects an external SATA drive to the system unit."
  },
  {
    "part": "FireWire Port",
    "q": "What is the correct function of this part?",
    "image": "images/firewire-port.jpg",
    "choices": [
      "A fast IEEE 1394 port used for cameras and external drives.",
      "The small 4-pin power plug for a floppy disk drive.",
      "Processes instructions and runs programs; it is the brain of the computer.",
      "Converts AC from the wall into DC power for the parts."
    ],
    "answer": "A fast IEEE 1394 port used for cameras and external drives.",
    "why": "A fast IEEE 1394 port used for cameras and external drives."
  },
  {
    "part": "Slot Bracket",
    "q": "What is the correct function of this part?",
    "image": "images/slot-bracket.jpg",
    "choices": [
      "The metal plate on an expansion card, or a cover for an empty slot.",
      "A ribbon cable that carries data to the floppy disk drive.",
      "Holds the processor on the motherboard and connects it electrically.",
      "Stores files and the operating system on spinning disks even when power is off."
    ],
    "answer": "The metal plate on an expansion card, or a cover for an empty slot.",
    "why": "The metal plate on an expansion card, or a cover for an empty slot."
  },
  {
    "part": "Capacitors",
    "q": "What is the correct function of this part?",
    "image": "images/capacitors.jpg",
    "choices": [
      "Store and smooth electricity on the motherboard and in the power supply.",
      "An older LPT port used mainly to connect a printer.",
      "The main circuit board that connects all parts so they can work together.",
      "Carries data between a SATA storage drive and the motherboard."
    ],
    "answer": "Store and smooth electricity on the motherboard and in the power supply.",
    "why": "Store and smooth electricity on the motherboard and in the power supply."
  },
  {
    "part": "Berg Connector",
    "q": "What is the correct function of this part?",
    "image": "images/berg-connector.jpg",
    "choices": [
      "The small 4-pin power plug for a floppy disk drive.",
      "The rocker on the back of the power supply that turns wall power on or off.",
      "Temporarily stores data and programs the computer is using right now.",
      "Reads data stored on compact discs."
    ],
    "answer": "The small 4-pin power plug for a floppy disk drive.",
    "why": "The small 4-pin power plug for a floppy disk drive."
  },
  {
    "part": "Floppy Cable",
    "q": "What is the correct function of this part?",
    "image": "images/floppy-cable.jpg",
    "choices": [
      "A ribbon cable that carries data to the floppy disk drive.",
      "Houses and protects the internal parts and helps keep them cool.",
      "Holds the RAM modules and connects them to the motherboard.",
      "Pulls heat away from the CPU or GPU to help prevent overheating."
    ],
    "answer": "A ribbon cable that carries data to the floppy disk drive.",
    "why": "A ribbon cable that carries data to the floppy disk drive."
  },
  {
    "part": "Parallel Port",
    "q": "What is the correct function of this part?",
    "image": "images/parallel-port.jpg",
    "choices": [
      "An older LPT port used mainly to connect a printer.",
      "Processes instructions and runs programs; it is the brain of the computer.",
      "Converts AC from the wall into DC power for the parts.",
      "Provide ports so external devices can connect to the computer."
    ],
    "answer": "An older LPT port used mainly to connect a printer.",
    "why": "An older LPT port used mainly to connect a printer."
  },
  {
    "part": "PSU Switch",
    "q": "What is the correct function of this part?",
    "image": "images/psu-switch.jpg",
    "choices": [
      "The rocker on the back of the power supply that turns wall power on or off.",
      "Holds the processor on the motherboard and connects it electrically.",
      "Stores files and the operating system on spinning disks even when power is off.",
      "An older ribbon cable that connects hard drives or optical drives to the motherboard."
    ],
    "answer": "The rocker on the back of the power supply that turns wall power on or off.",
    "why": "The rocker on the back of the power supply that turns wall power on or off."
  }
];
