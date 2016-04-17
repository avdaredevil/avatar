param([Switch]$AsWorker)
$Cred = "AP","AProcks1#","admin"
Write-Host -nonewline "Logging in as: ";Write-Host -f 2 $Cred[0]
mongo -u $Cred[0] -p $Cred[1] --authenticationDatabase $Cred[2] JMeter-Test