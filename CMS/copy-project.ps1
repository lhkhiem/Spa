# PowerShell script to copy project to a new repository
# Usage: .\copy-project.ps1 -DestinationPath "C:\path\to\new\repo"

param(
    [Parameter(Mandatory=$true)]
    [string]$DestinationPath
)

$CurrentDir = Get-Location

Write-Host "📦 Copying project to: $DestinationPath" -ForegroundColor Cyan

# Create destination directory if it doesn't exist
if (-not (Test-Path $DestinationPath)) {
    New-Item -ItemType Directory -Path $DestinationPath -Force | Out-Null
}

# Copy files excluding common ignore patterns
$ExcludePatterns = @(
    '.git',
    'node_modules',
    '.next',
    'dist',
    '.env',
    '.env.local',
    '.turbo',
    '.vercel',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    'backend\storage\uploads\*',
    'backend\uploads\*',
    'backend\storage\temp\*'
)

# Get all items in current directory
Get-ChildItem -Path $CurrentDir -Recurse -Force | Where-Object {
    $item = $_
    $relativePath = $item.FullName.Substring($CurrentDir.Path.Length + 1)
    
    # Skip if matches any exclude pattern
    $shouldExclude = $false
    foreach ($pattern in $ExcludePatterns) {
        if ($relativePath -like "*\$pattern" -or $relativePath -like "$pattern\*" -or $relativePath -eq $pattern) {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
} | Copy-Item -Destination {
    $relativePath = $_.FullName.Substring($CurrentDir.Path.Length + 1)
    Join-Path $DestinationPath $relativePath
} -Force -Recurse

Write-Host "✅ Project copied successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd $DestinationPath"
Write-Host "2. git init"
Write-Host "3. git add ."
Write-Host "4. git commit -m 'Initial commit'"
Write-Host "5. git remote add origin <your-new-repo-url>"
Write-Host "6. git push -u origin main"

