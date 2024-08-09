let personas = [];
let preguntaActual = 0;
const preguntas = [
    "¿Cuántas horas de vuelos NACIONALES realizaste en el último año?",
    "¿Cuántas horas de vuelos INTERNACIONALES realizaste en el último año?",
    "¿Cuál es tu principal medio de transporte al trabajo?",
    "¿Cuál es la distancia en kilómetros de tu casa al trabajo?",
    "¿Qué tipo de dieta tienes habitualmente?"
];

function seleccionarOpcion(tipo, valor, elemento) {
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(opcion => {
        opcion.classList.remove('seleccionada');
    });

    elemento.classList.add('seleccionada');

    const inputExistente = document.querySelector(`input[name="${tipo}"]`);
    if (inputExistente) {
        inputExistente.value = valor;
    } else {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = tipo;
        input.value = valor;
        document.getElementById('preguntaForm').appendChild(input);
    }
}

function mostrarSiguientePregunta() {
    if (preguntaActual < preguntas.length) {
        const pregunta = preguntas[preguntaActual];
        const form = document.getElementById('preguntaForm');
        form.innerHTML = `<label for="respuesta">${pregunta}</label>`;

        if (pregunta === "¿Cuál es tu principal medio de transporte al trabajo?") {
            form.innerHTML += `
                <div class="opciones">
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0.3', this)">Carro</div>
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0.2', this)">Moto</div>
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0', this)">Bicicleta</div>
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0', this)">Caminando</div>
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0.1', this)">Transporte público</div>
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0', this)">Home office</div>
                    <div class="opcion" onclick="seleccionarOpcion('transporte', '0.2', this)">Carro o moto eléctrica</div>
                </div>`;
            agregarEventListenersOpciones();
        } else if (pregunta === "¿Qué tipo de dieta tienes habitualmente?") {
            form.innerHTML += `
                <div class="opciones">
                    <div class="opcion" onclick="seleccionarOpcion('dieta', '7.19', this)">Alto contenido cárnico (100g o más al día)</div>
                    <div class="opcion" onclick="seleccionarOpcion('dieta', '5.63', this)">Medio contenido cárnico (50g a 99g al día)</div>
                    <div class="opcion" onclick="seleccionarOpcion('dieta', '4.67', this)">Bajo contenido cárnico (menos de 50g al día)</div>
                    <div class="opcion" onclick="seleccionarOpcion('dieta', '3.91', this)">Píscivora (solo pescado)</div>
                    <div class="opcion" onclick="seleccionarOpcion('dieta', '2.89', this)">Vegana</div>
                    <div class="opcion" onclick="seleccionarOpcion('dieta', '3.81', this)">Vegetariana</div>
                </div>
                <p>Una libra de carne tiene 500 g, entonces si generalmente en su casa almuerzan 4 personas con una libra de carne, cada uno se está comiendo 125 gramos de carne. ¡Así que haga bien la cuenta!</p>`;
            agregarEventListenersOpciones();
        } else if (
            pregunta === "¿Cuántas horas de vuelos NACIONALES realizaste en el último año?" ||
            pregunta === "¿Cuántas horas de vuelos INTERNACIONALES realizaste en el último año?" ||
            pregunta === "¿Cuál es la distancia en kilómetros de tu casa al trabajo?"
        ) {
            form.innerHTML += `<input type="text" id="respuesta" required>`;
        }
    } else {
        document.getElementById('preguntas').style.display = 'none';
        calcularHuella();
    }
}

function comenzarCalculo() {
    const nombre = document.getElementById('nombre').value;
    personas.push({ nombre });
    document.getElementById('saludo').innerText = `Hola ${nombre}! Vamos a calcular tu huella de carbono. Responde las preguntas:`;
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('preguntas').style.display = 'block';
    mostrarSiguientePregunta();
}

function agregarEventListenersOpciones() {
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(opcion => {
        opcion.addEventListener('click', function() {
            opciones.forEach(o => o.classList.remove('seleccionada'));
            this.classList.add('seleccionada');
        });
    });
}

