# Windows batch script to launch Chrome with disabled CORS (DEVELOPMENT ONLY)
# Save as launch-chrome-dev.bat and run it
# WARNING: Only use for development, never in production!

chrome.exe --user-data-dir="C:/chrome-dev-session" --disable-web-security --disable-features=VizDisplayCompositor --allow-running-insecure-content --disable-extensions
