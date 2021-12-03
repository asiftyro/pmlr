var socket = io("http://localhost:3000");
socket.on("change", (message) => {
    window.location.reload();
})