function guardarDatos() {
    const form = document.getElementById('preguntaForm');
    const respuestaTransporte = form.querySelector('input[name="transporte"]');
    const respuestaDieta = form.querySelector('input[name="dieta"]');
    const respuestaNumerica = form.querySelector('input[type="number"]');
    const respuestaTexto = form.querySelector('input[type="text"]');

    const respuesta = respuestaTransporte ? respuestaTransporte.value :
                     respuestaDieta ? respuestaDieta.value :
                     respuestaNumerica ? respuestaNumerica.value :
                     respuestaTexto ? respuestaTexto.value : '';

    personas[personas.length - 1][preguntas[preguntaActual]] = respuesta;
    form.reset();
    preguntaActual++;
    mostrarSiguientePregunta();
}

function calcularHuella() {
    personas.forEach(persona => {
        const vuelos_nacionales = persona[preguntas[0]];
        const CO2_vuelos_nacionales = vuelos_nacionales * 100 / 1000 / 12; // t CO2 / mes

        const vuelos_internacionales = persona[preguntas[1]];
        const CO2_vuelos_internacionales = vuelos_internacionales * 100 / 1000 / 12; // t CO2 / mes

        const transporte_trabajo = persona[preguntas[2]];
        const distancia_trabajo = persona[preguntas[3]];
        const CO2_transporte_trabajo = transporte_trabajo * distancia_trabajo * 5 * 4 / 1000; // t CO2 / mes

        // Calcular CO2 de la alimentación según el tipo de dieta habitual
        const dieta = parseFloat(persona[preguntas[4]]);
        const CO2_alimentacion = dieta * 30 / 1000; // t CO2 / mes

        const CO2_total = CO2_vuelos_nacionales + CO2_vuelos_internacionales + CO2_transporte_trabajo + CO2_alimentacion;

        persona.CO2_total = CO2_total;
    });

    mostrarResultados();
}

function mostrarResultados() {
    let resultadosHTML = '';
    personas.forEach(persona => {
        const CO2_anual = persona.CO2_total * 12;
        resultadosHTML += `<p class="resultado-texto">${persona.nombre}, tu huella de carbono al mes es de ${persona.CO2_total.toFixed(2)} toneladas de carbono. Es decir, que en el último año tu huella de carbono fue de ${CO2_anual.toFixed(2)} toneladas de CO2.</p>`;

        if (CO2_anual > 7) {
            resultadosHTML += `
                <p class="resultado-texto">Eres una auténtica VACA en lo que respecta a la huella de carbono.</p>
                <img src="letrero.png" alt="letrero" width="600" height="45">
                <img src="vaca.png" alt="vaca" width="600" height="185">
                <p class="resultado-detalle">La huella de carbono de una vaca es igual a la producción de 76 barriles de petróleo.</p>`;
        } else if (CO2_anual > 4) {
            resultadosHTML += `
                <p class="resultado-texto">Eres una OVEJA cuando se trata de contaminación.</p>
                <img src="letrero.png" alt="vaca" width="600" height="45">
                <img src="oveja.png" alt="oveja" width="600" height="185">
                <p class="resultado-detalle">Las ovejas generan emisiones de metano, óxido nitroso y dióxido de carbono, lo que representa el 7,4 % de las emisiones mundiales de Gases de Efecto Invernadero.</p>`;
        } else if (CO2_anual > 2) {
            resultadosHTML += `
                <p class="resultado-texto">Tus hábitos indican que eres un PEZ en términos de emisiones de carbono.</p>
                <img src="letrero.png" alt="vaca" width="600" height="45">
                <img src="pez.png" alt="pez" width="600" height="185">
                <p class="resultado-detalle">Tienes la misma huella de carbono que un pez o una mojarra.</p>`;
        } else {
            resultadosHTML += `
                <p class="resultado-texto">Tu huella de carbono es mínima, lo que te convierte en un ratón.</p>
                <img src="letrero.png" alt="vaca" width="600" height="45">
                <img src="raton.png" alt="ratón" width="600" height="185">
                <p class="resultado-detalle">Los ratones tienen la menor huella de carbono en el reino animal.</p>`;
        }
    });

    document.getElementById('resultados').innerHTML = resultadosHTML;
    document.getElementById('resultados').style.display = 'block';
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('preguntas').style.display = 'none';
}

document.getElementById('siguientePregunta').addEventListener('click', function() {
    guardarDatos();
});

document.getElementById('empezar').addEventListener('click', function() {
    comenzarCalculo();
});
