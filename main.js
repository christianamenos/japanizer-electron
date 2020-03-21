const { app, screen, BrowserWindow } = require('electron');

function createWindow() {
    /*
    var mainScreen = screen.getPrimaryDisplay();
    var dimensions = mainScreen.size;
    */
    const allScreens = screen.getAllDisplays();
    let minWidth = Infinity;
    let minHeight = Infinity;
    allScreens.map((screen) => {
        const screenDimensions = screen.size;
        if (screenDimensions.width < minWidth) {
            minWidth = screenDimensions.width;
        }
        if (screenDimensions.height < minHeight) {
            minHeight = screenDimensions.height;
        }
    });

    // Creates the navigator window
    let win = new BrowserWindow({
        width: Math.floor(minWidth / 2),
        height: minHeight,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // y carga el index.html de la aplicación.
    win.loadFile('src/app.html');
    // Remove menu (Linux and Windows)
    win.removeMenu();

    // Open DevTools
    // win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Soem APIs can only be consumed after this event happens
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // In macOS is common for apps and their menus to be active
    // until the user exits explicity with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});