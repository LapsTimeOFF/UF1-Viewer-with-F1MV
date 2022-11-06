const { spawn, exec } = require("child_process");
const fs = require("fs");
const { ipcRenderer } = require("electron");

const debug = true;

function launchMVF1() {
    let LOCALAPPDATA = process.env.LOCALAPPDATA;
    if (navigator.appVersion.indexOf("Win") != -1) {
        if (!fs.existsSync(`${LOCALAPPDATA}\\MultiViewerForF1`)) {
            alert(
                "Cannot run MultiViewer because of invalid path. Please put your MultiViewer folder under '%APPDATA%'"
            );
            return;
        }
        let mvPath = `${LOCALAPPDATA}\\MultiViewerForF1\\MultiViewer for F1.exe`;
        console.log("Launching MultiViewer");
        spawn(mvPath, [], { detached: true });
    } else if (navigator.appVersion.indexOf("Mac") != -1) {
        alert("Launching MultiViewer is not compatible with MacOS yet.");
        // if (!fs.existsSync(`/Applications/MultiViewer for F1.app`)) {
        //     alert(
        //         "Cannot run MultiViewer because of invalid path. Please put your MultiViewer folder under '/Applications'"
        //     );
        //     return;
        // }
        // let mvPath = `/Applications/MultiViewer for F1.app`;
        // console.log("Launching MultiViewer");
        // spawn(mvPath, [], { detached: true });
    } else if (navigator.appVersion.indexOf("X11") != -1) {
        alert("Launching MultiViewer is not compatible with Unix OS yet.");
    } else if (navigator.appVersion.indexOf("Linux") != -1) {
        alert("Launching MultiViewer is not compatible with Linux OS yet.");
    } else {
        {
            alert("Cannot run MultiViewer because OS is unknown.");
        }
    }
}

function flagDisplay() {
    ipcRenderer
        .invoke(
            "window",
            "flagdisplay/index.html",
            800,
            600,
            false,
            true,
            false,
            false
        )
        .then((result) => {
            console.log(result);
        });
}

function digiFlag() {
    ipcRenderer
        .invoke(
            "window",
            "digiflag/index.html",
            800,
            600,
            true,
            true,
            false,
            false
        )
        .then((result) => {
            console.log(result);
        });
}

function trackTime() {
    ipcRenderer
        .invoke(
            "window",
            "tracktime/index.html",
            400,
            140,
            false,
            true,
            true,
            false
        )
        .then((result) => {
            console.log(result);
        });
}

function trackInfo() {
    ipcRenderer
        .invoke(
            "window",
            "trackinfo/index.html",
            1000,
            800,
            false,
            true,
            true,
            false
        )
        .then((result) => {
            console.log(result);
        });
}

function compass() {
    ipcRenderer
        .invoke(
            "window",
            "compass/index.html",
            100,
            100,
            false,
            true,
            true,
            false
        )
        .then((result) => {
            console.log(result);
        });
}

function fastest() {
    ipcRenderer
        .invoke(
            "window",
            "fastest/index.html",
            1000,
            300,
            false,
            true,
            true,
            false
        )
        .then((result) => {
            console.log(result);
        });
}

let rotated = false;
function settings() {
    if (rotated) {
        document.getElementById("settings-icon").style.transform =
            "rotate(-45deg)";
        document.getElementById("menu").className = "";
        saveSettings();
        rotated = false;
    } else {
        document.getElementById("settings-icon").style.transform =
            "rotate(45deg)";
        document.getElementById("menu").className = "shown";
        rotated = true;
        console.log("Settings");
    }
}

async function saveSettings() {
    const config = (await ipcRenderer.invoke("get_config")).current;
    if (debug) console.log(config);
    for (index in config) {
        for (i in config[index]) {
            if (debug) {
                console.log(i);
                console.log(index);
                console.log(config[index]);
                console.log(config[index][i]);
                console.log(document.getElementById(i));
                console.log(document.getElementById(i).value);
                console.log(document.getElementById(i).checked);
                console.log(document.getElementById(i).type == "checkbox");
            }
            let value = document.getElementById(i).value;
            console.log(value);
            if (document.getElementById(i).type == "checkbox") {
                console.log("Checkbox   ");
                value = document.getElementById(i).checked;
            }
            console.log(value);
            await ipcRenderer.invoke("write_config", index, i, value);
        }
    }
}

async function setSettings() {
    const config = (await ipcRenderer.invoke("get_config")).current;
    if (debug) console.log(config);
    for (index in config) {
        for (i in config[index]) {
            if (debug) {
                console.log(i);
                console.log(config[index]);
                console.log(config[index][i]);
                console.log(document.getElementById(i));
            }
            if (document.getElementById(i).classList.contains("switch")) {
                if (debug) {
                    console.log("Switch");
                }
                document.querySelector(`#${i} input`).checked =
                    config[index][i];
            }
            if (document.getElementById(i).classList.contains("selector")) {
                document.getElementById(i).value = config[index][i];
                if (debug) {
                    console.log(
                        (document.getElementById(i).value = config[index][i])
                    );
                    console.log("Selector");
                }
            }
        }
    }
}

setSettings();
