
const list = document.getElementById('clientList');

// renderizar la lista de clientes
async function renderList() {
    list.innerHTML = '';

    try {
        const response = await fetch('/api/clientes');
        const data = await response.json();

        if (data.length === 0) {
            list.innerHTML = '<p class="no-results">No hay clientes registrados.</p>';
            return;
        }
        data.reverse()

        data.forEach( async (client) => {
            console.log(client.id_numero);
            

            const clientDiv = document.createElement('div');
            clientDiv.classList.add('client');
            clientDiv.innerHTML = `
                <h2>Nombre: ${client.nombre || 'Desconocido'}</h2>
                <p>Número: ${client.numero || 'N/A'}</p>
                <p>Red Social: ${client.red_social || 'N/A'}</p>
                <p>Categoría: ${client.categoria || 'N/A'}</p>
                <hr>
                <p>Descripción: ${client.descripcion}</p>
                <p>Fecha Inicial: ${client.fecha_inicial}</p>
                <p>Fecha de entrega: ${client.fecha_final}</p>
                <p>Plan: ${client.plan}</p>
                <p>Precio: ${client.precio}</p>
            `;
            list.appendChild(clientDiv);
        }
        );

    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}
renderList();
// Campo de búsqueda
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const clients = list.getElementsByClassName('client');  
    Array.from(clients).forEach(client => {
        const text = client.textContent.toLowerCase();
        if (text.includes(filter)) {
            client.style.display = '';
        } else {
            client.style.display = 'none';
        }  
    });
});

