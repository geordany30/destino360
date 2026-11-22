/* =========================================================
   DESTINO360 - Precios, ofertas y sistema de reservas
   Las reservas se guardan en el navegador (localStorage),
   así el registro funciona sin servidor y sin conexión.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
    if (typeof DESTINOS === 'undefined') return;

    var CLAVE = 'destino360_reservas';
    var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    var DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

    /* ---------- Fechas (siempre en hora local) ---------- */
    function aISO(f) {
        return f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + ('0' + f.getDate()).slice(-2);
    }
    function deISO(s) {
        var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
        return p ? new Date(+p[1], +p[2] - 1, +p[3]) : null;
    }
    function sumarDias(f, n) { var r = new Date(f); r.setDate(r.getDate() + n); return r; }
    function hoy() { var h = new Date(); return new Date(h.getFullYear(), h.getMonth(), h.getDate()); }
    function fechaLarga(f) { return DIAS[f.getDay()] + ' ' + f.getDate() + ' ' + MESES[f.getMonth()] + ' ' + f.getFullYear(); }
    function noches(e, s) { return Math.round((s - e) / 86400000); }

    function escapar(t) {
        return String(t).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function parametro(nombre) {
        var m = new RegExp('[?&]' + nombre + '=([^&#]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    }

    /* ---------- Registro de reservas (localStorage) ---------- */
    function leerReservas() {
        try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return []; }
    }
    function guardarReservas(lista) {
        try { localStorage.setItem(CLAVE, JSON.stringify(lista)); return true; } catch (e) { return false; }
    }

    /* ---------- Precios en tarjetas ---------- */
    document.querySelectorAll('[data-precio-id]').forEach(function (el) {
        var d = DESTINOS[el.getAttribute('data-precio-id')];
        if (!d) return;
        var final = precioFinal(d.precio, d.descuento);
        el.innerHTML = '<span class="price-from">Desde</span> ' +
            (d.descuento ? '<del>' + formatoCOP(d.precio) + '</del> ' : '') +
            '<strong>' + formatoCOP(final) + '</strong> <span class="price-unit">/ noche</span>';
    });
    document.querySelectorAll('[data-oferta-id]').forEach(function (el) {
        var d = DESTINOS[el.getAttribute('data-oferta-id')];
        if (d && d.descuento) { el.textContent = '-' + d.descuento + '%'; el.hidden = false; }
    });
    document.querySelectorAll('.card-destino[data-id]').forEach(function (card) {
        var d = DESTINOS[card.getAttribute('data-id')];
        if (d) {
            card.setAttribute('data-precio', precioFinal(d.precio, d.descuento));
            card.setAttribute('data-oferta', d.descuento ? '1' : '0');
        }
    });

    /* ---------- Buscadores de reservas (inicio, detalle, reservas) ---------- */
    document.querySelectorAll('.booking-search').forEach(function (form) {
        var sel = form.querySelector('[name="destino"]');
        var ent = form.querySelector('[name="entrada"]');
        var sal = form.querySelector('[name="salida"]');

        if (sel && sel.options.length <= 1) {
            Object.keys(DESTINOS).forEach(function (k) {
                var o = document.createElement('option');
                o.value = k;
                o.textContent = DESTINOS[k].nombre + ' (' + DESTINOS[k].pais + ')' + (DESTINOS[k].descuento ? ' · -' + DESTINOS[k].descuento + '%' : '');
                sel.appendChild(o);
            });
        }

        // Valores iniciales: lo que venga en la URL o una semana desde hoy por 3 noches
        var h = hoy();
        ['destino', 'adultos', 'ninos', 'habitaciones'].forEach(function (n) {
            var campo = form.querySelector('[name="' + n + '"]');
            var v = parametro(n);
            if (campo && v && campo.tagName === 'SELECT' && campo.querySelector('option[value="' + v + '"]')) campo.value = v;
        });
        if (sel && form.getAttribute('data-destino') && !parametro('destino')) sel.value = form.getAttribute('data-destino');

        var e0 = deISO(parametro('entrada'));
        var s0 = deISO(parametro('salida'));
        if (!e0 || e0 < h) e0 = sumarDias(h, 7);
        if (!s0 || s0 <= e0) s0 = sumarDias(e0, 3);
        ent.min = aISO(h);
        ent.value = aISO(e0);
        sal.min = aISO(sumarDias(e0, 1));
        sal.value = aISO(s0);

        var resumen = form.querySelector('.booking-nights');
        function actualizarNoches() {
            var e = deISO(ent.value), s = deISO(sal.value);
            if (resumen) resumen.textContent = (e && s && s > e) ? noches(e, s) + ' noche(s)' : '';
        }
        ent.addEventListener('change', function () {
            var e = deISO(ent.value);
            if (!e) return;
            if (e < h) { e = h; ent.value = aISO(h); }
            sal.min = aISO(sumarDias(e, 1));
            var s = deISO(sal.value);
            if (!s || s <= e) sal.value = aISO(sumarDias(e, 3));
            actualizarNoches();
        });
        sal.addEventListener('change', actualizarNoches);
        actualizarNoches();

        form.addEventListener('submit', function (ev) {
            var e = deISO(ent.value), s = deISO(sal.value);
            var err = form.querySelector('.booking-error');
            var msg = '';
            if (sel && !sel.value) msg = 'Elige un destino.';
            else if (!e || !s) msg = 'Elige las fechas de entrada y salida.';
            else if (e < h) msg = 'La fecha de entrada no puede ser anterior a hoy.';
            else if (s <= e) msg = 'La salida debe ser posterior a la entrada.';
            else if (noches(e, s) > 30) msg = 'Puedes reservar máximo 30 noches.';
            if (msg) {
                ev.preventDefault();
                if (err) { err.textContent = msg; err.hidden = false; } else { alert(msg); }
            }
        });
    });

    /* ---------- Página de reservas ---------- */
    var resultados = document.getElementById('resultados');
    if (!resultados) return;

    var paso2 = document.getElementById('paso-confirmar');
    var confirmacion = document.getElementById('confirmacion');
    var busqueda = null;

    function calcularAlojamiento(destinoId, tipo, b) {
        var d = DESTINOS[destinoId];
        var base = precioFinal(d.precio * tipo.factor, d.descuento);
        var sinDescuento = Math.round(d.precio * tipo.factor / 100) * 100;
        var huespedes = b.adultos + b.ninos;
        var extraPorHab = Math.max(0, huespedes - 2 * b.habitaciones);
        var detalle = [], total = 0, totalSinDescuento = 0, fines = 0;
        for (var i = 0; i < b.noches; i++) {
            var f = sumarDias(b.entrada, i);
            var esFinde = f.getDay() === 5 || f.getDay() === 6;
            if (esFinde) fines++;
            var factorDia = esFinde ? 1 + RECARGO_FIN_DE_SEMANA : 1;
            var valor = (base * b.habitaciones + base * RECARGO_PERSONA_EXTRA * extraPorHab) * factorDia;
            var valorSD = (sinDescuento * b.habitaciones + sinDescuento * RECARGO_PERSONA_EXTRA * extraPorHab) * factorDia;
            valor = Math.round(valor / 100) * 100;
            detalle.push({ fecha: f, valor: valor, finde: esFinde });
            total += valor;
            totalSinDescuento += Math.round(valorSD / 100) * 100;
        }
        return { base: base, total: total, totalSinDescuento: totalSinDescuento, detalle: detalle, fines: fines, extraPersonas: extraPorHab };
    }

    function leerBusqueda() {
        var id = parametro('destino');
        var e = deISO(parametro('entrada')), s = deISO(parametro('salida'));
        if (!DESTINOS[id] || !e || !s || s <= e || e < hoy()) return null;
        return {
            destino: id,
            entrada: e,
            salida: s,
            noches: Math.min(noches(e, s), 30),
            adultos: Math.max(1, parseInt(parametro('adultos'), 10) || 2),
            ninos: Math.max(0, parseInt(parametro('ninos'), 10) || 0),
            habitaciones: Math.max(1, parseInt(parametro('habitaciones'), 10) || 1)
        };
    }

    function estrellas(n) { return new Array(n + 1).join('<i class="fas fa-star"></i>'); }

    function mostrarResultados() {
        busqueda = leerBusqueda();
        if (!busqueda) {
            resultados.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-days"></i>' +
                '<p>Elige destino, fechas y huéspedes en el buscador para ver disponibilidad y precios.</p></div>';
            return;
        }
        var d = DESTINOS[busqueda.destino];
        var b = busqueda;
        var cab = '<div class="results-head"><div><h2>' + escapar(d.nombre) + ', ' + escapar(d.pais) + '</h2>' +
            '<p>' + fechaLarga(b.entrada) + ' → ' + fechaLarga(b.salida) + ' · ' + b.noches + ' noche(s) · ' +
            b.adultos + ' adulto(s)' + (b.ninos ? ', ' + b.ninos + ' niño(s)' : '') + ' · ' + b.habitaciones + ' habitación(es)</p></div>' +
            (d.descuento ? '<span class="deal-badge big">Oferta -' + d.descuento + '%</span>' : '') + '</div>';

        var tarjetas = TIPOS_ALOJAMIENTO.map(function (t) {
            var c = calcularAlojamiento(b.destino, t, b);
            return '<article class="hotel-card">' +
                '<img src="' + t.imagen + '" alt="' + escapar(t.prefijo) + '" loading="lazy">' +
                '<div class="hotel-body">' +
                '<h3>' + escapar(t.prefijo + ' ' + d.nombre) + '</h3>' +
                '<div class="hotel-stars" aria-label="' + t.estrellas + ' estrellas">' + estrellas(t.estrellas) + '</div>' +
                '<ul class="hotel-incluye">' + t.incluye.map(function (x) { return '<li><i class="fas fa-check"></i> ' + x + '</li>'; }).join('') + '</ul>' +
                '<p class="hotel-nota">' + c.fines + ' noche(s) de fin de semana con recargo del ' + Math.round(RECARGO_FIN_DE_SEMANA * 100) + '%' +
                (c.extraPersonas ? ' · ' + c.extraPersonas + ' huésped(es) adicional(es)' : '') + '</p>' +
                '</div>' +
                '<div class="hotel-price">' +
                '<span class="score">' + t.puntaje.toFixed(1) + '</span>' +
                '<span class="muted">' + formatoCOP(c.base) + ' / noche</span>' +
                (d.descuento ? '<del>' + formatoCOP(c.totalSinDescuento) + '</del>' : '') +
                '<strong>' + formatoCOP(c.total) + '</strong>' +
                '<span class="muted">Total ' + b.noches + ' noche(s), impuestos incluidos</span>' +
                '<button type="button" class="btn-secondary" data-tipo="' + t.id + '">Reservar <i class="fas fa-arrow-right"></i></button>' +
                '</div></article>';
        }).join('');

        resultados.innerHTML = cab + tarjetas;
        resultados.querySelectorAll('[data-tipo]').forEach(function (btn) {
            btn.addEventListener('click', function () { abrirPaso2(btn.getAttribute('data-tipo')); });
        });
    }

    var seleccion = null;

    function totalExtras(b) {
        var personas = b.adultos + b.ninos, suma = 0, filas = [];
        EXTRAS.forEach(function (x) {
            var chk = document.getElementById('extra-' + x.id);
            if (!chk || !chk.checked) return;
            var v = x.tipo === 'reserva' ? x.precio : x.tipo === 'persona' ? x.precio * personas : x.precio * personas * b.noches;
            suma += v;
            filas.push({ nombre: x.nombre, valor: v });
        });
        return { total: suma, filas: filas };
    }

    function pintarResumen() {
        var b = busqueda, d = DESTINOS[b.destino], c = seleccion.calculo, ex = totalExtras(b);
        var filasNoches = c.detalle.map(function (n) {
            return '<tr><td>' + fechaLarga(n.fecha) + (n.finde ? ' <span class="tag-finde">fin de semana</span>' : '') + '</td><td>' + formatoCOP(n.valor) + '</td></tr>';
        }).join('');
        var filasExtras = ex.filas.map(function (f) {
            return '<tr><td>' + escapar(f.nombre) + '</td><td>' + formatoCOP(f.valor) + '</td></tr>';
        }).join('');
        var total = c.total + ex.total;
        seleccion.total = total;
        seleccion.extras = ex.filas.map(function (f) { return f.nombre; });
        document.getElementById('resumen').innerHTML =
            '<h3>' + escapar(seleccion.tipo.prefijo + ' ' + d.nombre) + '</h3>' +
            '<p class="muted">' + fechaLarga(b.entrada) + ' → ' + fechaLarga(b.salida) + '</p>' +
            '<table class="price-table"><tbody>' + filasNoches +
            (d.descuento ? '<tr class="ahorro"><td>Ahorro por oferta (-' + d.descuento + '%)</td><td>- ' + formatoCOP(c.totalSinDescuento - c.total) + '</td></tr>' : '') +
            filasExtras + '</tbody><tfoot><tr><td>Total</td><td>' + formatoCOP(total) + '</td></tr></tfoot></table>';
    }

    function abrirPaso2(tipoId) {
        var tipo = TIPOS_ALOJAMIENTO.filter(function (t) { return t.id === tipoId; })[0];
        seleccion = { tipo: tipo, calculo: calcularAlojamiento(busqueda.destino, tipo, busqueda) };
        var lista = document.getElementById('lista-extras');
        lista.innerHTML = EXTRAS.map(function (x) {
            var unidad = x.tipo === 'reserva' ? 'por reserva' : x.tipo === 'persona' ? 'por persona' : 'por persona / noche';
            return '<label class="extra"><input type="checkbox" id="extra-' + x.id + '"> <i class="fas ' + x.icono + '"></i> ' +
                '<span>' + x.nombre + '</span><strong>' + formatoCOP(x.precio) + ' <small>' + unidad + '</small></strong></label>';
        }).join('');
        lista.querySelectorAll('input').forEach(function (i) { i.addEventListener('change', pintarResumen); });
        pintarResumen();
        confirmacion.hidden = true;
        paso2.hidden = false;
        paso2.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById('volver-resultados').addEventListener('click', function () {
        paso2.hidden = true;
        resultados.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('form-huesped').addEventListener('submit', function (ev) {
        ev.preventDefault();
        var f = ev.target, ok = true;
        var reglas = {
            'h-nombre': function (v) { return v.length >= 3 ? '' : 'Escribe el nombre del titular.'; },
            'h-documento': function (v) { return /^[0-9A-Za-z-]{5,}$/.test(v) ? '' : 'Escribe un documento válido.'; },
            'h-correo': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Escribe un correo válido.'; },
            'h-telefono': function (v) { return /^[0-9+\s()-]{7,}$/.test(v) ? '' : 'Escribe un teléfono válido.'; }
        };
        Object.keys(reglas).forEach(function (id) {
            var campo = document.getElementById(id);
            var error = reglas[id](campo.value.trim());
            var cont = campo.closest('.form-field');
            cont.classList.toggle('invalid', !!error);
            cont.querySelector('.error-msg').textContent = error;
            if (error) ok = false;
        });
        if (!document.getElementById('h-terminos').checked) {
            ok = false;
            document.getElementById('h-terminos-error').textContent = 'Debes aceptar las condiciones de la reserva.';
        } else {
            document.getElementById('h-terminos-error').textContent = '';
        }
        if (!ok) return;

        var b = busqueda, d = DESTINOS[b.destino];
        var codigo = 'D360-' + Date.now().toString(36).toUpperCase().slice(-6);
        var reserva = {
            codigo: codigo,
            creada: aISO(new Date()),
            destino: b.destino,
            destinoNombre: d.nombre + ', ' + d.pais,
            alojamiento: seleccion.tipo.prefijo + ' ' + d.nombre,
            entrada: aISO(b.entrada),
            salida: aISO(b.salida),
            noches: b.noches,
            adultos: b.adultos,
            ninos: b.ninos,
            habitaciones: b.habitaciones,
            extras: seleccion.extras,
            total: seleccion.total,
            titular: document.getElementById('h-nombre').value.trim(),
            correo: document.getElementById('h-correo').value.trim(),
            estado: 'Confirmada'
        };
        var lista = leerReservas();
        lista.unshift(reserva);
        var guardada = guardarReservas(lista);

        confirmacion.innerHTML = '<i class="fas fa-circle-check"></i><div><h2>¡Reserva confirmada!</h2>' +
            '<p>Código de reserva: <strong>' + codigo + '</strong></p>' +
            '<p>' + escapar(reserva.alojamiento) + ' · ' + fechaLarga(b.entrada) + ' → ' + fechaLarga(b.salida) + ' · Total ' + formatoCOP(reserva.total) + '</p>' +
            '<p class="muted">' + (guardada ? 'La reserva quedó registrada en "Mis reservas".' : 'Tu navegador no permite guardar datos; anota tu código de reserva.') + '</p>' +
            '<a class="btn-secondary" href="#mis-reservas">Ver mis reservas <i class="fas fa-arrow-down"></i></a></div>';
        confirmacion.hidden = false;
        paso2.hidden = true;
        f.reset();
        mostrarMisReservas();
        confirmacion.scrollIntoView({ behavior: 'smooth' });
    });

    function mostrarMisReservas() {
        var cont = document.getElementById('lista-reservas');
        var lista = leerReservas();
        if (!lista.length) {
            cont.innerHTML = '<p class="muted">Aún no tienes reservas registradas.</p>';
            return;
        }
        cont.innerHTML = '<div class="table-wrap"><table class="reservas-table"><thead><tr>' +
            '<th>Código</th><th>Destino</th><th>Alojamiento</th><th>Entrada</th><th>Salida</th><th>Noches</th><th>Huéspedes</th><th>Total</th><th>Estado</th><th></th>' +
            '</tr></thead><tbody>' + lista.map(function (r, i) {
                var e = deISO(r.entrada), s = deISO(r.salida);
                return '<tr class="' + (r.estado === 'Cancelada' ? 'cancelada' : '') + '">' +
                    '<td data-label="Código"><strong>' + escapar(r.codigo) + '</strong></td>' +
                    '<td data-label="Destino">' + escapar(r.destinoNombre) + '</td>' +
                    '<td data-label="Alojamiento">' + escapar(r.alojamiento) + (r.extras && r.extras.length ? '<br><small>+ ' + r.extras.map(escapar).join(', ') + '</small>' : '') + '</td>' +
                    '<td data-label="Entrada">' + (e ? fechaLarga(e) : '') + '</td>' +
                    '<td data-label="Salida">' + (s ? fechaLarga(s) : '') + '</td>' +
                    '<td data-label="Noches">' + r.noches + '</td>' +
                    '<td data-label="Huéspedes">' + (r.adultos + r.ninos) + '</td>' +
                    '<td data-label="Total">' + formatoCOP(r.total) + '</td>' +
                    '<td data-label="Estado"><span class="estado ' + (r.estado === 'Cancelada' ? 'off' : 'on') + '">' + r.estado + '</span></td>' +
                    '<td>' + (r.estado === 'Cancelada' ? '' : '<button type="button" class="link-btn" data-cancelar="' + i + '">Cancelar</button>') + '</td>' +
                    '</tr>';
            }).join('') + '</tbody></table></div>';
        cont.querySelectorAll('[data-cancelar]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var l = leerReservas(), idx = +btn.getAttribute('data-cancelar');
                if (l[idx] && confirm('¿Cancelar la reserva ' + l[idx].codigo + '?')) {
                    l[idx].estado = 'Cancelada';
                    guardarReservas(l);
                    mostrarMisReservas();
                }
            });
        });
    }

    mostrarResultados();
    mostrarMisReservas();
});
