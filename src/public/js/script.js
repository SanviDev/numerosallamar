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


main.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Botón "Mover a Clientes"
    if (btn.classList.contains('definir')) {
        // data-id tiene formato "def-<id>" según el render; extraer id
        const raw = btn.getAttribute('data-id') || '';
        const id = raw.split('-')[1];
        if (!id) return;
        // console.log('Mover a Clientes ID:', id);
        document.querySelector('.add-cliente').style.display = 'block';
        document.getElementById('clienteForm').onsubmit = async (ev) => {
            ev.preventDefault();
            const infoNumber = await infoToNumberById(id)

            console.log(infoNumber)

            const data = {
                nombre: infoNumber.nombre,
                numero: infoNumber.numero,
                red_social: infoNumber.red_social,
                categoria: infoNumber.categoria,
                descripcion: ev.target.descripcion.value,
                fecha_inicial: ev.target.fecha_inicial.value,
                fecha_final: ev.target.fecha_final.value,
                plan: ev.target.plan.value,
                precio: ev.target.precio.value,
            };

            console.log(data);
            

            const res = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                document.querySelector('.add-cliente').style.display = 'none';
                alert('Número movido a Clientes correctamente');
                fetch(`/api/numeros/${id}`, { method: 'DELETE' });
                renderList();
                ev.target.reset();

            } else {
                alert('Error al mover el número a Clientes');
                const errorData = await res.json();
                console.error('Error details:', errorData);
            }
        };
        return;
    }


    // Botón "Eliminar"
    if (btn.classList.contains('delete')) {
        const raw = btn.getAttribute('data-id') || '';
        const id = raw.split('-')[1];
        if (!id) return;

        if (!confirm('¿Eliminar este número?')) return;

        try {
            const res = await fetch(`/api/numeros/${id}`, { method: 'DELETE' });
            if (res.ok) {   
                console.log('Eliminado ID:', id);
                // Opcional: forzar render inmediato
                renderList();
            } else {
                const err = await res.json().catch(()=>null);
                console.error('Error al eliminar:', err || res.statusText);
            }
        } catch (err) {
            console.error('Error al eliminar:', err);
        }
    }
});


async function infoToNumberById(id) {
    try {
        const response = await fetch(`/api/numeros/${id}`, { method: 'GET' });
        const data = await response.json();

        return data[0];
    } catch (error) {
        console.error("Error fetching contact info:", error);
        return null;
    }
}
