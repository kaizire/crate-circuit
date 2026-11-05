# Teacher auto-setup for COC3-SERVER and COC3-CLIENT on the lab PC.
# Creates/starts the VMs. Windows and roles install INSIDE those VMs, not on this PC.

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$base = Join-Path $env:USERPROFILE "Documents\CrateCircuit-COC3"
$isoDir = Join-Path $base "iso"
$guestDir = Join-Path $base "guest-scripts"
New-Item -ItemType Directory -Force -Path $base, $isoDir, $guestDir | Out-Null

function Get-GuestScript([string]$name) {
  $local = Join-Path $here $name
  $dest = Join-Path $guestDir $name
  if (Test-Path $local) {
    Copy-Item -Force $local $dest
    return
  }
  $url = "https://raw.githubusercontent.com/kaizire/crate-circuit/main/lab/$name"
  try {
    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
  } catch {
    Write-Host "Could not download $name. Save it from the staff dashboard into $guestDir"
  }
}

Get-GuestScript "setup-server-roles.ps1"
Get-GuestScript "setup-client-domain.ps1"

function Find-Iso([string]$pattern) {
  Get-ChildItem -Path $isoDir, "$env:USERPROFILE\Downloads", "$env:USERPROFILE\Documents" -Filter *.iso -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match $pattern } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1 -ExpandProperty FullName
}

function Write-Vmx {
  param([string]$Path, [string]$Name, [string]$GuestOs, [int]$MemoryMb, [string]$DiskFile, [string]$Iso)
  $cd = if ($Iso) {
    @"
ide1:0.present = "TRUE"
ide1:0.deviceType = "cdrom-image"
ide1:0.fileName = "$($Iso.Replace('\','\\'))"
ide1:0.startConnected = "TRUE"
"@
  } else {
    @"
ide1:0.present = "TRUE"
ide1:0.deviceType = "cdrom-image"
ide1:0.fileName = "auto detect"
ide1:0.startConnected = "FALSE"
"@
  }

  @"
.encoding = "UTF-8"
config.version = "8"
virtualHW.version = "19"
displayName = "$Name"
guestOS = "$GuestOs"
memsize = "$MemoryMb"
numvcpus = "2"
scsi0.present = "TRUE"
scsi0.virtualDev = "lsilogic"
scsi0:0.present = "TRUE"
scsi0:0.fileName = "$DiskFile"
$cd
ethernet0.present = "TRUE"
ethernet0.connectionType = "bridged"
ethernet0.virtualDev = "e1000"
ethernet1.present = "TRUE"
ethernet1.connectionType = "hostonly"
ethernet1.virtualDev = "e1000"
usb.present = "TRUE"
ehci.present = "TRUE"
sound.present = "FALSE"
annotation = "CrateCircuit COC 3. Install OS and roles inside this VM only."
"@ | Set-Content -Path $Path -Encoding ASCII
}

function Ensure-VMwareVm([string]$Name, [string]$GuestOs, [int]$MemoryMb, [int]$DiskGb, [string]$Iso) {
  $diskTool = "C:\Program Files (x86)\VMware\VMware Workstation\vmware-vdiskmanager.exe"
  $folder = Join-Path $base $Name
  $vmx = Join-Path $folder "$Name.vmx"
  $vmdk = Join-Path $folder "$Name.vmdk"
  if (-not (Test-Path $vmx)) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    & $diskTool -c -s "${DiskGb}GB" -a lsilogic -t 0 $vmdk
    if ($LASTEXITCODE -ne 0) { throw "Could not create disk for $Name" }
    Write-Host "Created $Name"
  } else {
    Write-Host "$Name already exists."
  }
  Write-Vmx -Path $vmx -Name $Name -GuestOs $GuestOs -MemoryMb $MemoryMb -DiskFile "$Name.vmdk" -Iso $Iso
  return $vmx
}

$vmware = "C:\Program Files (x86)\VMware\VMware Workstation\vmware.exe"
$vmrun = "C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe"
$diskTool = "C:\Program Files (x86)\VMware\VMware Workstation\vmware-vdiskmanager.exe"

$serverIso = Find-Iso "server|2022|2019|2025"
$clientIso = Find-Iso "win(dows)?[\s_-]*1[01]|client|eval"

if (-not ((Test-Path $vmware) -and (Test-Path $diskTool))) {
  Write-Host "Install VMware Workstation on this lab PC first, then run this again."
  exit 1
}

Write-Host "Auto-setup: COC3-SERVER and COC3-CLIENT"
Write-Host "Guest installers stay in the VMs."
if ($serverIso) { Write-Host "Server ISO: $serverIso" } else { Write-Host "No Server ISO found. Put one in $isoDir" }
if ($clientIso) { Write-Host "Client ISO: $clientIso" } else { Write-Host "No Client ISO found. Put one in $isoDir" }

$server = Ensure-VMwareVm "COC3-SERVER" "windows2019srv-64" 4096 60 $serverIso
$client = Ensure-VMwareVm "COC3-CLIENT" "windows9-64" 2048 40 $clientIso

if (Test-Path $vmrun) {
  Write-Host "Starting both VMs..."
  & $vmrun start $server gui
  & $vmrun start $client gui
} else {
  Start-Process $vmware
}

$note = @"
COC 3 auto-setup finished on the lab PC.

1. Finish Windows setup INSIDE each VM window (not on this desktop).
2. On COC3-SERVER, copy and run as Administrator:
   $guestDir\setup-server-roles.ps1
   It creates domain crate.lab, DNS, DHCP (192.168.10.x), share Class, user student1.
   The server restarts once. Run the same script again after the restart.
3. On COC3-CLIENT, copy and run as Administrator:
   $guestDir\setup-client-domain.ps1
   Join crate.lab when asked.
4. In each VM run ipconfig. Share those Bridged IPv4 addresses in the staff dashboard:
   COC Server bay and PC Client bay.
5. Students open https://kaizire.github.io/crate-circuit/coc3.html

ISOs (evaluation only): https://www.microsoft.com/evalcenter
Put ISO files in: $isoDir
Then run this auto-setup again to attach them.
"@
$notePath = Join-Path $base "TEACHER-NEXT.txt"
Set-Content -Path $notePath -Value $note -Encoding UTF8
Write-Host $note
Write-Host "Saved: $notePath"
Start-Process notepad $notePath
