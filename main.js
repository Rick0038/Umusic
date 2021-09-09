const electron = require('electron');
const app = electron.app;               
const Menu = electron.Menu;                       
const ipcMain = electron.ipcMain;  
const BrowserWindow = electron.BrowserWindow;  
const defaultUrl = 'https://music.youtube.com/'; 
const windowStateKeeper = require('electron-window-state');

var path = require('path')
let mainWindow;  
let aboutWindow; 
let changeWindow;                              
let appIcon = null;
let remain = true;
let playerStatus = null;
let pollingPlayerStatus = false;




function isPrefixed(subject, prefix) {
    return subject.slice(0, prefix.length)===prefix;
}


function createMainWindow () {

    var menu = Menu.buildFromTemplate([
        {   label: 'Full Screen',
            accelerator: 'F11',
            click: function(item, focusedWindow) {
             if (focusedWindow) {
                 focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            }
        },

        /*
        {   label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.reload();
                        }
                    }
                },
        */

        {         
            label: 'About',
            click: function(){   
                openAboutwin();
            }
        },

        {
                    
            label: 'Legal',
            submenu:[
                {
                    label:'Licence',
                    click() {   
                        openlicencewin();
                    }
                },

                {
                    label:'Changelog',
                    click() {   
                        openchangewin();
                    }
                }
            ]
        }, 

        {   label: 'Quit',
                    accelerator: 'Alt+F4',
                    click: function() {
                        if (mainWindow==null){
                            remain = false;
                            app.exit(0);
                        }
                        app.exit(0);
                    }
         }

    ]);

    Menu.setApplicationMenu(menu);
    
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1024,
        defaultHeight: 786
      });


    mainWindow = new BrowserWindow({             
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        icon: path.join(__dirname, 'img/icon512x512.png'),
        'web-preferences': {'plugins': true},
    
    }); 

    mainWindowState.manage(mainWindow);

    /*
    // Beta notice [To be removed after stable]

        i_am_okWindow=new BrowserWindow({
            width: 800,
            height: 600,
            parent: mainWindow,
            modal: true,
            'web-Preferences':{'plugins':true}
        });

        i_am_okWindow.loadFile('source/changelog.html');
        i_am_okWindow.setMenuBarVisibility(false);
        i_am_okWindow.setTitle('Do You Agree');
        i_am_okWindow.on('closed',function(){
            i_am_okWindow=null;
        })
    //
    */

    mainWindow.on('close', function(evt) {      
        if (remain) {
            remain = false;
            app.exit(0);

        }
    });
    
    
    mainWindow.loadURL(defaultUrl); 

    mainWindow.webContents.on("did-stop-loading", function() {
        if (!pollingPlayerStatus) {
            pollingPlayerStatus = true;
            setInterval(function() {
                mainWindow.webContents.send('player-status');
            }, 1000);
        }
        if (mainWindow==null){
            app.exit(0);
        }
        mainWindow.setTitle('Umusic');
    });

    

};


app.on('ready', function() {
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.exit(0);
    }
  })

app.on('activate', function () {
    if (mainWindow === null) {              
        createMainWindow();
    }
});

function openAboutwin()
{

    aboutWindow = new BrowserWindow({             
        width: 737,
        height: 423,
        title: 'About',
        icon: path.join(__dirname, 'img/icon512x512.png'),
        'web-preferences': {'plugins': true},
        parent: mainWindow,
        modal: true
    
    }); 
    aboutWindow.setMenuBarVisibility(false);
    aboutWindow.setTitle('About');
    aboutWindow.setResizable(false);
    aboutWindow.loadFile('source/about.html');
    aboutWindow.on('closed', function() {        
        aboutWindow = null;
    });
}

function openchangewin()
{

    changeWindow=new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        'web-Preferences':{'plugins':true}
    });

    changeWindow.loadFile('source/changelog.html');
    changeWindow.setMenuBarVisibility(false);
    changeWindow.setTitle('Changelog');
    changeWindow.on('closed',function(){
        changeWindow=null;
    })
}

function openlicencewin()
{

    licenceWindow=new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        'web-Preferences':{'plugins':true}
    });

    licenceWindow.loadFile('source/licence');
    licenceWindow.setMenuBarVisibility(false);
    licenceWindow.setTitle('Do You Agree');
    licenceWindow.on('closed',function(){
        licenceWindow=null;
    })
}