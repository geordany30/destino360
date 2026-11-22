/* =========================================================
   DESTINO360 - Interactividad del sitio
   Sin dependencias externas: funciona abriendo los .html
   directamente desde el disco (sin conexión).
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Utilidades ---------- */
    function normalizarTexto(texto) {
        if (!texto) return '';
        return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    }

    function parametro(nombre) {
        var match = new RegExp('[?&]' + nombre + '=([^&#]*)').exec(window.location.search);
        return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
    }

    /* ---------- Menú móvil ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var abierto = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            toggle.innerHTML = abierto ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    /* ---------- Botón volver arriba ---------- */
    var toTop = document.querySelector('.to-top');
    if (toTop) {
        window.addEventListener('scroll', function () {
            toTop.classList.toggle('show', window.scrollY > 400);
        });
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Año del footer ---------- */
    document.querySelectorAll('.year').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* ---------- DESTINOS: filtros y búsqueda ---------- */
    var filterButtons = document.querySelectorAll('.filter-btn');
    var destinationCards = document.querySelectorAll('.layout-destinos .card-destino');
    var searchForm = document.querySelector('.search-bar');
    var searchInput = document.querySelector('.search-bar input');
    var resetBtn = document.querySelector('.filter-reset');
    var resultsCount = document.querySelector('.results-count');
    var noResults = document.querySelector('.no-results');

    function aplicarFiltrosYBusqueda() {
        var categoriasActivas = [];
        document.querySelectorAll('.filter-btn.active-filter').forEach(function (boton) {
            categoriasActivas.push(normalizarTexto(boton.getAttribute('data-filter')));
        });
        var query = normalizarTexto(searchInput ? searchInput.value : '');
        var soloOfertas = soloOfertasChk && soloOfertasChk.checked;
        var visibles = 0;

        destinationCards.forEach(function (card) {
            var categoria = normalizarTexto(card.getAttribute('data-category'));
            var nombre = normalizarTexto(card.getAttribute('data-name'));
            var coincideCategoria = categoriasActivas.length === 0 || categoriasActivas.indexOf(categoria) !== -1;
            var coincideBusqueda = query === '' || nombre.indexOf(query) !== -1;
            var coincideOferta = !soloOfertas || card.getAttribute('data-oferta') === '1';
            var mostrar = coincideCategoria && coincideBusqueda && coincideOferta;
            card.hidden = !mostrar;
            if (mostrar) visibles++;
        });

        if (resultsCount) {
            resultsCount.textContent = 'Mostrando ' + visibles + ' de ' + destinationCards.length + ' destinos';
        }
        if (noResults) noResults.classList.toggle('show', visibles === 0);
        ordenar();
    }

    var soloOfertasChk = document.getElementById('solo-ofertas');
    var ordenSel = document.getElementById('orden');
    var gridDestinos = document.querySelector('.layout-destinos .grid-container');
    var ordenOriginal = Array.prototype.slice.call(destinationCards);

    function ordenar() {
        if (!gridDestinos) return;
        var modo = ordenSel ? ordenSel.value : '';
        var lista = ordenOriginal.slice();
        if (modo) {
            lista.sort(function (a, b) {
                var pa = +a.getAttribute('data-precio') || 0, pb = +b.getAttribute('data-precio') || 0;
                return modo === 'asc' ? pa - pb : pb - pa;
            });
        }
        lista.forEach(function (c) { gridDestinos.appendChild(c); });
    }

    if (destinationCards.length > 0) {
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var activo = this.classList.toggle('active-filter');
                this.setAttribute('aria-pressed', activo ? 'true' : 'false');
                aplicarFiltrosYBusqueda();
            });
        });

        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                aplicarFiltrosYBusqueda();
            });
        }
        if (searchInput) searchInput.addEventListener('input', aplicarFiltrosYBusqueda);
        if (soloOfertasChk) soloOfertasChk.addEventListener('change', aplicarFiltrosYBusqueda);
        if (ordenSel) ordenSel.addEventListener('change', aplicarFiltrosYBusqueda);

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                filterButtons.forEach(function (b) {
                    b.classList.remove('active-filter');
                    b.setAttribute('aria-pressed', 'false');
                });
                if (searchInput) searchInput.value = '';
                if (soloOfertasChk) soloOfertasChk.checked = false;
                if (ordenSel) ordenSel.value = '';
                aplicarFiltrosYBusqueda();
            });
        }

        if (parametro('ofertas') === '1' && soloOfertasChk) soloOfertasChk.checked = true;
        // Permite enlazar a una categoría: destinos.html?categoria=playas
        var categoriaInicial = normalizarTexto(parametro('categoria'));
        if (categoriaInicial) {
            filterButtons.forEach(function (b) {
                if (normalizarTexto(b.getAttribute('data-filter')) === categoriaInicial) {
                    b.classList.add('active-filter');
                    b.setAttribute('aria-pressed', 'true');
                }
            });
        }
        aplicarFiltrosYBusqueda();
    }

    /* ---------- SERVICIOS: "Ver más" desplegable ---------- */
    document.querySelectorAll('.toggle-details').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var panel = document.getElementById(btn.getAttribute('aria-controls'));
            var abierto = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', abierto ? 'false' : 'true');
            btn.querySelector('.label').textContent = abierto ? 'VER MÁS' : 'VER MENOS';
            if (panel) panel.classList.toggle('open', !abierto);
        });
    });

    // Si se llega desde otra página con #alojamiento, #transporte, etc., se abre ese servicio
    if (window.location.hash && document.querySelector('.toggle-details')) {
        var tarjeta = document.querySelector(window.location.hash);
        var boton = tarjeta ? tarjeta.querySelector('.toggle-details') : null;
        if (boton && boton.getAttribute('aria-expanded') === 'false') boton.click();
    }

    /* ---------- DETALLE: contenido según ?destino= ---------- */
    var detalle = document.getElementById('detalle-destino');
    if (detalle && typeof DESTINOS !== 'undefined') {
        var id = parametro('destino') || 'cartagena';
        var d = DESTINOS[id] || DESTINOS.cartagena;
        if (!DESTINOS[id]) id = 'cartagena';

        document.title = d.nombre + ' | Destino360';
        document.getElementById('d-titulo').textContent = d.titulo;
        document.getElementById('d-breadcrumb').textContent = d.nombre;
        document.getElementById('d-descripcion').textContent = d.descripcion;
        document.getElementById('d-clima').textContent = d.clima;
        document.getElementById('d-temporada').textContent = d.temporada;
        document.getElementById('d-pais').textContent = d.pais;
        var img = document.getElementById('d-imagen');
        img.src = d.imagen;
        img.alt = d.nombre;
        var precioEl = document.getElementById('d-precio');
        if (precioEl && d.precio) {
            var pf = precioFinal(d.precio, d.descuento);
            precioEl.innerHTML = '<span class="price-from">Desde</span> ' +
                (d.descuento ? '<del>' + formatoCOP(d.precio) + '</del> ' : '') +
                '<strong>' + formatoCOP(pf) + '</strong> <span class="price-unit">/ noche</span>' +
                (d.descuento ? ' <span class="deal-badge inline">-' + d.descuento + '%</span>' : '');
        }

        var galeria = document.getElementById('galeria');
        var galeriaGrid = document.getElementById('d-galeria');
        if (d.galeria && d.galeria.length) {
            galeriaGrid.innerHTML = d.galeria.map(function (g) {
                return '<figure><img src="' + g.img + '" alt="' + g.titulo + '" loading="lazy">' +
                    '<figcaption><strong>' + g.titulo.toUpperCase() + '</strong>' +
                    '<span><i class="fas fa-map-marker-alt"></i> ' + g.texto + '</span></figcaption></figure>';
            }).join('');
            galeria.hidden = false;
        } else {
            galeria.hidden = true;
        }

        document.getElementById('d-imperdibles').innerHTML = d.imperdibles.map(function (it) {
            return '<div class="imperdible"><i class="fas ' + it.icono + '"></i>' +
                '<h3>' + it.titulo + '</h3><p>' + it.texto + '</p></div>';
        }).join('');

        // Otros destinos sugeridos (tres de la misma categoría o, si no hay, otros)
        var otros = Object.keys(DESTINOS).filter(function (k) { return k !== id; });
        otros.sort(function (a, b) {
            return (DESTINOS[b].categoria === d.categoria) - (DESTINOS[a].categoria === d.categoria);
        });
        document.getElementById('d-otros').innerHTML = otros.slice(0, 3).map(function (k) {
            var o = DESTINOS[k];
            return '<article class="card-destino"><div class="card-img"><img src="' + o.imagen + '" alt="' + o.nombre + '" loading="lazy">' +
                '<span class="card-tag">' + o.categoria + '</span></div>' +
                '<div class="card-info"><h3>' + o.nombre + '</h3><p>' + o.pais + '</p>' +
                '<p class="card-price"><span class="price-from">Desde</span> <strong>' + formatoCOP(precioFinal(o.precio, o.descuento)) + '</strong> <span class="price-unit">/ noche</span></p>' +
                '<a class="card-link" href="detalle.html?destino=' + k + '">Ver destino <i class="fas fa-arrow-right"></i></a></div></article>';
        }).join('');
    }

    /* ---------- CONTACTO: formulario ---------- */
    var form = document.getElementById('form-contacto');
    if (form) {
        var selectDestino = document.getElementById('f-destino');
        var selectServicio = document.getElementById('f-servicio');

        if (selectDestino && typeof DESTINOS !== 'undefined') {
            Object.keys(DESTINOS).forEach(function (k) {
                var opt = document.createElement('option');
                opt.value = k;
                opt.textContent = DESTINOS[k].nombre + ' (' + DESTINOS[k].pais + ')';
                selectDestino.appendChild(opt);
            });
            var destinoInicial = parametro('destino');
            if (DESTINOS[destinoInicial]) selectDestino.value = destinoInicial;
        }
        var servicioInicial = parametro('servicio');
        if (selectServicio && servicioInicial) selectServicio.value = servicioInicial;

        var validaciones = {
            'f-nombre': function (v) { return v.length >= 3 ? '' : 'Escribe tu nombre completo.'; },
            'f-correo': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Escribe un correo válido.'; },
            'f-telefono': function (v) { return v === '' || /^[0-9+\s()-]{7,}$/.test(v) ? '' : 'Escribe un teléfono válido.'; },
            'f-mensaje': function (v) { return v.length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres.'; }
        };

        function validarCampo(idCampo) {
            var campo = document.getElementById(idCampo);
            var error = validaciones[idCampo](campo.value.trim());
            var contenedor = campo.closest('.form-field');
            contenedor.classList.toggle('invalid', !!error);
            contenedor.querySelector('.error-msg').textContent = error;
            return !error;
        }

        Object.keys(validaciones).forEach(function (idCampo) {
            document.getElementById(idCampo).addEventListener('blur', function () { validarCampo(idCampo); });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var ok = true;
            Object.keys(validaciones).forEach(function (idCampo) {
                if (!validarCampo(idCampo)) ok = false;
            });
            if (!ok) {
                form.querySelector('.invalid input, .invalid textarea').focus();
                return;
            }

            var nombre = document.getElementById('f-nombre').value.trim();
            var destinoTxt = selectDestino && selectDestino.value ? selectDestino.options[selectDestino.selectedIndex].text : 'Sin definir';
            var servicioTxt = selectServicio && selectServicio.value ? selectServicio.options[selectServicio.selectedIndex].text : 'Sin definir';
            var cuerpo = 'Nombre: ' + nombre +
                '\nCorreo: ' + document.getElementById('f-correo').value.trim() +
                '\nTeléfono: ' + document.getElementById('f-telefono').value.trim() +
                '\nDestino: ' + destinoTxt +
                '\nServicio: ' + servicioTxt +
                '\nFecha de viaje: ' + (document.getElementById('f-fecha').value || 'Sin definir') +
                '\n\n' + document.getElementById('f-mensaje').value.trim();
            var mailto = 'mailto:info@destino360.com?subject=' + encodeURIComponent('Solicitud de viaje - ' + destinoTxt) +
                '&body=' + encodeURIComponent(cuerpo);

            var exito = document.getElementById('form-exito');
            exito.innerHTML = '<i class="fas fa-circle-check"></i> ¡Gracias, <strong></strong>! Recibimos tu solicitud. ' +
                'Para enviarla por correo haz clic aquí: <a href="' + mailto + '">enviar a info@destino360.com</a>.';
            exito.querySelector('strong').textContent = nombre;
            exito.classList.add('show');
            exito.focus();
            form.reset();
        });
    }
});
