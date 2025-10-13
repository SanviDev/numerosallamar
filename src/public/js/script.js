const main = document.querySelector('main');

fetch('/api/numeros')
    .then(response => response.json())
    .then(data => {
        if (data.length == 0) {
            main.innerHTML = '<p class="no-results">No hay numeros pendientes.</p>';
            return;
        }
        data.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('contact');
            contactDiv.innerHTML = `
                <h2>${contact.name}</h2>
                <p>Phone: ${contact.phone}</p>
                <p>Email: ${contact.email}</p>
            `;
            main.appendChild(contactDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching contacts:', error);
    });
