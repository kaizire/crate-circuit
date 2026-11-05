# Run on the lab PC (not inside the VM).
# Starts COC3-SERVER and, if you pass the VM administrator password,
# creates student / crate-lab inside the guest.

param(
  [string]$GuestUser = "Administrator",
  [string]$GuestPassword
)

$ErrorActionPreference = "Stop"
$vmrun = "C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe"
if (-not (Test-Path $vmrun)) {
  throw "VMware Workstation vmrun.exe was not found."
}

$candidates = @(
  (Join-Path $env:USERPROFILE "Documents\CrateCircuit-COC3\COC3-SERVER\COC3-SERVER.vmx"),
  (Join-Path $env:USERPROFILE "CrateCircuit-COC3\COC3-SERVER\COC3-SERVER.vmx")
)
$vmx = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $vmx) {
  $vmx = Get-ChildItem -Path (Join-Path $env:USERPROFILE "Documents") -Filter "COC3-SERVER.vmx" -Recurse -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $vmx) {
  throw "COC3-SERVER.vmx was not found. Run create-coc3-vms.ps1 first, then install Windows inside the VM."
}

Write-Host "Starting $vmx in the VMware window"
& $vmrun -T ws start $vmx gui
if ($LASTEXITCODE -ne 0) { throw "Could not start COC3-SERVER." }

if (-not $GuestPassword) {
  Write-Host "VM is starting. To create the student logon automatically, run:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\start-coc3-server.ps1 -GuestUser Administrator -GuestPassword YOUR_VM_ADMIN_PASSWORD"
  Write-Host "Or copy setup-student-user.ps1 into the VM and run it as Administrator."
  exit 0
}

Write-Host "Waiting for VMware Tools in the guest..."
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  $state = (& $vmrun -T ws checkToolsState $vmx 2>$null | Out-String).Trim()
  if ($state -match "running") { $ready = $true; break }
  Start-Sleep -Seconds 5
}
if (-not $ready) {
  throw "VMware Tools is not ready. Finish Windows setup, install VMware Tools, then run this again with -GuestPassword."
}

$guestScript = Join-Path $PSScriptRoot "setup-student-user.ps1"
if (-not (Test-Path $guestScript)) {
  throw "setup-student-user.ps1 is missing next to this script."
}

$guestPath = "C:\Windows\Temp\setup-student-user.ps1"
& $vmrun -T ws -gu $GuestUser -gp $GuestPassword copyFileFromHostToGuest $vmx $guestScript $guestPath
if ($LASTEXITCODE -ne 0) {
  throw "Could not copy the script into the VM. Check the guest administrator user and password."
}

& $vmrun -T ws -gu $GuestUser -gp $GuestPassword runProgramInGuest $vmx cmd.exe "/c powershell.exe -ExecutionPolicy Bypass -File $guestPath"
if ($LASTEXITCODE -ne 0) {
  throw "The student-user script did not run inside the VM."
}

Write-Host "COC3-SERVER is running. Student logon: student / crate-lab"
Write-Host "Share the VM IPv4 address on the staff page so phones can connect."
