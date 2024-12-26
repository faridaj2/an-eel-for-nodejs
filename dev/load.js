function addScript(src) {
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    var head = document.head;
    head.appendChild(script);
}

function removeScript(src) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src.includes(src)) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
}

addScript('/js/socket.js');
addScript('/js/eel.js')
removeScript('js/load.js')