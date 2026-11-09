# Prompts

1. Necesito que inicialices el proyecto tanto el back en nest como el front en react pero sin crear archivos que solucionen el programa.

Acepté la creación de nest y react a través de comandos de consola

2. /explain-code De acuerdo con las instrucciones de este archivo (candidate_assessment_mid (1).docx), ¿crees que se deban quitar los repetidos? entendí que el test quiere que no se usen más no cambiar el dataset.
(/explain-code es una skill personal que tengo para que me explique detalladamente el código, todas las skills que utilice las compartiré el el .zip).

3. Según este archivo (candidate_assessment_mid (1).docx) crea la parte 2 (build) solo el backend, mira que para los test necesarios la instrucción no pide modificar ni limpiar `candles_1m.json`: pide probar que los duplicados no afecten el resultado del endpoint.

Acepté todo lo creado, al revisarlo me pareció correcto.

4. /impeccable ahora crea la parte del front según los requerimientos presentes en el archivo (candidate_assessment_mid (1).docx).

/impeccable es otra skill que me ayuda a realizar el front de la mejor manera y además prueba lo que hace inmediatamente

Acepté todo lo creado, es compatible y estaba probado correctamente.
Pero sí pedí una corrección luego en el siguiente prompt.

5. Una cosa a corregir del front es que la parte del ultimo valor del cierre, tapa la gráfica, corrígelo para que nunca se tape no importa donde se ubique la gráfica.

Acepté la corrección.

6. Crea el README.md donde respondas How to run the backend, the frontend and the tests, in 3 commands or fewer.

Acepté los pasos descritos.

# Decisions

1. Decidí no editar `candles_1m.json`; en su lugar, el servicio ignora filas repetidas con el mismo símbolo y timestamp antes de agregarlas. Rechacé limpiar el archivo porque el assessment pide comprobar que los duplicados no alteren la respuesta y conservarlo permite probar ese caso real.

2. Decidí formar cada vela a partir de sus timestamps, calculando open, high, low, close y volumen, y mantener los intervalos parciales que existan en los datos. Rechacé completar los minutos faltantes con velas sintéticas porque el dataset indica que esos minutos no tuvieron operaciones.

3. Decidí que el controller gestione la solicitud y que el servicio concentre la carga y transformación de los datos; además, el test e2e verifica una vela concreta calculada desde el dataset original. Rechacé poner la agregación en el controller o probar únicamente una respuesta simulada, porque así la lógica queda separada y la prueba comprueba el comportamiento integrado.