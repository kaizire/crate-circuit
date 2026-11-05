# Run INSIDE COC3-SERVER as Administrator after Windows Server is installed.
# Do not run this on the teacher PC.

$ErrorActionPreference = "Stop"
$domain = "crate.lab"
$netbios = "CRATE"
$share = "C:\Shares\Class"

Write-Host "Enabling Remote Desktop..."
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue

Write-Host "Installing AD DS, DNS, DHCP, and File Server..."
Install-WindowsFeature AD-Domain-Services, DNS, DHCP, FS-FileServer, RSAT-AD-Tools, RSAT-DHCP, RSAT-DNS-Server -IncludeManagementTools | Out-Null

$ntds = Get-Service NTDS -ErrorAction SilentlyContinue
if (-not $ntds -or $ntds.Status -ne "Running") {
  $pass = Read-Host "Type a Directory Services Restore Mode password (use this only inside the VM)" -AsSecureString
  Write-Host "Creating domain $domain. The server will restart."
  Install-ADDSForest -DomainName $domain -DomainNetbiosName $netbios -SafeModeAdministratorPassword $pass -InstallDns -Force
  exit 0
}

Write-Host "Domain is up. Configuring lab network, DHCP, and share..."
$lab = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Sort-Object ifIndex
if ($lab.Count -ge 2) {
  $nic = $lab[1].Name
  New-NetIPAddress -InterfaceAlias $nic -IPAddress "192.168.10.1" -PrefixLength 24 -ErrorAction SilentlyContinue
  Set-DnsClientServerAddress -InterfaceAlias $nic -ServerAddresses "127.0.0.1" -ErrorAction SilentlyContinue
}

if (-not (Get-DhcpServerv4Scope -ErrorAction SilentlyContinue | Where-Object { $_.ScopeId -eq "192.168.10.0" })) {
  Add-DhcpServerv4Scope -Name "COC3-Lab" -StartRange 192.168.10.50 -EndRange 192.168.10.200 -SubnetMask 255.255.255.0 -State Active
  Set-DhcpServerv4OptionValue -ScopeId 192.168.10.0 -Router 192.168.10.1 -DnsServer 192.168.10.1 -DnsDomain $domain
  Add-DhcpServerSecurityGroup -ErrorAction SilentlyContinue
  Add-DhcpServerInDC -DnsName ("server." + $domain) -ErrorAction SilentlyContinue
}

New-Item -ItemType Directory -Force -Path $share | Out-Null
if (-not (Get-SmbShare -Name "Class" -ErrorAction SilentlyContinue)) {
  New-SmbShare -Name "Class" -Path $share -FullAccess "Everyone"
}

try {
  if (-not (Get-ADUser -Filter "SamAccountName -eq 'student1'" -ErrorAction SilentlyContinue)) {
    $userPass = ConvertTo-SecureString "Student#2026" -AsPlainText -Force
    New-ADUser -Name "Student One" -SamAccountName "student1" -AccountPassword $userPass -Enabled $true -ChangePasswordAtLogon $true
  }
} catch {
  Write-Host "User student1 can be added later in Active Directory Users and Computers."
}

Write-Host ""
Write-Host "SERVER READY"
Write-Host "Domain: $domain"
Write-Host "Share: \\server\Class  or  \\192.168.10.1\Class"
Write-Host "RDP is on. In the staff dashboard, share this VM's Bridged IPv4 with the class."
ipconfig
