// const socket = io();

// // Get the audio element
// const notificationSound = document.getElementById('notification-sound');

// function playSound() {
//     notificationSound.play().catch(error => {
//         console.error("Audio playback failed:", error);
//     });
// }

// // Listen for emergency notifications
// socket.on('emergency', (emergency) => {
//     document.body.addEventListener('click', () => {
//         playSound();
//     }, { once: true });

//     const notificationsDiv = document.getElementById('notifications');
//     const notification = document.createElement('div');
//     notification.className = 'notification card p-3';
//     notification.innerHTML = `
//         <div class="notification-header">
//             <strong>Doctor ID: ${emergency.doctorId}</strong>
//             <span class="notification-time">${new Date(emergency.createdAt).toLocaleString()}</span>
//         </div>
//         <p><strong>Message:</strong> ${emergency.message}</p>
//         <p><strong>Severity:</strong> ${emergency.severity}</p>
//     `;
//     notificationsDiv.prepend(notification);

//     playSound()


// });


const socket = io();

// Get the audio element
const notificationSound = document.getElementById('notification-sound');

let soundAllowed = false;

function playSound() {
    if (soundAllowed) {
        notificationSound.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    }
}

// Event listener for user interaction to enable sound
document.body.addEventListener('click', () => {
    notificationSound.play().then(() => {
        soundAllowed = true;
        console.log("Sound is now allowed.");
    }).catch((error) => {
        console.error("User interaction required for sound. Please click again:", error);
    });
}, { once: true });

// Listen for emergency notifications
socket.on('emergency', (emergency) => {
    const notificationsDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'notification card p-3';
    notification.innerHTML = `
        <div class="notification-header">
            <strong>Doctor ID: ${emergency.type}</strong>
        </div>
        <p><strong>Message:</strong> ${emergency.message}</p>
        <p><strong>Severity:</strong> ${emergency.severity}</p>
    `;
    notificationsDiv.prepend(notification);
    // <span class="notification-time">${new Date(emergency.createdAt).toLocaleString()}</span>  

    playSound();
});
