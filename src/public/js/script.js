const main = document.querySelector('main');


function renderList() {
    fetch('/api/numeros')
        .then(response => response.json())
        .then(data => {
            main.innerHTML = '';
            if (data.length == 0) {
                main.innerHTML = '<p class="no-results">No hay numeros pendientes.</p>';
                return;
            }
            data.forEach(contact => {
                const contactDiv = document.createElement('div');
                contactDiv.classList.add('contact');
                contactDiv.innerHTML = `
                <h2>${contact.nombre}</h2>
                <p>Teléfono: ${contact.numero}</p>
                <p>Red Social: ${contact.red_social}</p>
                <p>Categoría: ${contact.categoria}</p>
                <div class="buttons-contact">
                    <button class="delete" data-id="delete-${contact.id}">Eliminar</button>
                    <button class="definir" data-id="def-${contact.id}">Mover a Clientes</button>
                </div>
            `;
                main.appendChild(contactDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
        });

    setTimeout(() => { renderList() }, 1000);
}

renderList();


// Mostrar el formulario al hacer clic en el botón "Agregar número"
document.getElementById('addNumber').addEventListener('click', () => { 
    document.querySelector('.add-numero').style.display = 'block';
});






// Manejar el envío del formulario para agregar un nuevo número
document.getElementById("numberForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nombre: e.target.nombre.value,
        numero: e.target.numero.value,
        red_social: e.target["red-social"].value,
        categoria: e.target.categoria.value,
    };

    const res = await fetch("/api/numeros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (res.ok) {
        document.querySelector('.add-numero').style.display = 'none';
        alert("Número agregado correctamente");
        e.target.reset();
    } else {
        alert("<p style='color: red;'>Error al agregar el número</p>");
        const errorData = await res.json();
        console.error("Error details:", errorData);
    }
});


// Manejar el clic en el botón "Cancelar" para ocultar el formulario
document.getElementById("cancelAdd").addEventListener("click", () => {
    document.querySelector('.add-numero').style.display = 'none';
});


document.querySelectorAll('.definir').forEach(element => {
    element.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id').split('-')[1];
        // Aquí puedes agregar la lógica para mover el número a "Clientes"
        // Por ejemplo, hacer una solicitud POST a /api/clientes con el ID del número
        console.log('Mover a Clientes ID:', id);
        
    });
});
