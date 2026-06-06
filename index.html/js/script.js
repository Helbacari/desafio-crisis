let paginaActual = 'gondola'; // Estado inicial

// 1. CONTROL DE NAVEGACIÓN ENTRE PÁGINAS
function cambiarPagina(idPagina) {
    paginaActual = idPagina;
    
    // Cambiar pestañas activas en el menú de navegación
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const botonActivo = document.querySelector(`[onclick="cambiarPagina('${idPagina}')"]`);
    if(botonActivo) botonActivo.classList.add('active');

    // Cambiar página visible en la pantalla
    document.querySelectorAll('.arcade-page').forEach(page => {
        page.classList.remove('active');
    });
    
    const paginaActiva = document.getElementById(`page-${idPagina}`);
    if (paginaActiva) {
        paginaActiva.classList.add('active');
    }

    // Controlar visibilidad inteligente del panel derecho (HUD)
    const contenedorPrincipal = document.querySelector('.juego-container'); 
    if (contenedorPrincipal) {
        if (idPagina === 'tablero') {
            // Ocultamos el panel derecho para dar espacio completo al simulador de precios
            contenedorPrincipal.classList.add('ocultar-hud');
            calcularInflacionManual(); 
        } else {
            // Regresamos el panel derecho únicamente en la Góndola de diésel
            contenedorPrincipal.classList.remove('ocultar-hud');
            actualizarSimulacionCarburante();
        }
    }
}

// 2. BOTONES +/- GENÉRICOS (Modificación manual)
function modificarValor(inputId, cantidad) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    let valorActual = parseFloat(inputElement.value) || 0;
    valorActual += cantidad;
    if(valorActual < 0) valorActual = 0;
    inputElement.value = valorActual;
    
    // Si modificamos algo de la góndola, se actualiza solo la simulación de combustible
    if (inputId.includes('reserva') || inputId.includes('consumo') || inputId.includes('reabastecimiento')) {
        actualizarSimulacionCarburante();
    }
}

// 3. SIMULADOR 1: GÓNDOLA DE CARBURANTE (Maneja el tanque y el HUD derecho)
function actualizarSimulacionCarburante() {
    const inicialField = document.getElementById("reserva-inicial");
    const consumoField = document.getElementById("consumo-diario");
    const reabastField = document.getElementById("reabastecimiento");
    const criticoField = document.getElementById("nivel-critico");

    if (!inicialField || !consumoField || !reabastField) return;

    const inicial = parseFloat(inicialField.value) || 0;
    const consumo = parseFloat(consumoField.value) || 0;
    const reabast = parseFloat(reabastField.value) || 0;
    const critico = criticoField ? parseFloat(criticoField.value) || 0 : 2000;

    const fuelBar = document.getElementById("fuel-bar");
    const displayDigital = document.getElementById("fuel-digital-display");
    
    const contenedorFlujo = document.getElementById("contenedor-indicador-flujo");
    const iconoFlujo = document.getElementById("icono-flujo");
    const textoFlujoVelocidad = document.getElementById("texto-flujo-velocidad");
    const etiquetaFlujoEstado = document.getElementById("etiqueta-flujo-estado");

    // Renderizado de la barra del tanque de diésel
    let porcentaje = (inicial / 15000) * 100;
    if(porcentaje > 100) porcentaje = 100;
    
    if (fuelBar) fuelBar.style.height = `${porcentaje}%`;
    if (displayDigital) displayDigital.innerText = `${inicial} L`;

    // Operación limpia del balance de flujo neto
    const balanceNeto = reabast - consumo;

    if (contenedorFlujo && iconoFlujo && textoFlujoVelocidad && etiquetaFlujoEstado) {
        if (balanceNeto >= 0) {
            contenedorFlujo.className = "tarjeta-flujo-estado flujo-llenando";
            iconoFlujo.innerText = "▲";
            textoFlujoVelocidad.innerText = `+${balanceNeto} L/DÍA`;
            etiquetaFlujoEstado.innerText = balanceNeto === 0 ? "ESTABLE" : "RECOMPONIENDO";
        } else {
            contenedorFlujo.className = "tarjeta-flujo-estado flujo-vaciando";
            iconoFlujo.innerText = "▼";
            textoFlujoVelocidad.innerText = `${balanceNeto} L/DÍA`;
            etiquetaFlujoEstado.innerText = "VACIÁNDOSE";
        }
    }

    if (fuelBar) {
        if (inicial <= critico) {
            fuelBar.style.background = "linear-gradient(to top, #7f1d1d, #ff3333)";
            fuelBar.style.boxShadow = "0 0 15px #ff3333";
        } else {
            fuelBar.style.background = "linear-gradient(to top, #15803d, #39ff14)";
            fuelBar.style.boxShadow = "0 0 15px #39ff14";
        }
    }

    // Pasar también el valor crítico calculado para evitar errores
    ejecutarDiagnosticoGondola(inicial, consumo, reabast, critico);
}

