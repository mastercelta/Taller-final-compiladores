<!-- Descripción del proyecto, cómo ejecutarlo -->

# 📘 Manual de Uso – Compilador Grupo 5

Este es un compilador creado por el Grupo 5 y nos enfocamos en la generación de código intermedio, que es una representación del código fuente más fácil de procesar por la maquina, sea lenguaje maquina o interpretado como es este caso.

---

## ✍️ Sintaxis soportada

### ➕ Declarar variables

```plaintext
def nombreVariable igual expresión;
```

Ejemplo:

```plaintext
def a igual 5;
def b igual a + 2;
```

---

### 👀 Mostrar resultado

```plaintext
mostrar expresión;
```

Ejemplo:

```plaintext
mostrar b;
```

---

### ✅ Operaciones soportadas

- `+` suma
- `-` resta
- `*` multiplicación
- `/` división
- Paréntesis para agrupación

---

## 🧠 ¿Qué hace el compilador?

1. **Análisis léxico** → Separa el código en tokens (palabras clave, variables, operadores…)
2. **Análisis sintáctico** → Verifica si las estructuras son válidas según la gramática
3. **Análisis semántico** → Comprueba si las variables existen y se usan correctamente
4. **Generación de código intermedio** → Crea cuádruplas para representar las operaciones

---

## 💻 ¿Cómo usarlo en el navegador?

1. ✍️ Escribe el código en el área de texto
2. ▶️ Haz clic en **Ejecutar**
   - Si no hay errores, se mostrará la salida
   - También se generará automáticamente el árbol de sintaxis
3. 🌳 Haz clic en **Mostrar Árbol** para ver la estructura del código
4. 📄 Haz clic en **Descargar PDF** para obtener un informe completo con:
   - Tokens generados
   - Imagen del árbol sintáctico
   - Código intermedio en cuádruplas
   - Resultado de ejecución

---

## 📂 Archivos importantes

| Archivo           | Función                                     |
| ----------------- | ------------------------------------------- |
| `lexer.js`        | Analiza el texto y genera tokens            |
| `parser.js`       | Construye el AST (árbol de sintaxis)        |
| `semantic.js`     | Verifica errores de significado (variables) |
| `intermediate.js` | Genera cuádruplas desde el AST              |
| `compiler.js`     | Conecta todo y ejecuta el código            |
| `app.js`          | Lógica del frontend en el navegador         |
| `backend/pdf.js`  | Genera el PDF con el resultado del análisis |

---

## 📦 Ejemplo completo

```plaintext
def a igual 10;
def b igual 2;
def r igual (a + b) * 2;
mostrar r;
```

---

## 🧑‍🔬 Créditos

Grupo 5 – Enfoque: **Generación de Código Intermedio**
