@echo off
echo Fixing database permissions...
echo.
echo Please run this command manually:
echo psql -U postgres -d cms_pressup -f fix-permissions.sql
echo.
echo Or if your database name is different:
echo psql -U postgres -d spa_cms_db -f fix-permissions.sql
echo.
pause



