/* Prairie State Democratic Party concept: round 2 behavior (announcement bar, pop-up, countdown, pledge, lightbox, copy).
   Loaded after site.js and before assets/shared.js. Nothing here sends data anywhere. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var R2 = {
"en": {
"nav.updates": "Updates",
"f.presskit": "Press kit",
"f.integr": "Powered by integrations",
"f.integr.list": "ActBlue-style donations, Mobilize-style events, NGP VAN and Action Network forms, Mailchimp, MailerLite and Constant Contact email, Switchboard-style text opt-in.",
"nb.text": "Registration help desks open in all 24 counties on Saturday, Dec 5.",
"nb.link": "See events",
"nb.close": "Dismiss announcement",
"pop.h": "Get the weekly organizing email.",
"pop.p": "Local events and ways to help, once a week. Unsubscribe any time.",
"pop.no": "No thanks",
"nl.h": "Email updates",
"nl.p": "One short email a week with what is happening in your county.",
"nl.btn": "Subscribe",
"nl.ok": "You are subscribed.",
"nl.ok2": "Demo only: nothing was sent. On a live site this form posts to your email platform.",
"sms.h": "Text updates",
"sms.p": "Text JOIN to (555) 555-0171, or enter your number and we will text you.",
"sms.label": "Mobile number",
"sms.btn": "Text me",
"sms.tcpa": "By texting JOIN you agree to receive recurring campaign texts. Msg and data rates may apply. Reply STOP to end, HELP for help.",
"sms.ok": "Check your phone.",
"sms.ok2": "Demo only: no text was sent. On a live site you would get a confirmation message.",
"d.embed": "Secure contribution",
"d.embed2": "ActBlue-style embed. Demo: no real payment.",
"d.embedfoot": "Contributions to political parties are not tax deductible. Demo only: no real payment is taken.",
"ev.feed": "Live events feed in the style of Mobilize. Example data.",
"ev.sub": "Subscribe to calendar",
"ev.gcal": "Add to Google Calendar",
"home.cd.unit": "days until Election Day",
"home.cd.h": "Is your registration current?",
"home.cd.note": "Example election date for this concept: Nov 2, 2027.",
"home.cd.cta": "Check your registration",
"home.vid.h": "How a county party works.",
"home.vid.p": "A walk through one monthly meeting, from sign-in to precinct assignments.",
"home.vid.btn": "Play video",
"home.vid.len": "1:48, example length",
"vid.demo": "Demo: no video file is attached. Replace this poster with the finished film.",
"vid.tr.h": "Transcript summary",
"vid.tr.p": "Sign-in and introductions, a treasurer report, volunteer shift sign-ups, and precinct captain assignments for the next canvass.",
"home.par.h": "Allies and caucuses.",
"home.par.p": "Groups that work alongside the party. All are fictional for this concept.",
"home.soc.h": "From our channels.",
"home.soc.all": "All updates",
"home.stay.h": "Stay in the loop.",
"pa.pea": "Prairie Educators Alliance",
"pa.hnc": "Heartland Nurses Council",
"pa.rbt": "Riverbend Building Trades",
"pa.rcn": "Rural Cooperatives Network",
"pa.ypd": "Young Prairie Democrats",
"pa.wdc": "Women’s Democratic Caucus",
"pa.lpd": "Latino Prairie Democrats",
"pa.vpd": "Veterans for Prairie Democrats",
"up.title": "Updates",
"up.h1": "Updates.",
"up.lede": "News from the counties and our social channels.",
"up.news.h": "Latest news.",
"up.filter": "Filter news",
"up.f.all": "All",
"up.f.org": "Organizing",
"up.f.elec": "Election info",
"up.f.end": "Endorsements",
"up.f.stmt": "Statements",
"up.empty": "No news in this category.",
"up.note": "Example news for this concept.",
"up.n1t": "Ashgrove County seats a full committee",
"up.n1s": "Twenty-two members took their seats at Thursday’s meeting, the first full roster in years.",
"up.n2t": "Early voting sites posted for every county",
"up.n2s": "Hours and addresses for each county are now on the Vote page.",
"up.n3t": "Prairie Educators Alliance backs the ticket",
"up.n3s": "Members cited school funding and rural broadband in a 41 to 6 vote.",
"up.n4t": "Statement on the state budget outlook",
"up.n4s": "The chair called for county clinics and school budgets to come first.",
"up.n5t": "Campus chapter drive adds nine schools",
"up.n5s": "Student organizers held sign-up tables at community colleges across the River Valley.",
"up.n6t": "Riverbend Building Trades backs the ticket",
"up.n6s": "The council voted to endorse after meeting each statewide candidate.",
"up.soc.h": "Follow along.",
"up.soc.p": "Recent posts from each channel. Example posts for this concept.",
"up.soc.tabs": "Social channels",
"up.follow": "Follow",
"up.prof": "Local news, events and ways to help from the Prairie State Democratic Party.",
"up.gal.h": "Posters and places.",
"up.gal.open": "Open image",
"up.g1": "Prairie farmland at golden hour (stock photo)",
"up.g2": "Poster: Start local",
"up.g3": "Poster: Vote early",
"up.g4": "A state capitol building (stock photo)",
"up.g5": "Poster: the 24 county tiles",
"up.g6": "Poster: Every county counts",
"lb.prev": "Previous image",
"lb.next": "Next image",
"pk.title": "Press kit",
"pk.h1": "Press kit.",
"pk.lede": "Logos, colors, type, bios and facts for reporters and partners.",
"pk.logo.h": "Logos.",
"pk.logo.p": "Use the files as they are. Leave clear space equal to one tile on every side.",
"pk.l1": "Primary logo",
"pk.l2": "Reversed logo",
"pk.l3": "Tile mark",
"pk.dl.svg": "SVG",
"pk.dl.png": "PNG",
"pk.svgnote": "SVG files use live text set in Barlow Condensed.",
"pk.col.h": "Colors.",
"pk.col.p": "One accent: Harvest Gold. Blues carry the map and the interface.",
"pk.c1": "Night Navy",
"pk.c2": "Prairie Blue",
"pk.c3": "Signal Blue",
"pk.c4": "Harvest Gold",
"pk.c5": "Paper",
"pk.copy": "Copy",
"pk.copied": "Copied",
"pk.type.h": "Type.",
"pk.type.disp": "Display: Barlow Condensed ExtraBold, uppercase",
"pk.type.body": "Text: Barlow Regular and SemiBold",
"pk.type.sample": "Find your county party, meet the candidates on your ballot, and join the team that turns out the vote.",
"pk.bio.h": "Leadership.",
"pk.b1r": "State Chair",
"pk.b1": "Lucinda Voss-Adeyemi has chaired the party since 2023. A former county clerk from Millrace County, she built the county committee program now running in all 24 counties.",
"pk.b2r": "Executive Director",
"pk.b2": "Tobias Reinholt-Nkemelu leads the party staff and the statewide field program. He previously ran voter registration for a regional teachers association.",
"pk.photo": "Headshot placeholder",
"pk.fact.h": "Fact sheet.",
"pk.f1": "Name",
"pk.f1v": "Prairie State Democratic Party",
"pk.f2": "Founded",
"pk.f2v": "1914 (example)",
"pk.f3": "County committees",
"pk.f3v": "24",
"pk.f4": "Headquarters",
"pk.f4v": "Hollis, Prairie State (fictional)",
"pk.f5": "Website",
"pk.f6": "Organizing goal",
"pk.f6v": "1,200 precinct captains",
"pk.f.note": "Example figures for this concept.",
"pk.con.h": "Press contact.",
"pk.con.n": "Communications director",
"pk.con.e": "Email",
"pk.con.t": "Phone",
"pk.boil.h": "Boilerplate",
"pk.boil": "The Prairie State Democratic Party organizes in all 24 counties to register voters, recruit precinct captains and elect Democrats from the courthouse to the statehouse. This is a fictional organization created for a design concept.",
"sp.h": "Join the team.",
"sp.p": "Tell us how you want to help. Your county chair follows up within a week.",
"sp.bar": "Supporter sign-up",
"sp.bar2": "NGP VAN style form. Demo: nothing is sent.",
"sp.int": "I am interested in",
"sp.i1": "Knocking doors",
"sp.i2": "Phone banking",
"sp.i3": "Hosting an event",
"sp.i4": "Registering voters",
"sp.i5": "Poll watching",
"sp.i6": "Student chapters",
"sp.ok": "You are on the team.",
"sp.ok2": "Demo only: nothing was sent. A county chair would follow up.",
"pl.h": "Pledge to vote.",
"pl.p": "Add your name. We will send a reminder with your polling place and early voting dates.",
"pl.bar": "Pledge",
"pl.bar2": "Action Network style petition. Example count.",
"pl.count": "neighbors have pledged",
"pl.goal": "Goal: 15,000",
"pl.remind": "Send me reminders",
"pl.btn": "Add my name",
"pl.ok": "Your name is on the pledge.",
"pl.ok2": "Demo only: nothing was sent. The count above went up by one.",
"faq.h": "Questions, answered.",
"faq.q1": "How much time do I need to give?",
"faq.a1": "Start with one shift. Most canvass and phone bank shifts run two to three hours.",
"faq.q2": "Do I need experience?",
"faq.a2": "No. Every shift starts with a short training and a team lead.",
"faq.q3": "Can I help if I am not registered?",
"faq.a3": "Yes. Phone banking and event support are open to everyone. A captain can help you register.",
"faq.q4": "Will I get a flood of messages?",
"faq.a4": "No. Choose the channels you want when you sign up and change them any time.",
"faq.q5": "Is there a path for students?",
"faq.a5": "Yes. Campus chapters have their own organizers and meeting schedule.",
"faq.q6": "Where do I go on the day?",
"faq.a6": "Your confirmation lists the address and who to ask for. County offices open 30 minutes early.",
"nb.region": "Announcement",
"pk.alt1": "Prairie State Democratic Party primary logo",
"pk.alt2": "Prairie State Democratic Party reversed logo",
"pk.alt3": "Prairie State Democratic Party tile mark",
"vid.alt": "Video poster"
},
"es": {
"nav.updates": "Novedades",
"f.presskit": "Kit de prensa",
"f.integr": "Con tecnología de integraciones",
"f.integr.list": "Donaciones estilo ActBlue, eventos estilo Mobilize, formularios de NGP VAN y Action Network, correo con Mailchimp, MailerLite y Constant Contact, suscripción por texto estilo Switchboard.",
"nb.text": "Los puestos de ayuda para registrarse abren en los 24 condados el sábado 5 de diciembre.",
"nb.link": "Ver eventos",
"nb.close": "Cerrar el aviso",
"pop.h": "Recibe el correo semanal de organización.",
"pop.p": "Eventos locales y formas de ayudar, una vez por semana. Puedes darte de baja cuando quieras.",
"pop.no": "No, gracias",
"nl.h": "Novedades por correo",
"nl.p": "Un correo breve por semana con lo que pasa en tu condado.",
"nl.btn": "Suscribirme",
"nl.ok": "Ya estás suscrito.",
"nl.ok2": "Solo demostración: no se envió nada. En un sitio real este formulario se conecta con tu plataforma de correo.",
"sms.h": "Novedades por texto",
"sms.p": "Envía JOIN al (555) 555-0171, o escribe tu número y te enviaremos un mensaje.",
"sms.label": "Número de celular",
"sms.btn": "Envíame un texto",
"sms.tcpa": "Al enviar JOIN por texto aceptas recibir mensajes de texto recurrentes de la campaña. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar, HELP para ayuda.",
"sms.ok": "Revisa tu teléfono.",
"sms.ok2": "Solo demostración: no se envió ningún mensaje. En un sitio real recibirías un mensaje de confirmación.",
"d.embed": "Contribución segura",
"d.embed2": "Formulario estilo ActBlue. Demostración: no hay pago real.",
"d.embedfoot": "Las contribuciones a partidos políticos no son deducibles de impuestos. Solo demostración: no se cobra ningún pago real.",
"ev.feed": "Feed de eventos en vivo al estilo de Mobilize. Datos de ejemplo.",
"ev.sub": "Suscribirme al calendario",
"ev.gcal": "Añadir a Google Calendar",
"home.cd.unit": "días para el Día de las Elecciones",
"home.cd.h": "¿Está vigente tu registro?",
"home.cd.note": "Fecha de elecciones de ejemplo para este concepto: 2 de noviembre de 2027.",
"home.cd.cta": "Revisa tu registro",
"home.vid.h": "Cómo funciona un partido de condado.",
"home.vid.p": "Un recorrido por una reunión mensual, desde el registro hasta los distritos.",
"home.vid.btn": "Reproducir video",
"home.vid.len": "1:48, duración de ejemplo",
"vid.demo": "Demostración: no hay archivo de video. Reemplaza este póster con el video final.",
"vid.tr.h": "Resumen de la transcripción",
"vid.tr.p": "Registro y presentaciones, informe de tesorería, turnos de voluntarios y asignación de capitanes de distrito para el próximo recorrido.",
"home.par.h": "Aliados y caucus.",
"home.par.p": "Grupos que trabajan junto al partido. Todos son ficticios en este concepto.",
"home.soc.h": "Desde nuestros canales.",
"home.soc.all": "Todas las novedades",
"home.stay.h": "Mantente al día.",
"pa.pea": "Alianza de Educadores de Prairie",
"pa.hnc": "Consejo de Enfermeras de Heartland",
"pa.rbt": "Oficios de la Construcción de Riverbend",
"pa.rcn": "Red de Cooperativas Rurales",
"pa.ypd": "Jóvenes Demócratas de Prairie",
"pa.wdc": "Caucus Demócrata de Mujeres",
"pa.lpd": "Demócratas Latinos de Prairie",
"pa.vpd": "Veteranos por los Demócratas de Prairie",
"up.title": "Novedades",
"up.h1": "Novedades.",
"up.lede": "Noticias de los condados y de nuestras redes sociales.",
"up.news.h": "Últimas noticias.",
"up.filter": "Filtrar noticias",
"up.f.all": "Todo",
"up.f.org": "Organización",
"up.f.elec": "Información electoral",
"up.f.end": "Respaldos",
"up.f.stmt": "Declaraciones",
"up.empty": "No hay noticias en esta categoría.",
"up.note": "Noticias de ejemplo para este concepto.",
"up.n1t": "Ashgrove completa su comité de condado",
"up.n1s": "Veintidós miembros asumieron sus cargos en la reunión del jueves, la primera lista completa en años.",
"up.n2t": "Lugares de votación anticipada publicados en cada condado",
"up.n2s": "Los horarios y las direcciones de cada condado ya están en la página Vota.",
"up.n3t": "La Alianza de Educadores de Prairie respalda la candidatura",
"up.n3s": "Los miembros citaron el financiamiento escolar y la banda ancha rural en una votación de 41 a 6.",
"up.n4t": "Declaración sobre las perspectivas del presupuesto estatal",
"up.n4s": "La presidenta pidió que las clínicas de condado y los presupuestos escolares tengan prioridad.",
"up.n5t": "La campaña de capítulos universitarios suma nueve escuelas",
"up.n5s": "Organizadores estudiantiles pusieron mesas de inscripción en colegios comunitarios del Valle del Río.",
"up.n6t": "Oficios de la Construcción de Riverbend respalda la candidatura",
"up.n6s": "El consejo votó a favor del respaldo tras reunirse con cada candidato estatal.",
"up.soc.h": "Síguenos.",
"up.soc.p": "Publicaciones recientes de cada canal. Publicaciones de ejemplo para este concepto.",
"up.soc.tabs": "Canales de redes sociales",
"up.follow": "Seguir",
"up.prof": "Noticias locales, eventos y formas de ayudar del Partido Demócrata de Prairie State.",
"up.gal.h": "Carteles y lugares.",
"up.gal.open": "Abrir imagen",
"up.g1": "Campos de Prairie al atardecer (foto de archivo)",
"up.g2": "Cartel: Empieza en lo local",
"up.g3": "Cartel: Vota con anticipación",
"up.g4": "Un edificio del capitolio estatal (foto de archivo)",
"up.g5": "Cartel: los 24 mosaicos de condado",
"up.g6": "Cartel: Cada condado cuenta",
"lb.prev": "Imagen anterior",
"lb.next": "Imagen siguiente",
"pk.title": "Kit de prensa",
"pk.h1": "Kit de prensa.",
"pk.lede": "Logotipos, colores, tipografía, biografías y datos para periodistas y aliados.",
"pk.logo.h": "Logotipos.",
"pk.logo.p": "Usa los archivos tal como están. Deja un espacio libre igual a un mosaico en cada lado.",
"pk.l1": "Logotipo principal",
"pk.l2": "Logotipo en negativo",
"pk.l3": "Marca de mosaicos",
"pk.dl.svg": "SVG",
"pk.dl.png": "PNG",
"pk.svgnote": "Los archivos SVG usan texto en Barlow Condensed.",
"pk.col.h": "Colores.",
"pk.col.p": "Un solo acento: Dorado de Cosecha. Los azules llevan el mapa y la interfaz.",
"pk.c1": "Azul Noche",
"pk.c2": "Azul Prairie",
"pk.c3": "Azul Señal",
"pk.c4": "Dorado de Cosecha",
"pk.c5": "Papel",
"pk.copy": "Copiar",
"pk.copied": "Copiado",
"pk.type.h": "Tipografía.",
"pk.type.disp": "Titulares: Barlow Condensed ExtraBold, mayúsculas",
"pk.type.body": "Texto: Barlow Regular y SemiBold",
"pk.type.sample": "Encuentra tu partido de condado, conoce a los candidatos de tu boleta y únete al equipo que lleva a la gente a votar.",
"pk.bio.h": "Dirección.",
"pk.b1r": "Presidenta estatal",
"pk.b1": "Lucinda Voss-Adeyemi preside el partido desde 2023. Exsecretaria de condado en Millrace, creó el programa de comités de condado que hoy funciona en los 24 condados.",
"pk.b2r": "Director ejecutivo",
"pk.b2": "Tobias Reinholt-Nkemelu dirige al personal del partido y el programa de campo estatal. Antes dirigió el registro de votantes de una asociación regional de maestros.",
"pk.photo": "Espacio para fotografía",
"pk.fact.h": "Ficha de datos.",
"pk.f1": "Nombre",
"pk.f1v": "Partido Demócrata de Prairie State",
"pk.f2": "Fundado",
"pk.f2v": "1914 (ejemplo)",
"pk.f3": "Comités de condado",
"pk.f3v": "24",
"pk.f4": "Sede",
"pk.f4v": "Hollis, Prairie State (ficticia)",
"pk.f5": "Sitio web",
"pk.f6": "Meta de organización",
"pk.f6v": "1,200 capitanes de distrito",
"pk.f.note": "Cifras de ejemplo para este concepto.",
"pk.con.h": "Contacto de prensa.",
"pk.con.n": "Directora de comunicaciones",
"pk.con.e": "Correo electrónico",
"pk.con.t": "Teléfono",
"pk.boil.h": "Texto institucional",
"pk.boil": "El Partido Demócrata de Prairie State se organiza en los 24 condados para registrar votantes, reclutar capitanes de distrito y elegir demócratas desde el juzgado hasta el capitolio. Esta es una organización ficticia creada para un concepto de diseño.",
"sp.h": "Únete al equipo.",
"sp.p": "Cuéntanos cómo quieres ayudar. Tu presidente de condado te contactará en una semana.",
"sp.bar": "Registro de simpatizantes",
"sp.bar2": "Formulario estilo NGP VAN. Demostración: no se envía nada.",
"sp.int": "Me interesa",
"sp.i1": "Tocar puertas",
"sp.i2": "Llamadas telefónicas",
"sp.i3": "Organizar un evento",
"sp.i4": "Registrar votantes",
"sp.i5": "Observar las urnas",
"sp.i6": "Capítulos estudiantiles",
"sp.ok": "Ya eres parte del equipo.",
"sp.ok2": "Solo demostración: no se envió nada. Un presidente de condado te contactaría.",
"pl.h": "Compromiso de votar.",
"pl.p": "Agrega tu nombre. Te enviaremos un recordatorio con tu lugar de votación y las fechas de votación anticipada.",
"pl.bar": "Compromiso",
"pl.bar2": "Petición estilo Action Network. Conteo de ejemplo.",
"pl.count": "vecinos se han comprometido",
"pl.goal": "Meta: 15,000",
"pl.remind": "Quiero recibir recordatorios",
"pl.btn": "Agregar mi nombre",
"pl.ok": "Tu nombre está en el compromiso.",
"pl.ok2": "Solo demostración: no se envió nada. El conteo de arriba subió en uno.",
"faq.h": "Preguntas y respuestas.",
"faq.q1": "¿Cuánto tiempo necesito dar?",
"faq.a1": "Empieza con un turno. La mayoría de los turnos de recorrido y de llamadas dura de dos a tres horas.",
"faq.q2": "¿Necesito experiencia?",
"faq.a2": "No. Cada turno empieza con una capacitación breve y un líder de equipo.",
"faq.q3": "¿Puedo ayudar si no estoy registrado?",
"faq.a3": "Sí. Las llamadas y el apoyo en eventos están abiertos a todos. Un capitán puede ayudarte a registrarte.",
"faq.q4": "¿Recibiré demasiados mensajes?",
"faq.a4": "No. Elige los canales que quieres al inscribirte y cámbialos cuando quieras.",
"faq.q5": "¿Hay un camino para estudiantes?",
"faq.a5": "Sí. Los capítulos universitarios tienen sus propios organizadores y calendario de reuniones.",
"faq.q6": "¿Adónde voy ese día?",
"faq.a6": "Tu confirmación indica la dirección y a quién preguntar. Las oficinas de condado abren 30 minutos antes.",
"nb.region": "Aviso",
"pk.alt1": "Logotipo principal del Partido Demócrata de Prairie State",
"pk.alt2": "Logotipo en negativo del Partido Demócrata de Prairie State",
"pk.alt3": "Marca de mosaicos del Partido Demócrata de Prairie State",
"vid.alt": "Póster del video"
}
};
  window.I18N = window.I18N || { en: {}, es: {} };
  ["en", "es"].forEach(function (l) {
    window.I18N[l] = window.I18N[l] || {};
    Object.keys(R2[l]).forEach(function (k) { window.I18N[l][k] = R2[l][k]; });
  });
  function lang() { return root.getAttribute("lang") === "es" ? "es" : "en"; }
  function t(k) {
    var d = window.I18N;
    if (d[lang()] && d[lang()][k] != null) return d[lang()][k];
    return d.en && d.en[k] != null ? d.en[k] : k;
  }
  var t0 = Date.now();

  /* Announcement bar: dismissal is remembered */
  function initNotice() {
    var nb = $("[data-notice]"); if (!nb) return;
    var x = $("[data-notice-close]", nb); if (!x) return;
    x.addEventListener("click", function () {
      store.set("psdp:notice:v1", "1");
      root.classList.add("notice-off");
      var m = $("#main"); if (m) { m.setAttribute("tabindex", "-1"); m.focus({ preventScroll: true }); }
    });
  }

  /* Email pop-up: once, after about 12 seconds or on exit intent. Never on donate pages. */
  function initPopup() {
    var pop = $("#signup-pop"); if (!pop) return;
    if ($("[data-donate]") || /\/donate\//.test(location.pathname)) return;
    var key = "psdp:pop:v1";
    if (store.get(key)) return;
    var shown = false;
    function show() {
      if (shown || store.get(key)) return;
      if ($("dialog[open]") || root.classList.contains("nav-open")) { setTimeout(show, 6000); return; }
      var a = doc.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) { setTimeout(show, 6000); return; }
      shown = true;
      if (typeof pop.showModal === "function") pop.showModal(); else pop.setAttribute("open", "");
    }
    setTimeout(show, 12000);
    doc.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 0 && Date.now() - t0 > 5000 && window.matchMedia("(hover:hover)").matches) show();
    });
    pop.addEventListener("close", function () { store.set(key, "1"); shown = true; });
    pop.addEventListener("psform:success", function () { store.set(key, "1"); });
  }

  /* Countdown to the example election date */
  function initCountdown() {
    $$("[data-countdown]").forEach(function (c) {
      var target = new Date(c.getAttribute("data-countdown")), out = $("[data-cd-days]", c);
      if (!out || isNaN(target)) return;
      out.textContent = String(Math.max(0, Math.ceil((target - new Date()) / 864e5)));
    });
  }

  /* Pledge counter */
  function initPledge() {
    var pl = $("[data-pledge]"); if (!pl) return;
    var num = $("[data-pledge-n]", pl), bar = $("[data-pledge-bar]", pl), box = $(".pl-count", pl);
    var n = parseInt(num.getAttribute("data-base"), 10), goal = parseInt(pl.getAttribute("data-goal"), 10);
    function paint() {
      num.textContent = n.toLocaleString("en-US");
      bar.style.setProperty("--w", Math.min(100, n / goal * 100).toFixed(1) + "%");
    }
    paint();
    pl.addEventListener("psform:success", function () {
      n += 1; paint();
      if (box) { box.classList.remove("pulse"); void box.offsetWidth; box.classList.add("pulse"); }
    });
  }

  /* Lightbox */
  function initLightbox() {
    var lb = $("#lightbox"); if (!lb) return;
    var items = $$("[data-lightbox]"), slot = $("[data-lb-slot]", lb), cap = $("[data-lb-cap]", lb), idx = 0;
    function paint(i) {
      idx = (i + items.length) % items.length;
      var b = items[idx], art = $("[data-lb-art]", b).cloneNode(true);
      art.removeAttribute("data-lb-art");
      slot.innerHTML = ""; slot.appendChild(art);
      var key = b.getAttribute("data-cap");
      cap.setAttribute("data-i18n", key); cap.textContent = t(key);
      if (art.tagName === "IMG") art.alt = t(key);
    }
    items.forEach(function (b, i) {
      b.addEventListener("click", function () {
        paint(i);
        if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
      });
    });
    $("[data-lb-prev]", lb).addEventListener("click", function () { paint(idx - 1); });
    $("[data-lb-next]", lb).addEventListener("click", function () { paint(idx + 1); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") paint(idx - 1);
      if (e.key === "ArrowRight") paint(idx + 1);
    });
  }

  /* Calendar subscribe link: webcal when served over http(s), plain file link otherwise */
  function initWebcal() {
    $$("[data-webcal]").forEach(function (a) {
      if (!/^https?:$/.test(location.protocol)) return;
      try { var u = new URL(a.getAttribute("href"), location.href); a.href = "webcal://" + u.host + u.pathname; a.removeAttribute("download"); } catch (e) {}
    });
  }

  /* Copy buttons (captured first so the label stays in the visitor's language) */
  function initCopy() {
    doc.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-copy]") : null; if (!b) return;
      e.stopPropagation();
      var ck = b.getAttribute("data-copy-key"), text = ck ? t(ck) : b.getAttribute("data-copy"), key = b.getAttribute("data-i18n") || "pk.copy";
      var done = function () { b.textContent = t("pk.copied"); setTimeout(function () { b.textContent = t(key); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
    }, true);
  }

  initNotice(); initPopup(); initCountdown(); initPledge(); initLightbox(); initWebcal(); initCopy();
})();
