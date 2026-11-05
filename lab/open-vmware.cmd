@echo off
setlocal
set "VMRUN=C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe"
set "VMWARE=C:\Program Files (x86)\VMware\VMware Workstation\vmware.exe"
set "VMX=%USERPROFILE%\Documents\CrateCircuit-COC3\COC3-SERVER\COC3-SERVER.vmx"

if exist "%VMWARE%" start "" "%VMWARE%"

if exist "%VMRUN%" if exist "%VMX%" (
  "%VMRUN%" -T ws start "%VMX%" gui
  exit /b 0
)

if exist "%VMWARE%" exit /b 0

echo Install VMware Workstation on this PC first.
pause
