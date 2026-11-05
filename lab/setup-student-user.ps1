# Run inside COC3-SERVER as Administrator.
# Creates the student logon so phones do not need a teacher account.

$ErrorActionPreference = "Stop"
$User = "student"
$Plain = "crate-lab"
$Password = ConvertTo-SecureString $Plain -AsPlainText -Force

function Enable-RemoteDesktop {
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections -Value 0
  Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue
}

function Add-RdpUser([string]$Name) {
  try { Add-LocalGroupMember -Group "Remote Desktop Users" -Member $Name -ErrorAction Stop } catch { }
  try { Add-LocalGroupMember -Group "Users" -Member $Name -ErrorAction SilentlyContinue } catch { }
}

Enable-RemoteDesktop

$local = Get-LocalUser -Name $User -ErrorAction SilentlyContinue
if ($local) {
  Set-LocalUser -Name $User -Password $Password -PasswordNeverExpires $true
} else {
  try {
    New-LocalUser -Name $User -Password $Password -FullName "CrateCircuit Student" -Description "COC 3 student logon" -PasswordNeverExpires
  } catch {
    if (Get-Module -ListAvailable -Name ActiveDirectory) {
      Import-Module ActiveDirectory
      $existing = Get-ADUser -Filter "SamAccountName -eq '$User'" -ErrorAction SilentlyContinue
      if (-not $existing) {
        New-ADUser -Name $User -SamAccountName $User -AccountPassword $Password -Enabled $true -PasswordNeverExpires $true -ChangePasswordAtLogon $false
      } else {
        Set-ADAccountPassword -Identity $User -NewPassword $Password -Reset
        Enable-ADAccount -Identity $User
      }
    } else {
      throw
    }
  }
}

Add-RdpUser $User
try { Add-ADGroupMember -Identity "Remote Desktop Users" -Members $User -ErrorAction SilentlyContinue } catch { }

Write-Host "Student logon is ready: $User / $Plain"
Write-Host "Remote Desktop is on. Phones should not use a teacher account."
ipconfig | Select-String "IPv4"