// Renderiza el diagnóstico del combustible en el HUD lateral derecho
function ejecutarDiagnosticoGondola(inicial, consumo, reabast, critico) {
    const tituloConsola = document.getElementById("situacion-titulo");
    const cuerpoConsola = document.getElementById("situacion-cuerpo");
    const marquesina = document.getElementById("marquesina-texto");

    if (!tituloConsola || !cuerpoConsola) return; 

    tituloConsola.innerText = "SITUACIÓN: ABASTECIMIENTO";

    if (consumo <= reabast) {
        cuerpoConsola.innerHTML = `Suministro de diésel <span class="stable-highlight">ESTABLE</span>.<br><br>El reabastecimiento cubre el consumo. El inventario no corre peligro.`;
        if (marquesina) marquesina.innerText = "SISTEMA ONLINE: SUMINISTRO DE HIDROCARBUROS BAJO NIVELES REGULARES.";
    } else {
        const deficit = consumo - reabast;
        let dias = Math.ceil((inicial - critico) / deficit);
        if(dias < 0) dias = 0;

        cuerpoConsola.innerHTML = `Alerta: Inventario de carburantes en declive.<br><br>Autonomía estimada hasta nivel crítico: <span class="critical-highlight">${dias} días</span>.<br>Tasa de pérdida neta: -${deficit} L/día.`;
        if (marquesina) marquesina.innerText = "ALERTA SOBERANÍA ENERGÉTIQUES: CRONÓMETRO DE RESTRICCIÓN ACTIVADO.";
    }
}

// 4. SIMULADOR 2: TABLERO DE PRECIOS E INFLACIÓN (100% independiente en su propia pantalla)
const baseIconosMercado = {
    "pollo": "🍗", "carne": "🥩", "leche": "🥛", "arroz": "🍚",
    "papa": "🥔", "aceite": "🍾", "pan": "🍞", "huevo": "🥚", "queso": "🧀"
};

function actualizarIconoEnVivo() {
    const nombreInput = document.getElementById("manual-nombre").value.trim().toLowerCase();
    const iconoDisplay = document.getElementById("res-icono");
    if (!iconoDisplay) return;

    if (baseIconosMercado[nombreInput]) {
        iconoDisplay.innerText = baseIconosMercado[nombreInput];
    } else {
        iconoDisplay.innerText = "🛍️";
    }
}

function calcularInflacionManual() {
    // Captura de todos los elementos del formulario
    const presupuestoField = document.getElementById("manual-presupuesto");
    const nombreField = document.getElementById("manual-nombre");
    const pAnteriorField = document.getElementById("manual-anterior");
    const pActualField = document.getElementById("manual-actual");
    const cantidadField = document.getElementById("manual-cantidad");

    if (!presupuestoField || !nombreField || !pAnteriorField || !pActualField || !cantidadField) return;

    // Conversión de datos
    const presupuesto = parseFloat(presupuestoField.value) || 0;
    const nombre = nombreField.value || "Producto";
    const pAnterior = parseFloat(pAnteriorField.value) || 0;
    const pActual = parseFloat(pActualField.value) || 0;
    const cantidad = parseFloat(cantidadField.value) || 0;

    // Operaciones matemáticas
    const gastoTotalMensual = pActual * cantidad;
    const saldoRestante = presupuesto - gastoTotalMensual;
    
    let porcentajeAlza = 0;
    if (pAnterior > 0) {
        porcentajeAlza = ((pActual - pAnterior) / pAnterior) * 100;
    }

    const perdidaPorInflacion = Math.max(0, pActual - pAnterior) * cantidad;

    // Renderizar resultados en el Ticket de la pantalla
    if(document.getElementById("res-nombre")) document.getElementById("res-nombre").innerText = nombre.toUpperCase();
    if(document.getElementById("res-meta")) document.getElementById("res-meta").innerText = `Consumo: ${cantidad} unidades/mes`;
    if(document.getElementById("res-gasto-total")) document.getElementById("res-gasto-total").innerText = `${gastoTotalMensual.toFixed(0)} Bs`;
    if(document.getElementById("res-porcentaje")) document.getElementById("res-porcentaje").innerText = `+${porcentajeAlza.toFixed(1)}%`;
    if(document.getElementById("res-perdida-pura")) document.getElementById("res-perdida-pura").innerText = `${perdidaPorInflacion.toFixed(0)} Bs`;

    // Pintar el saldo restante con lógica de alertas de color
    const elSaldo = document.getElementById("res-saldo-restante");
    if (elSaldo) {
        elSaldo.innerText = `${saldoRestante.toFixed(0)} Bs`;
        if (saldoRestante < 0) {
            elSaldo.style.color = "#ff3333"; // Rojo si está en números rojos (Déficit)
        } else {
            elSaldo.style.color = "#39ff14"; // Verde si queda dinero disponible
        }
    }
}