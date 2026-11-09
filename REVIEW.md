Buenas compañero, revisando el código encuentro algunos puntos de mejora:

1. Bug en /candles/nq: El endpoint de NQ está filtrando por r.symbol === 'MES'. Ahora mismo le está devolviendo los datos de MES a quien consulta NQ.

2. Código duplicado: Estamos repitiendo la misma lógica en ambas rutas. Convendría unificarlo con un parámetro dinámico (tipo /candles/:symbol).

3. Bloqueo del Event Loop: fs.readFileSync lee el archivo del disco de forma síncrona en cada request. En Node.js esto congela el hilo principal mientras lee el disco. Si entran varias peticiones al tiempo, el servidor se nos frena feo. Lo ideal es leer y parsear el archivo en memoria una sola vez al arrancar el servidor (o usar lectura asíncrona si el archivo es gigante).




Lo primero que corregiría: sería el 1, pues es el más fácil y más entendible, es solo una línea.