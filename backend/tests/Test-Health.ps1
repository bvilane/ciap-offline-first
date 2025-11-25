# Test-Health.ps1
# PowerShell script to test CIAP health endpoint and verify response structure

param(
    [string]$ApiUrl = "https://ciap-backend-prod.onrender.com/api/v1"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "CIAP Health Endpoint Test" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Testing: $ApiUrl/health`n" -ForegroundColor Yellow

try {
    # Make request
    $response = Invoke-RestMethod -Uri "$ApiUrl/health" -Method Get -ErrorAction Stop
    
    Write-Host "Response received successfully!`n" -ForegroundColor Green
    
    # Display response
    Write-Host "Response Body:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
    Write-Host ""
    
    # Validate fields
    Write-Host "Validation Checks:" -ForegroundColor Cyan
    
    $checks = @{
        "Status field present" = $null -ne $response.status
        "Status value is 'ok'" = $response.status -eq "ok"
        "Database field present" = $null -ne $response.database
        "Database value is 'connected'" = $response.database -eq "connected"
        "Uptime field present" = $null -ne $response.uptime
        "Environment field present" = $null -ne $response.environment
    }
    
    $allPassed = $true
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "✓ $($check.Key): PASS" -ForegroundColor Green
        } else {
            Write-Host "✗ $($check.Key): FAIL" -ForegroundColor Red
            $allPassed = $false
        }
    }
    
    Write-Host ""
    
    if ($allPassed) {
        Write-Host "✓ All checks passed! Health endpoint is working correctly." -ForegroundColor Green
    } else {
        Write-Host "✗ Some checks failed. Review the response structure." -ForegroundColor Red
    }
    
    Write-Host "`nHealth Status Summary:" -ForegroundColor Cyan
    Write-Host "  API Status: $($response.status)" -ForegroundColor $(if ($response.status -eq "ok") { "Green" } else { "Red" })
    Write-Host "  Database: $($response.database)" -ForegroundColor $(if ($response.database -eq "connected") { "Green" } else { "Red" })
    Write-Host "  Uptime: $($response.uptime)" -ForegroundColor Yellow
    Write-Host "  Environment: $($response.environment)" -ForegroundColor Yellow
    
    Write-Host "`n============================================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ Health check failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Cyan
    exit 1
}

# Additional frontend connectivity test
Write-Host "`nTesting Frontend Connectivity..." -ForegroundColor Cyan

try {
    $frontendResponse = Invoke-WebRequest -Uri "https://ciap-platform.netlify.app" -Method Head -ErrorAction Stop
    Write-Host "✓ Frontend is accessible (HTTP $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend connectivity issue: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "============================================================`n" -ForegroundColor Cyan