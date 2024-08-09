let personas = [];
let preguntaActual = 0;
const preguntas = [
    "¿Cuántas personas viven en tu casa?",
    "¿Consumo promedio de gas en la factura (m3)?",
    "¿Consumo promedio de agua en la factura (m3)?",
    "¿Consumo promedio de luz en la factura (kWh)?",
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
                </div>
                            `;
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
                <p>Una libra de carne tiene 500 g, entonces si generalmente en su casa almuerzan 4 personas con una libra de carne, cada uno se esta comiendo 125 gramos de carne. ¡Así que haga bien la cuenta!</p>
            `;
            agregarEventListenersOpciones();
        } else if (
            pregunta === "¿Consumo promedio de gas en la factura (m3)?" ||
            pregunta === "¿Consumo promedio de agua en la factura (m3)?" ||
            pregunta === "¿Consumo promedio de luz en la factura (kWh)?" ||
            pregunta === "¿Cuántas horas de vuelos NACIONALES realizaste en el último año?" ||
            pregunta === "¿Cuántas horas de vuelos INTERNACIONALES realizaste en el último año?" ||
            pregunta === "¿Cuál es la distancia en kilómetros de tu casa al trabajo?"
        ) {
            form.innerHTML += `<input type="text" id="respuesta" required>`;
        } else if (pregunta === "¿Cuántas personas viven en tu casa?") {
            form.innerHTML += `<input type="number" id="respuesta" min="1" required>`;
        } else {
            form.innerHTML += `<input type="number" id="respuesta" required>`;
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
        const personasHogar = persona[preguntas[0]];
        const consumo_gas_personal = persona[preguntas[1]] / personasHogar;
        const CO2_gasnatural = consumo_gas_personal * 2.75 / 1000; // t CO2 / mes

        const consumo_agua_personal = persona[preguntas[2]] / personasHogar;
        const CO2_agua = consumo_agua_personal * 4 / 1000; // t CO2 / mes

        const consumo_luz_personal = persona[preguntas[3]] / personasHogar;
        const CO2_luz = consumo_luz_personal * 0.16438 / 1000; // t CO2 / mes

        const vuelos_nacionales = persona[preguntas[4]];
        const CO2_vuelos_nacionales = vuelos_nacionales * 100 / 1000 / 12; // t CO2 / mes

        const vuelos_internacionales = persona[preguntas[5]];
        const CO2_vuelos_internacionales = vuelos_internacionales * 100 / 1000 / 12; // t CO2 / mes

        const transporte_trabajo = persona[preguntas[6]];
        const distancia_trabajo = persona[preguntas[7]];
        const CO2_transporte_trabajo = transporte_trabajo * distancia_trabajo * 5 * 4 / 1000; // t CO2 / mes

        // Calcular CO2 de la alimentación según el tipo de dieta habitual
        const dieta = parseFloat(persona[preguntas[8]]);
        const CO2_alimentacion = dieta * 30 / 1000; // t CO2 / mes

        const CO2_total = CO2_gasnatural + CO2_agua + CO2_luz + CO2_vuelos_nacionales + CO2_vuelos_internacionales + CO2_transporte_trabajo + CO2_alimentacion;

        persona.CO2_total = CO2_total;
    });

    mostrarResultados();
}

// Modifica tu función mostrarResultados() para agregar el botón "¿Cómo remediarlo?"
function mostrarResultados() {
    let resultadosHTML = '';
    personas.forEach(persona => {
        const CO2_anual = persona.CO2_total * 12;
        resultadosHTML += `<p class="resultado-texto">${persona.nombre}, tu huella de carbono al mes es de ${persona.CO2_total.toFixed(2)} toneladas de carbono. Es decir que, en el último año tu huella de carbono fue de ${CO2_anual.toFixed(2)} toneladas de CO2.</p>`;

        if (CO2_anual > 7) {
            resultadosHTML += `
                <p class="resultado-texto">Eres una auténtica VACA en lo que respecta a la huella de carbono.</p>
                <img src="letrero.png" alt="letrero" width="600" height="45">
                <img src="vaca.png" alt="vaca" width="600" height="185">
                <p class="resultado-detalle">La huella de carbono de una vaca es igual a la producción de 76 barriles de petróleo.</p>
            `;
        } else if (CO2_anual > 4) {
            resultadosHTML += `
                <p class="resultado-texto">Eres una OVEJA cuando se trata de contaminación.</p>
                <img src="letrero.png" alt="vaca" width="600" height="45">
                <img src="oveja.png" alt="oveja" width="600" height="185">
                <p class="resultado-detalle">Las ovejas generan emisiones de metano, óxido nitroso y dióxido de carbono, lo que representa el 7,4 % de las emisiones mundiales de Gases de Efecto Invernadero.</p>
            `;
        } else if (CO2_anual > 2) {
            resultadosHTML += `
                <p class="resultado-texto">Tus hábitos indican que eres un PEZ en términos de emisiones de carbono.</p>
                <img src="letrero.png" alt="vaca" width="600" height="45">
                <img src="pez.png" alt="pez" width="600" height="185">
                <p class="resultado-detalle">Los peces regulan la cantidad de CO2 que permanece en la atmósfera, ya que absorben 30% de las emisiones globales.</p>
            `;
        } else {
            resultadosHTML += `
                <p class="resultado-texto">¡Eres una HORMIGA INNOVAKIT. Tienes huella ambiental pequeña.</p>
                <img src="hormiga.png" alt="hormiga" width="600" height="185">
                <p class="resultado-detalle">Generan la menor huella ambiental al planeta. Esta debería ser nuestra meta siempre.</p>
            `;
        }
    });

    // Agrega el botón "¿Cómo remediarlo?" y el resultado de cuántos árboles sembrar
    resultadosHTML += `
        <button type="button" onclick="mostrarCuantosArboles()">¿Qué puedes hacer?</button>
        <div id="resultadoArboles" style="display:none;"></div>
    `;

    document.getElementById('resultadoText').innerHTML = resultadosHTML;
    document.getElementById('resultado').style.display = 'block';
}

function mostrarCuantosArboles() {
    let arbolesNecesarios = personas.map(persona => {
        const CO2_anual = persona.CO2_total * 12;
        return Math.ceil(CO2_anual / 0.2177); // 21.77 kg CO2 absorbidos por un árbol al año
    });

    const sumaArboles = arbolesNecesarios.reduce((total, arboles) => total + arboles, 0);

    const resultadosHTML = `
        <h2 style="font-size: 20px; color: #000000;">¡¡Puedes empezar sembrando árboles!!</h2>
        <p style="font-size: 18px; color: #000000; margin: 0;">Según tus resultados, para compensar tu huella de carbono, necesitas sembrar aproximadamente</p>
        <p style="font-size: 23px; color: #4CAF50; margin: 0;">${sumaArboles} árboles al año.</p>
        <h2 style="font-size: 20px; color: #000000;">O puedes reducir el consumo de carne, caminar más y practicar el reciclaje.</h2>
        <img src="arboles.png" alt="arboles" width="600" height="206" style="float: left; margin-right: 10px;">
        <h2 style="font-size: 23px; color: #278599; font-style: italic; margin-top: 0;">Recuerda: pequeñas acciones graneran grandes cambios.</h2>
        
        
    `;

    // Mostrar los resultados en el div "resultadoArboles" y mostrar este div
    document.getElementById('resultadoArboles').innerHTML = resultadosHTML;
    document.getElementById('resultadoArboles').style.display = 'block';
}
