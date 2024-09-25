// Core classes
class Desktop {
    constructor() {
        this.element = document.getElementById('desktop');
        this.icons = [];
        this.windows = [];
        this.apps = [];
    }

    addIcon(icon) {
        this.icons.push(icon);
        this.element.appendChild(icon.element);
    }

    openWindow(app) {
        const window = new Window(app);
        this.windows.push(window);
        this.element.appendChild(window.element);
        taskbar.addItem(window);
    }

    loadApps() {
        fetch('/static/js/apps/manifest.json')
            .then(response => response.json())
            .then(appList => {
                appList.forEach(appName => {
                    import(`/static/js/apps/${appName}.js`)
                        .then(module => {
                            const app = new module.default();
                            this.apps.push(app);
                            this.addIcon(new Icon(app));
                            startMenu.addItem(app);
                        })
                        .catch(err => console.error(`Error loading ${appName}:`, err));
                });
            })
            .catch(err => console.error('Error loading app manifest:', err));
    }
}

class Icon {
    constructor(app) {
        this.app = app;
        this.element = this.createElement();
    }

    createElement() {
        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.style.left = `${this.app.iconPosition.x}px`;
        icon.style.top = `${this.app.iconPosition.y}px`;
        icon.innerHTML = `
            <div class="icon-image">${this.app.icon}</div>
            <div>${this.app.name}</div>
        `;
        icon.addEventListener('dblclick', () => desktop.openWindow(this.app));
        return icon;
    }
}

class Window {
    constructor(app) {
        this.app = app;
        this.element = this.createElement();
    }

    createElement() {
        const window = document.createElement('div');
        window.className = 'window';
        window.style.width = '400px';
        window.style.height = '300px';
        window.style.left = '100px';
        window.style.top = '100px';
        window.innerHTML = `
            <div class="window-header">
                <div class="window-icon">${this.app.icon}</div>
                <span>${this.app.name}</span>
                <div class="window-controls">
                    <span class="minimize">-</span>
                    <span class="maximize">□</span>
                    <span class="close">×</span>
                </div>
            </div>
            <div class="window-content"></div>
        `;
        this.setupWindowControls(window);
        this.app.render(window.querySelector('.window-content'));
        return window;
    }

    setupWindowControls(window) {
        window.querySelector('.close').addEventListener('click', () => {
            window.remove();
            taskbar.removeItem(this);
        });

        window.querySelector('.minimize').addEventListener('click', () => {
            window.style.display = 'none';
        });

        window.querySelector('.maximize').addEventListener('click', () => {
            if (window.style.width === '100%') {
                window.style.width = '400px';
                window.style.height = '300px';
                window.style.top = '100px';
                window.style.left = '100px';
            } else {
                window.style.width = '100%';
                window.style.height = 'calc(100% - 40px)';
                window.style.top = '0';
                window.style.left = '0';
            }
        });
    }
}

class Taskbar {
    constructor() {
        this.element = document.getElementById('taskbar');
        this.items = [];
    }

    addItem(window) {
        const item = document.createElement('div');
        item.className = 'taskbar-item';
        item.innerHTML = `
            <div class="taskbar-icon">${window.app.icon}</div>
            <span>${window.app.name}</span>
        `;
        item.addEventListener('click', () => {
            if (window.element.style.display === 'none') {
                window.element.style.display = 'block';
            } else {
                window.element.style.display = 'none';
            }
        });
        this.element.appendChild(item);
        this.items.push(item);
    }

    removeItem(window) {
        const item = this.items.find(item => item.textContent === window.app.name);
        if (item) {
            item.remove();
            this.items = this.items.filter(i => i !== item);
        }
    }
}

class StartMenu {
    constructor() {
        this.element = document.getElementById('start-menu');
        this.isVisible = false;
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.element.style.display = this.isVisible ? 'block' : 'none';
    }

    addItem(app) {
        const item = document.createElement('div');
        item.className = 'start-menu-item';
        item.innerHTML = `
            <div class="start-menu-icon">${app.icon}</div>
            <span>${app.name}</span>
        `;
        item.addEventListener('click', () => {
            desktop.openWindow(app);
            this.toggle();
        });
        this.element.appendChild(item);
    }
}

// Initialize components
const desktop = new Desktop();
const taskbar = new Taskbar();
const startMenu = new StartMenu();

// Set up event listeners
document.getElementById('start-button').addEventListener('click', () => startMenu.toggle());

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('datetime').textContent = dateTimeString;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Load apps
desktop.loadApps();