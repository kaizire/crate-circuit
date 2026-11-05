# Creates empty COC 3 practice VMs on this PC.
# Guest installers (Windows Server, AD, DHCP, DNS, client OS) run inside the VM only.
# VMware Workstation is used when it is installed; otherwise VirtualBox.

$ErrorActionPreference = "Stop"
$base = Join-Path $env:USERPROFILE "Documents\CrateCircuit-COC3"
New-Item -ItemType Directory -Force -Path $base | Out-Null

function Write-Vmx {
  param(
    [string]$Path,
    [string]$Name,
    [string]$GuestOs,
    [int]$MemoryMb,
    [string]$DiskFile
  )

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
ide1:0.present = "TRUE"
ide1:0.deviceType = "cdrom-image"
ide1:0.fileName = "auto detect"
ide1:0.startConnected = "FALSE"
ethernet0.present = "TRUE"
ethernet0.connectionType = "nat"
ethernet0.virtualDev = "e1000"
ethernet1.present = "TRUE"
ethernet1.connectionType = "hostonly"
ethernet1.virtualDev = "e1000"
usb.present = "TRUE"
ehci.present = "TRUE"
sound.present = "FALSE"
annotation = "CrateCircuit COC 3 lab. Install the OS and server roles inside this VM, not on the host PC."
"@ | Set-Content -Path $Path -Encoding ASCII
}

function Ensure-VMwareVm {
  param(
    [string]$Name,
    [string]$GuestOs,
    [int]$MemoryMb,
    [int]$DiskGb
  )

  $diskTool = "C:\Program Files (x86)\VMware\VMware Workstation\vmware-vdiskmanager.exe"
  $folder = Join-Path $base $Name
  $vmx = Join-Path $folder "$Name.vmx"
  $vmdk = Join-Path $folder "$Name.vmdk"
  if (Test-Path $vmx) {
    Write-Host "VM $Name already exists. Skipping."
    return $vmx
  }

  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  & $diskTool -c -s "${DiskGb}GB" -a lsilogic -t 0 $vmdk
  if ($LASTEXITCODE -ne 0) { throw "Could not create disk for $Name" }
  Write-Vmx -Path $vmx -Name $Name -GuestOs $GuestOs -MemoryMb $MemoryMb -DiskFile "$Name.vmdk"
  Write-Host "Created $Name"
  return $vmx
}

$vmware = "C:\Program Files (x86)\VMware\VMware Workstation\vmware.exe"
$diskTool = "C:\Program Files (x86)\VMware\VMware Workstation\vmware-vdiskmanager.exe"

if ((Test-Path $vmware) -and (Test-Path $diskTool)) {
  Write-Host "Using VMware Workstation. Guest installers will run inside the VMs."
  $server = Ensure-VMwareVm -Name "COC3-SERVER" -GuestOs "windows2019srv-64" -MemoryMb 4096 -DiskGb 60
  $client = Ensure-VMwareVm -Name "COC3-CLIENT" -GuestOs "windows9-64" -MemoryMb 2048 -DiskGb 40
  Write-Host ""
  Write-Host "Next: open VMware Workstation, add these VMs if they are not listed:"
  Write-Host "  $server"
  Write-Host "  $client"
  Write-Host "Attach a Microsoft evaluation ISO to each VM, start the VM, and install Windows inside it."
  Write-Host "Do not run those installers on this PC."
  Write-Host "ISOs: https://www.microsoft.com/evalcenter"
  exit 0
}

$vbox = @(
  "$env:ProgramFiles\Oracle\VirtualBox\VBoxManage.exe",
  "${env:ProgramFiles(x86)}\Oracle\VirtualBox\VBoxManage.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $vbox) {
  Write-Host "Install VMware Workstation or VirtualBox first. That is the only host program this lab needs."
  Write-Host "Then run this script again. Do not install Windows Server on this PC."
  exit 1
}

function Ensure-VBoxVm {
  param(
    [string]$Name,
    [string]$OsType,
    [int]$MemoryMb,
    [int]$DiskGb
  )

  $listed = & $vbox list vms
  if ($listed -match [regex]::Escape("`"$Name`"")) {
    Write-Host "VM $Name already exists. Skipping."
    return
  }

  $folder = Join-Path $base $Name
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $disk = Join-Path $folder "$Name.vdi"
  & $vbox createvm --name $Name --ostype $OsType --register --basefolder $base | Out-Host
  & $vbox modifyvm $Name --memory $MemoryMb --cpus 2 --vram 128 --nic1 nat --nic2 intnet --intnet2 coc3-lab --boot1 dvd --boot2 disk | Out-Host
  & $vbox createmedium disk --filename $disk --size ($DiskGb * 1024) --format VDI | Out-Host
  & $vbox storagectl $Name --name "SATA" --add sata --controller IntelAhci | Out-Host
  & $vbox storageattach $Name --storagectl "SATA" --port 0 --device 0 --type hdd --medium $disk | Out-Host
  & $vbox storageattach $Name --storagectl "SATA" --port 1 --device 0 --type dvddrive --medium emptydrive | Out-Host
  Write-Host "Created $Name"
}

Ensure-VBoxVm -Name "COC3-SERVER" -OsType "Windows2022_64" -MemoryMb 4096 -DiskGb 60
Ensure-VBoxVm -Name "COC3-CLIENT" -OsType "Windows10_64" -MemoryMb 2048 -DiskGb 40
Write-Host "Attach evaluation ISOs in VirtualBox and install Windows inside each VM, not on this PC."
Write-Host "ISOs: https://www.microsoft.com/evalcenter"
