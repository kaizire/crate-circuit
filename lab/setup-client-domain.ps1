# Run INSIDE COC3-CLIENT as Administrator after Windows is installed.
# Do not run this on the teacher PC.

$ErrorActionPreference = "Stop"
$domain = "crate.lab"

Write-Host "Enabling Remote Desktop..."
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue

$part = (Get-ComputerInfo).CsDomain
if ($part -and $part -ieq $domain) {
  Write-Host "This PC is already in $domain."
  ipconfig
  exit 0
}

$up = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Sort-Object ifIndex
if ($up.Count -ge 2) {
  Set-DnsClientServerAddress -InterfaceAlias $up[1].Name -ServerAddresses "192.168.10.1"
}

Write-Host "Join $domain. Use the SERVER Administrator account."
$cred = Get-Credential -Message "Domain admin for $domain (example CRATE\Administrator)"
Add-Computer -DomainName $domain -Credential $cred -Force
Write-Host "CLIENT READY. The PC will restart. Then log on as $domain\student1"
Restart-Computer -Force
