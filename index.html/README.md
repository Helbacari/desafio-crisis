# 🔬 Plataforma de Simulación Académica: Logística e Inflación

¡Bienvenido al **Laboratorio de Simulación Económica y Logística**! Esta aplicación web interactiva está diseñada como una herramienta didáctica para que estudiantes y docentes evalúen el impacto de variables críticas en tiempo real, dividida en dos grandes módulos independientes: Gestión de Hidrocarburos (Diésel) e Inflación Alimentaria.

El proyecto cuenta con un diseño limpio, moderno, profesional y es **100% responsivo**, garantizando una visualización óptima en computadoras, tablets y teléfonos celulares sin distorsiones.

---

## 🚀 Características del Proyecto

### 1. ⛽ Módulo de Gestión de Diésel
Simula el comportamiento de almacenamiento y autonomía de carburantes ante crisis de suministro o picos de demanda.
* **Datos de entrada:** Cantidad inicial (L), Consumo diario (L), Reabastecimiento diario (L) y Nivel crítico de reserva (L).
* **Cálculos automáticos:** Tasa de pérdida neta y días de autonomía restantes antes de alcanzar el nivel crítico.
* **Alertas dinámicas:** Clasificación visual por colores (Éxito/Peligro) según la sostenibilidad del inventario.

### 2. 🎛️ Simulador Personalizado de Inflación
Evalúa el impacto financiero del alza de precios de la canasta básica sobre el bolsillo de un hogar.
* **Datos de entrada:** Presupuesto mensual disponible (Bs), Nombre del alimento, Precio anterior (Bs), Precio actual (Bs) y Cantidad consumida al mes.
* **Ticket de resultados:** Renderiza un recibo estilo compra física con fondo diferenciado (color crema) de alta legibilidad que calcula:
  * Gasto mensual total en el producto.
  * Porcentaje real de alza de precios (% de inflación).
  * Dinero puro perdido a causa del incremento.
  * Saldo restante disponible (con alerta en rojo si entra en déficit/deuda).

---

## 🔬 Casos de Prueba Académicos Incluidos

Para facilitar el aprendizaje, ambas pantallas cuentan con **Tablas de Guía Estáticas** que proponen escenarios preconfigurados para validar la exactitud del sistema:

### Módulo Combustible
* **Caso 1 (Consumo Estándar):** Evalúa un ritmo regular con reabastecimiento parcial (Autonomía: 9 días).
* **Caso 2 (Bloqueo de Fronteras):** Simula desabastecimiento total con reabastecimiento en `0` (Autonomía: 4 días).
* **Caso 3 (Equilibrio Operativo):** Suministro idéntico al consumo (Sistema Estable).

### Módulo Alimentos
* **Caso 1 (Inflación Moderada):** Alza porcentual controlada sin romper el presupuesto.
* **Caso 2 (Hiperinflación /局部 Déficit):** Incremento severo que empuja el saldo disponible a números negativos (Déficit).
* **Caso 3 (Estabilidad de Precios):** Variación de precio en 0% para corroborar la consistencia de los saldos.

---

## 🛠️ Tecnologías Utilizadas

La aplicación fue desarrollada utilizando tecnologías web estándar nativas para asegurar ligereza, velocidad de carga y portabilidad:
* **HTML5:** Estructuración semántica y modular del documento.
* **CSS3:** Estilos personalizados apoyados en Variables Globales (`:root`), Flexbox y Grid CSS para el comportamiento responsivo, además de Media Queries adaptadas a todo tipo de pantallas.
* **JavaScript (ES6):** Motor lógico independiente encargado del procesamiento de datos en vivo a través de eventos de escucha (`oninput`, `onclick`).

---

## 📁 Estructura del Proyecto

```text
├── index.html          # Estructura principal y secciones del simulador
├── css/
│   └── estilos.css    # Paleta corporativa, layouts flexibles y estilos del ticket
└── js/
    └── script.js       # Lógica matemática, control de alertas y navegación
