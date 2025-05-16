# Start-DevEnvironment.ps1
# Script to start both frontend and backend development servers

# Function to handle errors
function Handle-Error {
    param (
        [string]$ErrorMessage
    )
    Write-Host "Error: $ErrorMessage" -ForegroundColor Red
    exit 1
}

# Store the original directory to return to it later
$originalDirectory = Get-Location

# Starting Frontend
Write-Host "Starting Frontend Setup..." -ForegroundColor Cyan

try {
    # Navigate to frontend directory
    Set-Location -Path "frontend\RP" -ErrorAction Stop
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm i
    
    # Check if npm install was successful
    if ($LASTEXITCODE -ne 0) {
        Handle-Error "Frontend dependency installation failed."
    }
    
    Write-Host "Starting frontend development server..." -ForegroundColor Green
    # Start the development server in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$((Get-Location).Path)'; npm run dev"
}
catch {
    Handle-Error "Failed to set up frontend: $_"
}

# Return to the original directory
Set-Location $originalDirectory

# Starting Backend
Write-Host "Starting Backend Setup..." -ForegroundColor Cyan

try {
    # Navigate to backend directory
    Set-Location -Path "backend\server" -ErrorAction Stop
    Write-Host "Starting Django development server..." -ForegroundColor Green
    # Start the Django server in the current PowerShell window
    python manage.py runserver 0.0.0.0:8000
}
catch {
    Handle-Error "Failed to set up backend: $_"
}

# This part will only execute if the Django server is stopped
Write-Host "Backend server has stopped. Exiting script." -ForegroundColor Yellow

# Return to the original directory
Set-Location $originalDirectory