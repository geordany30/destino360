/* =========================================================
   DESTINO360 - Información de cada destino
   Se usa en detalle.html (detalle.html?destino=<id>)
   y en contacto.html (lista de destinos del formulario).
   ========================================================= */
var DESTINOS = {
    "cartagena": {
        nombre: "Cartagena",
        pais: "Colombia",
        categoria: "ciudades",
        titulo: "Descubre la magia de la Ciudad Amurallada de Cartagena.",
        descripcion: "La Ciudad Vieja se fundó en el siglo XVI, con plazas, calles de adoquines y edificios coloniales coloridos. Con un clima tropical, la ciudad también es un destino popular por sus playas.",
        imagen: "assets/img/destinos/cartagena.jpg",
        clima: "Tropical, 28 °C promedio",
        temporada: "Diciembre a abril",
        galeria: [
            { img: "assets/img/detalle/playas.jpg", titulo: "Playas", texto: "alrededor de la ciudad" },
            { img: "assets/img/detalle/gastronomia.jpg", titulo: "Gastronomía", texto: "gastronomía y tradición" },
            { img: "assets/img/detalle/islas-del-rosario.jpg", titulo: "Islas del Rosario", texto: "a 45 minutos en lancha" }
        ],
        imperdibles: [
            { icono: "fa-chess-rook", titulo: "Castillo San Felipe", texto: "La fortaleza española más grande de América." },
            { icono: "fa-person-walking", titulo: "Getsemaní", texto: "Murales, música y vida de barrio." },
            { icono: "fa-sun", titulo: "Atardecer en la muralla", texto: "El mejor plan al caer la tarde." }
        ]
    },
    "madrid": {
        nombre: "Madrid",
        pais: "España",
        categoria: "ciudades",
        titulo: "Madrid: arte, historia y vida que nunca se detiene.",
        descripcion: "La capital española combina museos de talla mundial como el Prado, amplios parques como El Retiro y una animada vida de tapas en sus barrios tradicionales.",
        imagen: "assets/img/destinos/madrid.jpg",
        clima: "Continental, 15 °C promedio",
        temporada: "Abril a junio y septiembre a octubre",
        imperdibles: [
            { icono: "fa-landmark", titulo: "Puerta de Alcalá", texto: "Uno de los símbolos de la ciudad." },
            { icono: "fa-palette", titulo: "Museo del Prado", texto: "Velázquez, Goya y El Greco." },
            { icono: "fa-tree", titulo: "Parque del Retiro", texto: "Paseos en barca y jardines." }
        ]
    },
    "cancun": {
        nombre: "Cancún",
        pais: "México",
        categoria: "playas",
        titulo: "Cancún: aguas turquesa en el Caribe mexicano.",
        descripcion: "Playas de arena blanca, arrecifes para bucear y la cercanía a sitios mayas hacen de Cancún uno de los destinos de sol y playa más visitados del mundo.",
        imagen: "assets/img/destinos/cancun.jpg",
        clima: "Tropical, 27 °C promedio",
        temporada: "Diciembre a abril",
        imperdibles: [
            { icono: "fa-umbrella-beach", titulo: "Zona hotelera", texto: "Kilómetros de playa frente al mar Caribe." },
            { icono: "fa-fish", titulo: "Isla Mujeres", texto: "Snorkel y arrecifes de coral." },
            { icono: "fa-monument", titulo: "Chichén Itzá", texto: "Maravilla maya a pocas horas." }
        ]
    },
    "roma": {
        nombre: "Roma",
        pais: "Italia",
        categoria: "ciudades",
        titulo: "Roma: la ciudad eterna te espera.",
        descripcion: "Caminar por Roma es recorrer más de 2.000 años de historia: el Coliseo, el Foro Romano, la Fontana di Trevi y el Vaticano en una sola ciudad.",
        imagen: "assets/img/destinos/roma.jpg",
        clima: "Mediterráneo, 18 °C promedio",
        temporada: "Abril a junio y septiembre a octubre",
        imperdibles: [
            { icono: "fa-landmark-dome", titulo: "Coliseo", texto: "El anfiteatro más famoso del mundo." },
            { icono: "fa-church", titulo: "Vaticano", texto: "Basílica de San Pedro y Capilla Sixtina." },
            { icono: "fa-pizza-slice", titulo: "Trastevere", texto: "Cocina romana auténtica." }
        ]
    },
    "japon": {
        nombre: "Japón",
        pais: "Japón",
        categoria: "templos",
        titulo: "Japón: tradición milenaria y modernidad.",
        descripcion: "Santuarios sintoístas, templos budistas y ciudades futuristas conviven en un país donde cada estación ofrece un paisaje distinto.",
        imagen: "assets/img/destinos/japon.jpg",
        clima: "Templado, cuatro estaciones",
        temporada: "Marzo a mayo (cerezos en flor)",
        imperdibles: [
            { icono: "fa-torii-gate", titulo: "Santuario Meiji", texto: "Un bosque sagrado en pleno Tokio." },
            { icono: "fa-train", titulo: "Tren bala", texto: "Tokio a Kioto en poco más de 2 horas." },
            { icono: "fa-bowl-rice", titulo: "Gastronomía", texto: "Sushi, ramen y mercados locales." }
        ]
    },
    "jinan-park": {
        nombre: "Jinan Park",
        pais: "China",
        categoria: "montañas",
        titulo: "Jinan: la ciudad de los manantiales.",
        descripcion: "Parques con lagos, sauces y manantiales naturales, rodeados de colinas como el monte Qianfo, ideales para paseos en bote y caminatas.",
        imagen: "assets/img/destinos/jinan-park.jpg",
        clima: "Templado, 14 °C promedio",
        temporada: "Abril a octubre",
        imperdibles: [
            { icono: "fa-water", titulo: "Lago Daming", texto: "Paseos en bote entre sauces." },
            { icono: "fa-mountain", titulo: "Monte Qianfo", texto: "Mil budas tallados en la montaña." },
            { icono: "fa-droplet", titulo: "Manantial Baotu", texto: "El manantial más famoso de la ciudad." }
        ]
    },
    "pueblo": {
        nombre: "Pueblo (Village)",
        pais: "Inglaterra",
        categoria: "ciudades",
        titulo: "Los pueblos de los Cotswolds.",
        descripcion: "Casas de piedra color miel, calles tranquilas y jardines floridos: los pueblos de la campiña inglesa parecen salidos de un cuento.",
        imagen: "assets/img/destinos/pueblo.jpg",
        clima: "Oceánico, 11 °C promedio",
        temporada: "Mayo a septiembre",
        imperdibles: [
            { icono: "fa-house-chimney", titulo: "Castle Combe", texto: "Uno de los pueblos más bonitos de Inglaterra." },
            { icono: "fa-mug-hot", titulo: "Té de la tarde", texto: "Tradición en salones históricos." },
            { icono: "fa-person-hiking", titulo: "Senderos", texto: "Caminatas entre colinas verdes." }
        ]
    },
    "india": {
        nombre: "India (Taj Mahal)",
        pais: "India",
        categoria: "templos",
        titulo: "India: el Taj Mahal y mucho más.",
        descripcion: "El Taj Mahal en Agra es uno de los monumentos más admirados del planeta. India ofrece además templos, palacios, especias y una cultura vibrante.",
        imagen: "assets/img/destinos/india.jpg",
        clima: "Tropical, varía por región",
        temporada: "Octubre a marzo",
        imperdibles: [
            { icono: "fa-mosque", titulo: "Taj Mahal", texto: "Visítalo al amanecer." },
            { icono: "fa-chess-rook", titulo: "Fuerte de Agra", texto: "Fortaleza mogol de arenisca roja." },
            { icono: "fa-pepper-hot", titulo: "Cocina india", texto: "Curry, especias y street food." }
        ]
    },
    "inglaterra": {
        nombre: "Inglaterra",
        pais: "Reino Unido",
        categoria: "templos",
        titulo: "Inglaterra: historia antigua y ciudades vibrantes.",
        descripcion: "Desde el misterioso Stonehenge hasta el Londres moderno, Inglaterra combina monumentos prehistóricos, castillos y museos gratuitos.",
        imagen: "assets/img/destinos/inglaterra.jpg",
        clima: "Oceánico, 11 °C promedio",
        temporada: "Mayo a septiembre",
        imperdibles: [
            { icono: "fa-monument", titulo: "Stonehenge", texto: "Círculo de piedras de 5.000 años." },
            { icono: "fa-crown", titulo: "Londres", texto: "Palacio de Buckingham y la Torre." },
            { icono: "fa-building-columns", titulo: "Museos", texto: "British Museum con entrada libre." }
        ]
    },
    "corea": {
        nombre: "Corea",
        pais: "Corea del Sur",
        categoria: "templos",
        titulo: "Corea del Sur: palacios, templos y cultura pop.",
        descripcion: "Seúl mezcla palacios reales y pabellones tradicionales con barrios modernos llenos de tecnología, moda y gastronomía callejera.",
        imagen: "assets/img/destinos/corea.jpg",
        clima: "Continental, cuatro estaciones",
        temporada: "Abril a mayo y septiembre a noviembre",
        imperdibles: [
            { icono: "fa-place-of-worship", titulo: "Gyeongbokgung", texto: "El gran palacio de la dinastía Joseon." },
            { icono: "fa-leaf", titulo: "Otoño coreano", texto: "Arces rojos en parques y montañas." },
            { icono: "fa-utensils", titulo: "Mercado Gwangjang", texto: "Comida callejera tradicional." }
        ]
    },
    "colombia": {
        nombre: "Colombia",
        pais: "Colombia",
        categoria: "playas",
        titulo: "Colombia: el riesgo es que te quieras quedar.",
        descripcion: "Playas caribeñas, selva, montañas y pueblos coloridos. Colombia es uno de los países con mayor biodiversidad del mundo.",
        imagen: "assets/img/destinos/colombia.jpg",
        clima: "Tropical, varía por altitud",
        temporada: "Diciembre a marzo y julio a agosto",
        imperdibles: [
            { icono: "fa-umbrella-beach", titulo: "Parque Tayrona", texto: "Playas entre selva y montaña." },
            { icono: "fa-mug-saucer", titulo: "Eje Cafetero", texto: "Fincas cafeteras y valle del Cocora." },
            { icono: "fa-city", titulo: "Medellín", texto: "La ciudad de la eterna primavera." }
        ]
    },
    "italia": {
        nombre: "Italia",
        pais: "Italia",
        categoria: "montañas",
        titulo: "Italia: lagos, montañas y pueblos de postal.",
        descripcion: "El norte de Italia sorprende con lagos alpinos como el de Como, rodeados de montañas y pueblos de colores junto al agua.",
        imagen: "assets/img/destinos/italia.jpg",
        clima: "Mediterráneo y alpino",
        temporada: "Mayo a septiembre",
        imperdibles: [
            { icono: "fa-ship", titulo: "Lago de Como", texto: "Recorridos en ferry entre pueblos." },
            { icono: "fa-mountain-sun", titulo: "Dolomitas", texto: "Picos espectaculares para caminar." },
            { icono: "fa-wine-glass", titulo: "Gastronomía", texto: "Pasta fresca, quesos y vinos." }
        ]
    },
    "estados-unidos": {
        nombre: "Estados Unidos",
        pais: "Estados Unidos",
        categoria: "montañas",
        titulo: "Estados Unidos: paisajes naturales inolvidables.",
        descripcion: "Cañones de roca rojiza como el Antelope Canyon, parques nacionales y grandes ciudades: un país con aventuras para todos los gustos.",
        imagen: "assets/img/destinos/estados-unidos.jpg",
        clima: "Variado según el estado",
        temporada: "Abril a octubre",
        imperdibles: [
            { icono: "fa-mountain", titulo: "Antelope Canyon", texto: "Formaciones de arenisca en Arizona." },
            { icono: "fa-tree", titulo: "Parques nacionales", texto: "Gran Cañón, Yosemite y Zion." },
            { icono: "fa-car", titulo: "Ruta 66", texto: "El viaje por carretera más famoso." }
        ]
    }
};

