# 🎮 Concéntrate de Código | Juego de Memoria para Programadores

Este es un juego interactivo de memoria ("Concéntrese") diseñado para estudiantes de **10 a 17 años**, reconstruido de forma profesional bajo la arquitectura **React + Vite** y la metodología **Atomic Design**.

El juego corre de forma 100% cliente (sin necesidad de servidores o bases de datos) y cuenta con efectos de sonido sintetizados y almacenamiento de estadísticas a través de tecnologías nativas del navegador.

---

## 🚀 Cómo Iniciar el Proyecto (Desarrollo Local)

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y el gestor de paquetes **pnpm**.

### 1. Instalar dependencias
En la carpeta raíz del proyecto, ejecuta:
```bash
pnpm install
```

### 2. Iniciar el servidor de desarrollo
Para levantar el servidor localmente con recarga rápida (HMR):
```bash
pnpm run dev
```
Abre en tu navegador la dirección que se muestre en consola (generalmente `http://localhost:5173`).

### 3. Compilar para producción (Opcional)
Para generar los archivos estáticos listos para subir a cualquier hosting gratuito (como Vercel, Netlify o GitHub Pages):
```bash
pnpm run build
```
Los archivos optimizados y compilados se guardarán en la carpeta `/dist`.

### 4. Vista previa de la compilación
Para probar localmente la versión de producción ya compilada:
```bash
pnpm run preview
```

---

## 🎨 Características Destacadas

1.  **Dificultad Adaptativa por Niveles:**
    *   **Básico (10-12 años):** Cartas idénticas (concepto + emoji) con explicaciones interactivas del robot de ayuda.
    *   **Intermedio (13-15 años):** Emparejar el **Concepto** con su **Definición conceptual** amigable.
    *   **Avanzado (16-17 años):** Emparejar el **Concepto** con **Sintaxis de código JavaScript real**.
2.  **Configuración del Tutor/Profesor:**
    *   Permite al tutor regular la duración de la partida seleccionando la cantidad de parejas a buscar (mínimo 7, máximo 16).
    *   El tablero y sus coordenadas (ej. A-F, 1-4) recalculan sus dimensiones de forma dinámica.
3.  **Persistencia Real (LocalStorage):**
    *   Guarda la racha diaria de juego (visualizador L-M-M-J-V-S-D), el nivel de programador del jugador y el XP acumulado tras las victorias.
4.  **Efectos de Sonido Sintetizados (Retro 8-bit):**
    *   Utiliza la **Web Audio API** del navegador para generar efectos de sonido y música de fondo de forma programática. No requiere descargar archivos pesados de audio.
5.  **Diseño Responsivo & Premium:**
    *   Interfaz oscura con acentos neón y animaciones 3D fluidas al voltear las cartas.
    *   A diferencia del diseño estático original, en pantallas móviles los paneles de progreso y desafíos no se ocultan; se apilan al final para ser 100% accesibles.

---

## 📂 Estructura de Carpetas (Atomic Design)

El proyecto está organizado de la siguiente manera:

*   `src/components/atoms/`: Componentes básicos e indivisibles (`Button`, `ProgressBar`, `Badge`, `CardFace`, `Slider`).
*   `src/components/molecules/`: Componentes compuestos (`PlayerCard`, `GameCard`, `StreakTracker`, `TipPanel`).
*   `src/components/organisms/`: Secciones complejas de la pantalla (`GameHeader`, `Scoreboard`, `BoardGrid`, `SidebarChallenges`, `RobotDialog`).
*   `src/components/templates/`: Estructura general de la cuadrícula (`GameLayout`).
*   `src/pages/`: Página principal controladora de estado (`GamePage`).
*   `src/data/`: Banco de datos de conceptos por nivel y tips (`concepts.js`).
*   `src/services/`: Motor de síntesis de audio (`sound.js`).
