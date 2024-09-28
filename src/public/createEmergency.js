// // createEmergency.js
// async function createEmergency(event) {
//     event.preventDefault(); // Prevent default form submission

//     const formData = new FormData(event.target);
//     const data = {};
//     formData.forEach((value, key) => {
//         data[key] = value;
//     });

//     try {
//         const response = await fetch('http://localhost:3000/api/emergencies', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         if (response.ok) {
//             alert('Emergency created successfully!');
//             event.target.reset(); // Clear the form
//         } else {
//             alert(result.errors ? result.errors.map(err => err.msg).join(', ') : 'Error creating emergency');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Something went wrong!'); // Display error message
//     }
// }

// document.getElementById('apiForm').addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent the default form submission

//     // Get form data
//     const formData = new FormData(this);
//     const data = Object.fromEntries(formData.entries());

//     try {
//         // Send data to the API
//         const response = await fetch('http://localhost:3000/api/emergencies', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         // Display the API response
//         document.getElementById('response').innerText = JSON.stringify(result, null, 2);
//     } catch (error) {
//         console.error('Error:', error);
//         document.getElementById('response').innerText = 'Error: ' + error.message;
//     }
// });


document.getElementById('apiForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
     let response = await axios.post("https://sio-app-b3qb.onrender.com/api/emergencies", data)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('Error:', error);

    }
});