/* =========================================================
   PRECIOS Y OFERTAS (pesos colombianos, COP)
   precio = valor por noche de la habitación estándar (hasta 2 personas)
   descuento = % de oferta (0 = sin oferta)
   ========================================================= */
var PRECIOS = {
    "cartagena":      { precio: 280000, descuento: 15 },
    "madrid":         { precio: 450000, descuento: 0 },
    "cancun":         { precio: 520000, descuento: 20 },
    "roma":           { precio: 480000, descuento: 0 },
    "japon":          { precio: 600000, descuento: 0 },
    "jinan-park":     { precio: 350000, descuento: 10 },
    "pueblo":         { precio: 420000, descuento: 0 },
    "india":          { precio: 300000, descuento: 25 },
    "inglaterra":     { precio: 500000, descuento: 0 },
    "corea":          { precio: 450000, descuento: 0 },
    "colombia":       { precio: 250000, descuento: 10 },
    "italia":         { precio: 470000, descuento: 0 },
    "estados-unidos": { precio: 550000, descuento: 0 }
};

/* Tipos de alojamiento disponibles en cada destino (precio = precio base x factor) */
var TIPOS_ALOJAMIENTO = [
    { id: "hostal",  prefijo: "Hostal Viajero", estrellas: 3, puntaje: 8.1, factor: 0.7, imagen: "assets/img/servicios/alojamiento.jpg",
      incluye: ["Wifi gratis", "Desayuno", "Cancelación gratis"] },
    { id: "hotel",   prefijo: "Hotel Plaza",    estrellas: 4, puntaje: 8.8, factor: 1.0, imagen: "assets/img/detalle/islas-del-rosario.jpg",
      incluye: ["Wifi gratis", "Desayuno buffet", "Piscina", "Cancelación gratis"] },
    { id: "resort",  prefijo: "Gran Resort",    estrellas: 5, puntaje: 9.3, factor: 1.6, imagen: "assets/img/portadas/hero-destino.jpg",
      incluye: ["Todo incluido", "Spa", "Piscina", "Traslado aeropuerto", "Cancelación gratis"] }
];

/* Servicios adicionales que se pueden sumar a la reserva */
var EXTRAS = [
    { id: "traslado", nombre: "Traslado aeropuerto - hotel (ida y vuelta)", precio: 120000, tipo: "reserva", icono: "fa-van-shuttle" },
    { id: "tour",     nombre: "Tour guiado por la ciudad",                  precio: 180000, tipo: "persona", icono: "fa-map-marked-alt" },
    { id: "seguro",   nombre: "Asistencia al viajero (seguro médico)",      precio: 25000,  tipo: "persona-noche", icono: "fa-shield-alt" }
];

var RECARGO_FIN_DE_SEMANA = 0.15;   // viernes y sábado +15 %
var RECARGO_PERSONA_EXTRA = 0.35;   // por cada huésped adicional a 2 por habitación

Object.keys(PRECIOS).forEach(function (k) {
    if (DESTINOS[k]) {
        DESTINOS[k].precio = PRECIOS[k].precio;
        DESTINOS[k].descuento = PRECIOS[k].descuento;
    }
});

function formatoCOP(valor) {
    return '$ ' + Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' COP';
}

function precioFinal(precio, descuento) {
    return Math.round(precio * (1 - (descuento || 0) / 100) / 100) * 100;
}
