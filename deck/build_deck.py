#!/usr/bin/env python3
"""Generates deck.html (capabilities deck, 1920x1080 pages, exported to PDF with clickable links)."""
BASE = "https://davidbenjaminfriedman.com/dbf-designs-concepts/"

CSS = r"""
@page{size:1920px 1080px;margin:0}
:root{--silver:#F1F2F4;--ink:#0C0D10;--dark:#0B0C0F;--co:#2447FF;--coral:#FF7A59;--butter:#FFD84D;--mint:#7EE0B8;--sky:#9CCBFF;--pink:#FFB4D2;--mute:#555A63}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#777}
body{font-family:'Geist',Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact;counter-reset:pgn}
a{color:inherit;text-decoration:none}
.s{position:relative;width:1920px;height:1080px;overflow:hidden;padding:96px 112px;display:flex;flex-direction:column;gap:34px;break-after:page;page-break-after:always;counter-increment:pgn}
.light{background:var(--silver);color:var(--ink)}.dark{background:var(--dark);color:#ECEEF2}.cobalt{background:var(--co);color:#fff}.butter{background:var(--butter);color:var(--ink)}
.eb{display:inline-block;width:fit-content;align-self:flex-start;padding:9px 22px;border-radius:999px;background:var(--mint);color:var(--ink);font:500 22px 'Geist Mono',monospace;letter-spacing:3px;text-transform:uppercase;transform:rotate(-2deg)}
.eb.co{background:var(--coral)}.eb.bu{background:var(--butter)}.eb.sk{background:var(--sky)}.eb.pk{background:var(--pink)}.eb.ink{background:var(--ink);color:var(--butter)}
h2{font-size:92px;font-weight:560;line-height:1;letter-spacing:-4px}
.lead{font-size:34px;line-height:1.4;color:var(--mute);max-width:1100px}
.dark .lead{color:#9AA1AD}.cobalt .lead{color:#E6EAFF}.butter .lead{color:#2B2F38}
.acc{color:var(--co)}.dark .acc{color:#8EA6FF}
.pg{position:absolute;right:112px;bottom:44px;font:500 20px 'Geist Mono',monospace;color:#7A808B}
.pg::after{content:counter(pgn,decimal-leading-zero)}
.mk{position:absolute;left:112px;bottom:44px;font:500 20px 'Geist Mono',monospace;letter-spacing:2px;text-transform:uppercase;color:#7A808B}
.dark .pg,.dark .mk{color:#6F7682}.cobalt .pg,.cobalt .mk{color:#C9D3FF}.butter .pg,.butter .mk{color:#4A4630}
.sh{padding:8px;border-radius:36px;background:rgba(12,13,16,.05);box-shadow:inset 0 0 0 1px rgba(12,13,16,.1);display:flex}
.dark .sh{background:rgba(236,238,242,.06);box-shadow:inset 0 0 0 1px rgba(236,238,242,.12)}
.cr{flex:1;border-radius:28px;padding:40px;display:flex;flex-direction:column;gap:14px;background:#FAFAFB;color:var(--ink);box-shadow:inset 0 1px 0 #fff}
.dark .cr{background:#14161B;color:#ECEEF2;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.cr.coral,.dark .cr.coral{background:var(--coral);color:var(--ink)}.cr.butter,.dark .cr.butter{background:var(--butter);color:var(--ink)}.cr.mint,.dark .cr.mint{background:var(--mint);color:var(--ink)}.cr.sky,.dark .cr.sky{background:var(--sky);color:var(--ink)}.cr.pink,.dark .cr.pink{background:var(--pink);color:var(--ink)}.cr.ink{background:var(--ink);color:#F1F2F4}.cr.co{background:var(--co);color:#fff}
.ct{font-size:44px;font-weight:560;line-height:1.05;letter-spacing:-1.6px}
.cp{font-size:27px;line-height:1.42;color:var(--mute)}
.dark .cp{color:#9AA1AD}.cr.coral .cp,.cr.butter .cp,.cr.mint .cp,.cr.sky .cp,.cr.pink .cp,.dark .cr.coral .cp,.dark .cr.butter .cp,.dark .cr.mint .cp,.dark .cr.sky .cp,.dark .cr.pink .cp{color:#2B2F38}.cr.ink .cp{color:#A5ABB6}.cr.co .cp{color:#E6EAFF}
.num{font:500 22px 'Geist Mono',monospace;letter-spacing:3px;opacity:.7}
.row{display:flex;gap:24px}.col{display:flex;flex-direction:column}.fx{flex:1}
.pill{display:inline-flex;align-items:center;gap:20px;padding:10px 10px 10px 36px;border-radius:999px;background:var(--ink);color:var(--silver);font-size:30px;font-weight:560;letter-spacing:-1px;align-self:flex-start}
.pill i{width:64px;height:64px;border-radius:32px;background:var(--butter);display:grid;place-items:center;font-style:normal;color:var(--ink);font-size:30px}
.pill.lt{background:var(--silver);color:var(--ink)}
/* devices */
.br{display:block;border-radius:22px;background:#fff;overflow:hidden;box-shadow:0 40px 80px -30px rgba(12,13,16,.45),0 0 0 1px rgba(12,13,16,.12)}
.br .bar{height:34px;background:#E4E6EA;display:flex;align-items:center;gap:8px;padding:0 16px}
.br .bar b{width:11px;height:11px;border-radius:50%;background:#C4C8CF}
.br .bar span{font:500 14px 'Geist Mono',monospace;color:#5B606A;margin-left:10px;letter-spacing:.5px}
.br img{display:block;width:100%}
.ph{display:block;border-radius:46px;background:#0C0D10;padding:9px;box-shadow:0 40px 70px -24px rgba(12,13,16,.6)}
.ph img{display:block;width:100%;border-radius:38px}
.dark .br{box-shadow:0 40px 80px -30px #000,0 0 0 1px rgba(255,255,255,.12)}
.rule{height:2px;background:currentColor;opacity:.18}
.li{padding:22px 0;border-top:2px solid rgba(12,13,16,.14);font-size:34px;font-weight:560;letter-spacing:-1px;line-height:1.15}
.li small{display:block;font-size:24px;font-weight:400;letter-spacing:0;opacity:.7;margin-top:6px}
.on-dark .li{border-color:rgba(255,255,255,.2)}
"""

DOMAINS={"council":"mayalinden.com","ballot-measure":"yeson12.org","mayor":"zuriformayor.com","senate":"jonahellery.com","county-party":"cedarcountydems.org","state-party":"prairiestatedems.org","governor":"ashcombeforgovernor.com"}

def site_slide(slug, name, kind, who, feats, bg, fg, chipbg, chipfg, flip, pillbg, pillfg, tone="light", rot=1.5):
    url = BASE + "sites/%s/" % slug
    li = "".join('<div class="li" style="border-color:%s">%s<small>%s</small></div>' % ("rgba(255,255,255,.22)" if tone == "dark" else "rgba(12,13,16,.16)", t, d) for t, d in feats)
    text = f'''<div class="col" style="width:620px;gap:28px;justify-content:center;position:relative;z-index:3">
  <p class="eb" style="background:{chipbg};color:{chipfg}">{kind}</p>
  <h2 style="font-size:86px;color:{fg}">{name}</h2>
  <p class="lead" style="color:{fg};opacity:.8;font-size:32px">{who}</p>
  <div style="margin-top:6px">{li}</div>
  <a class="pill" href="{url}" style="background:{pillbg};color:{pillfg}">Open the live site<i>&#8599;</i></a>
 </div>'''
    art = f'''<div style="position:relative;flex:1;height:880px">
  <a href="{url}" class="br" style="position:absolute;left:{'40px' if not flip else '10px'};top:90px;width:930px;transform:rotate({-rot if flip else rot}deg)"><div class="bar"><b></b><b></b><b></b><span>{DOMAINS[slug]}</span></div><img src="img/{slug}-d.png"></a>
  <a href="{url}" class="ph" style="position:absolute;{'right:-10px' if not flip else 'left:-70px'};top:{'430px' if not flip else '470px'};width:250px;transform:rotate({rot*3 if not flip else -rot*3}deg)"><img src="img/{slug}-m.png"></a>
 </div>'''
    inner = (art + text) if flip else (text + art)
    return f'''<section class="s" style="background:{bg};color:{fg};flex-direction:row;align-items:center;gap:60px">{inner}<p class="pg" style="color:{fg};opacity:.5"></p></section>'''

parts = []
A = parts.append

# 1 COVER
A(f'''<section class="s light" style="flex-direction:row;align-items:center;gap:20px">
 <div class="col" style="gap:38px;width:860px;position:relative;z-index:4">
  <p class="eb">Web design for campaigns</p>
  <h1 style="font-size:206px;font-weight:560;line-height:.9;letter-spacing:-11px">DBF<br>Designs</h1>
  <p class="lead" style="max-width:740px">Custom websites for Democratic and progressive candidates, parties and causes. Live in one week. Never a template.</p>
  <a class="pill" href="{BASE}">See the live work<i>&#8599;</i></a>
 </div>
 <div style="position:relative;flex:1;height:900px">
  <div style="position:absolute;left:120px;top:60px;width:760px;height:720px;border-radius:44px;background:var(--coral);transform:rotate(-5deg)"></div>
  <a class="br" href="{BASE}sites/mayor/" style="position:absolute;left:30px;top:90px;width:870px;transform:rotate(2deg)"><div class="bar"><b></b><b></b><b></b></div><img src="img/mayor-d.png"></a>
  <a class="br" href="{BASE}sites/senate/" style="position:absolute;left:150px;top:520px;width:640px;transform:rotate(-3deg)"><div class="bar"><b></b><b></b><b></b></div><img src="img/senate-d.png"></a>
  <a class="ph" href="{BASE}sites/ballot-measure/" style="position:absolute;left:-60px;top:330px;width:230px;transform:rotate(-5deg)"><img src="img/ballot-measure-m.png"></a>
  <svg style="position:absolute;left:760px;top:10px" width="150" height="150" viewBox="0 0 140 140"><path d="M70 0 L85.4 54.6 L140 70 L85.4 85.4 L70 140 L54.6 85.4 L0 70 L54.6 54.6Z" fill="#FFD84D"/></svg>
 </div>
</section>''')

# 2 STATEMENT
A('''<section class="s butter" style="justify-content:center;gap:40px">
 <p class="eb ink">The idea</p>
 <h2 style="font-size:176px;letter-spacing:-9px;line-height:.93">Built for your race.<br>Live in a week.</h2>
 <p class="lead" style="font-size:38px;max-width:1150px">A campaign site should look like your campaign and work like a field organizer. Ours do both.</p>
 <p class="mk">DBF Designs</p><p class="pg"></p>
</section>''')

# 3 CONTRAST
A('''<section class="s dark" style="flex-direction:row;gap:0;padding:0">
 <div class="col" style="flex:1;padding:120px 90px 120px 112px;gap:34px;background:#14161B;justify-content:center">
  <p class="eb" style="background:#2B2F38;color:#C7CBD3">What most campaigns get</p>
  <div style="font-size:60px;font-weight:560;letter-spacing:-2px;line-height:1.12;color:#6F7682">
   <p>A template with a new logo.</p><p style="margin-top:26px">Pages that load slowly on a phone.</p><p style="margin-top:26px">English only.</p><p style="margin-top:26px">A donate button you have to hunt for.</p>
  </div>
 </div>
 <div class="col" style="flex:1.1;padding:120px 112px 120px 90px;gap:34px;justify-content:center;background:var(--co);color:#fff">
  <p class="eb bu">What you get</p>
  <div style="font-size:60px;font-weight:560;letter-spacing:-2px;line-height:1.12">
   <p>A layout built around your message.</p><p style="margin-top:26px">Lean code that loads fast.</p><p style="margin-top:26px">Spanish and more, from day one.</p><p style="margin-top:26px">Donate and volunteer one tap away.</p>
  </div>
 </div>
 <p class="mk" style="color:#6F7682">DBF Designs</p><p class="pg" style="color:#C9D3FF"></p>
</section>''')

# 4 PROMISE
def prom(n, t, d, bg, fg):
    return f'<div class="col" style="flex:1;padding:70px 44px;background:{bg};color:{fg};gap:20px;justify-content:space-between"><span class="num">{n}</span><div><p style="font-size:84px;font-weight:560;letter-spacing:-4px;line-height:.98">{t}</p><p style="font-size:28px;line-height:1.4;margin-top:22px;opacity:.82">{d}</p></div></div>'
A(f'''<section class="s dark" style="padding:0;gap:0">
 <div style="padding:96px 112px 54px"><p class="eb co">The promise</p><h2 style="margin-top:28px">Four things we do every time.</h2></div>
 <div class="row fx" style="gap:0">
  {prom('01','One week','From kickoff to launch, with your copy and content or ours.','#FF7A59','#0C0D10')}
  {prom('02','No templates','Every layout, color and line of code is made for your race.','#FFD84D','#0C0D10')}
  {prom('03','Secure','Hardened hosting, HTTPS and form protection, with no plugin pile-ups to patch.','#7EE0B8','#0C0D10')}
  {prom('04','Quality','Fast, accessible and phone-first, with the donate button where people tap.','#9CCBFF','#0C0D10')}
 </div>
 <p class="pg" style="color:#0C0D10;opacity:.6"></p>
</section>''')

# 5 INCLUDED (bento, varied)
def cell(area, cls, t, d, big=False):
    ts = 'font-size:68px;letter-spacing:-3px' if big else ''
    return f'<div class="sh" style="grid-area:{area}"><div class="cr {cls}" style="padding:32px"><p class="ct" style="{ts}">{t}</p><p class="cp" style="font-size:{30 if big else 24}px">{d}</p></div></div>'
A(f'''<section class="s light" style="gap:28px;padding-bottom:108px">
 <p class="eb">Included on every site</p>
 <h2 style="font-size:78px">The essentials come standard.</h2>
 <div style="display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:1fr 1fr 0.8fr;grid-template-areas:'a a b b c c' 'a a d d e f' 'g g g h h h';gap:22px;flex:1">
  {cell('a','coral','Donate','Preset amounts, a monthly option and one-tap checkout on mobile.',True)}
  {cell('b','','Volunteer and events','Shift sign-ups and RSVP lists that feed your tools.')}
  {cell('c','butter','Email signup','Email and ZIP capture synced to your list.')}
  {cell('d','mint','Spanish and more','A clean language switch across every page.')}
  {cell('e','sky','Phone-first','Designed on a phone first.')}
  {cell('f','pink','Accessible','Keyboard and screen reader ready.')}
  {cell('g','ink','Secure and fast','HTTPS, form protection, lean code that loads quickly.')}
  {cell('h','','Compliant footer','Correct paid-for language on every page and form.')}
 </div>
 <p class="pg"></p>
</section>''')

# 6 INTEGRATIONS (typographic list)
def tool(n, d):
    return f'<div style="display:flex;align-items:baseline;justify-content:space-between;gap:60px;padding:26px 0;border-top:2px solid rgba(255,255,255,.28)"><p style="font-size:84px;font-weight:560;letter-spacing:-4px;line-height:1">{n}</p><p style="font-size:28px;line-height:1.35;max-width:560px;color:#DCE3FF">{d}</p></div>'
A(f'''<section class="s cobalt" style="justify-content:center;gap:30px">
 <p class="eb bu">Your stack, connected</p>
 <h2 style="font-size:84px;margin-bottom:10px">Works with the tools you already run.</h2>
 <div>{tool('ActBlue','Embedded forms, contribution links and preset amounts.')}{tool('NGP VAN and EveryAction','Forms that write straight to your CRM.')}{tool('Mobilize','Event feeds and shift sign-ups inside your site.')}{tool('Action Network','Petitions, pledges and list growth for causes.')}</div>
 <p class="lead" style="font-size:28px">Plus analytics, SMS opt-in and email tools to match your team.</p>
 <p class="mk">DBF Designs</p><p class="pg"></p>
</section>''')

# 7 PORTFOLIO MOSAIC
tiles = [("council","City council","1/1/2/3"),("ballot-measure","Ballot measure","1/3/2/4"),("mayor","Mayoral movement","1/4/3/6"),("senate","U.S. Senate","2/1/3/3"),("county-party","County party","2/3/3/4"),("state-party","State party","3/1/4/3"),("governor","Governor","3/3/4/6")]
def tile(s, t):
    return f'<a href="{BASE}sites/{s}/" class="br" style="display:flex;flex-direction:column;position:relative;border-radius:18px"><img src="img/{s}-d.png" style="flex:1;object-fit:cover;object-position:left top"><span style="position:absolute;left:0;right:0;bottom:0;padding:44px 18px 14px;background:linear-gradient(0deg,rgba(11,12,15,.85),rgba(11,12,15,0));color:#fff;font-size:26px;font-weight:560;letter-spacing:-.5px">{t}</span></a>'
A(f'''<section class="s dark" style="padding:70px 80px 80px;gap:26px">
 <div class="row" style="align-items:flex-end;justify-content:space-between"><div><p class="eb" style="margin-bottom:22px">The work</p><h2 style="font-size:96px">Seven races. Click any.</h2></div><p class="lead" style="font-size:28px;max-width:560px">Every design is fictional and fully built. Each one opens the live site.</p></div>
 <div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:22px;flex:1">
  {tile('council','City council')}{tile('ballot-measure','Ballot measure')}{tile('mayor','Mayoral movement')}{tile('senate','U.S. Senate')}{tile('county-party','County party')}{tile('state-party','State party')}{tile('governor','Governor')}
  <a href="{BASE}" class="sh" style="display:flex"><div class="cr co" style="justify-content:center"><p class="ct" style="font-size:44px">Browse the full gallery</p><p class="cp" style="font-size:24px">Open the full gallery &#8599;</p></div></a>
 </div>
 <p class="pg"></p>
</section>''')

# 8-14 SITE SLIDES
sites = [
 ("council","Maya Linden for City Council","City council","A warm, neighbor-first campaign for one ward.",[("Interactive ward map","Hover a block to see its priority and next porch chat"),("Porch chat RSVPs","Calendar downloads and yard sign requests"),("Light and dark","Spanish, too")],"#1E4D3A","#F6EFE0","#FFD84D","#0C0D10",False,"#FFD84D","#0C0D10","dark"),
 ("ballot-measure","Yes on 12","Ballot measure","A loud, simple case for a city safe-streets measure.",[("Live pledge counter","Every pledge rolls the numbers"),("Street explainer","Toggle crosswalks, signals and curb extensions"),("Share kit","Copy-ready texts and posts, plus yard signs")],"#FFD21F","#0C0D10","#0C0D10","#FFD21F",True,"#0C0D10","#FFD21F","light"),
 ("mayor","Zuri Taverner for Mayor","Mayoral movement","A playful, multilingual campaign built for small donors.",[("Tilting card stack","Responds to your pointer"),("Neighborhood picker","Local priorities, nearby event, a captain to text"),("Policy cards","Stack as you scroll")],"#1B3BFF","#FFFFFF","#FFD23F","#0C0D10",False,"#FFD23F","#0C0D10","dark"),
 ("senate","Jonah Ellery for U.S. Senate","Statewide","Photo-led, serious and clear about who it is for.",[("Sticky issue stack","Three full-screen stories that pin and layer"),("Scroll-driven timeline","A career drawn as you read"),("Statewide tour map","Filter stops by county")],"#0A2556","#EAF0FF","#9CC2FF","#0A2556",True,"#D7263D","#FFFFFF","dark"),
 ("county-party","Cedar County Democrats","County party","A useful, welcoming home for a local committee.",[("Precinct finder","ZIP and street number, with an animated map"),("Month calendar","Event dialogs, RSVPs, calendar downloads"),("Candidate profiles","Filter the slate by office")],"#EEF3FF","#10285C","#F6B51E","#0E1B3A",False,"#2F6BFF","#FFFFFF","light"),
 ("state-party","Prairie State Democratic Party","State party","Voter tools first, with a county map that routes people to local teams.",[("24-county tile map","Hover or tab to meet your county chair"),("Voter tools","Register, check status, find your polling place"),("Ticket and press","Candidate profiles and a filterable newsroom")],"#0F1B33","#EEF2FA","#E8B84A","#0F1B33",True,"#E8B84A","#0F1B33","dark"),
 ("governor","Wren Ashcombe for Governor","Governor","Grassroots print energy with a message that fits on a yard sign.",[("Yard sign maker","Type a name, pick a color, download a print-ready PNG"),("Cut-paper transitions","Pages reveal like layered paper"),("Rallies and shifts","Regional filters, RSVPs and live spot counts")],"#F2EFE6","#0C0D10","#D93A24","#FFFFFF",False,"#D93A24","#FFFFFF","light"),
]
for s in sites:
    A(site_slide(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], s[10], s[11], s[12]))

# 15 IN ACTION
def ia(f, t, path):
    return f'<a class="br" href="{BASE}sites/{path}" style="display:block"><div class="bar"><b></b><b></b><b></b><span>{t}</span></div><img src="img/in-{f}.jpg"></a>'
A(f'''<section class="s light" style="padding-top:72px;padding-bottom:84px;gap:26px">
 <p class="eb sk">Built to work</p>
 <h2 style="font-size:72px">Every site runs like the real thing.</h2>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:26px;flex:1">
  {ia('county-finder','Precinct finder','county-party/find-your-precinct/')}
  {ia('gov-yardsign','Yard sign maker','governor/yard-sign/')}
  {ia('state-counties','24-county tile map','state-party/counties/')}
  {ia('ballot-explainer','Street explainer','ballot-measure/what-it-does/')}
  {ia('mayor-hoods','Neighborhood picker','mayor/neighborhoods/')}
  <div class="sh"><div class="cr coral" style="justify-content:center;padding:40px"><p class="ct" style="font-size:46px">Forms validate. RSVPs confirm. Calendars download.</p><p class="cp" style="font-size:28px">Spanish switches the whole site, and every page has a light and dark mode.</p></div></div>
 </div>
 <p class="pg"></p>
</section>''')

# 16 PROCESS (timeline)
def node(day, t, d, c):
    return f'<div style="flex:1;position:relative;padding-top:92px"><div style="position:absolute;left:0;top:34px;width:44px;height:44px;border-radius:22px;background:{c}"></div><p class="num" style="font-size:24px;opacity:.8">{day}</p><p style="font-size:54px;font-weight:560;letter-spacing:-2px;margin:8px 0 14px">{t}</p><p style="font-size:26px;line-height:1.4;color:#B4BAC6;max-width:290px">{d}</p></div>'
A(f'''<section class="s dark" style="justify-content:flex-start;gap:36px;padding-top:80px">
 <p class="eb co">How a week works</p>
 <h2 style="font-size:96px;letter-spacing:-5px">Kickoff to launch<br>in seven days.</h2>
 <div style="position:relative;display:flex;gap:30px;margin-top:20px"><div style="position:absolute;left:0;right:0;top:55px;height:4px;background:linear-gradient(90deg,#FF7A59,#FFD84D,#7EE0B8,#9CCBFF)"></div>
  {node('DAY 0','Kickoff','A 30-minute call. Send what you have: logo, photos, copy, tool links. We fill the gaps.','#FF7A59')}
  {node('DAYS 1 TO 2','Design','A custom homepage and phone layout for your approval.','#FF9A5B')}
  {node('DAYS 3 TO 5','Build','Pages, forms and connections to ActBlue, Mobilize or your CRM.','#FFD84D')}
  {node('DAY 6','Review','Two rounds of edits, plus speed, security and accessibility checks.','#7EE0B8')}
  {node('DAY 7','Launch','Live on your domain, with handoff notes and a care option.','#9CCBFF')}
 </div>
 <div style="position:absolute;left:112px;right:112px;bottom:70px;display:flex;align-items:center;gap:24px;padding:26px 36px;border-radius:999px;background:rgba(255,216,77,.12);box-shadow:inset 0 0 0 2px rgba(255,216,77,.5)"><span style="font:500 22px 'Geist Mono',monospace;letter-spacing:3px;text-transform:uppercase;color:#FFD84D">With or without content</span><span style="font-size:28px;color:#ECEEF2">Have copy and photos? Send them. Don't? We write the copy and source the images. Either way, one week.</span></div><p class="pg"></p>
</section>''')

# 17 PRICING (staircase)
def tier(h, lab, price, d, cls):
    return f'<div class="sh" style="flex:1;height:{h}px;align-self:flex-end"><div class="cr {cls}" style="justify-content:space-between"><div><span class="num">{lab}</span><p style="font-size:92px;font-weight:560;letter-spacing:-5px;line-height:1.05;margin-top:12px">{price}</p></div><p class="cp" style="font-size:25px">{d}</p></div></div>'
A(f'''<section class="s light" style="gap:30px">
 <div class="row" style="justify-content:space-between;align-items:flex-end"><div><p class="eb bu" style="margin-bottom:22px">Pricing</p><h2 style="font-size:84px">Flat fees. Never more<br>than $3,000.</h2></div><p class="lead" style="font-size:28px;max-width:520px">Hosting and domain are paid by the campaign. Brand and care are optional.</p></div>
 <div class="row fx" style="gap:22px;align-items:flex-end">
  {tier(430,'LAUNCH','$1,200','Down-ballot and local races. Up to 3 pages with donate, volunteer and email signup.','')}
  {tier(540,'CAMPAIGN','$1,950','A full candidate site: issues, events, bio, press, Spanish toggle and integrations.','co')}
  {tier(650,'FLAGSHIP','to $3,000','Statewide and federal: custom sections, photo-led design and extra tools.','butter')}
  <div class="col" style="width:470px;gap:10px;align-self:stretch;justify-content:flex-end">
   <div class="sh"><div class="cr ink" style="padding:26px 36px"><span class="num">PARTIES AND ORGS</span><p class="ct" style="font-size:54px;letter-spacing:-3px">Quote</p><p class="cp" style="font-size:22px">Larger builds scoped to your needs.</p></div></div>
   <div class="li" style="font-size:28px;padding:16px 0">Brand<small style="font-size:22px">$500 with a logo, $1,000 with neither</small></div>
   <div class="li" style="font-size:28px;padding:16px 0">CMS setup<small style="font-size:22px">$250</small></div>
   <div class="li" style="font-size:28px;padding:16px 0">Analytics setup<small style="font-size:22px">$100 one time</small></div>
   <div class="li" style="font-size:28px;padding:16px 0">Ongoing care<small style="font-size:22px">$75 per hour, one-hour minimum</small></div>
  </div>
 </div>
 <p class="pg"></p>
</section>''')

# 18 CONSULTANTS
def perk(t, d):
    return f'<div style="padding:30px 0;border-top:3px solid #0C0D10"><p style="font-size:56px;font-weight:560;letter-spacing:-2px">{t}</p><p style="font-size:28px;line-height:1.4;margin-top:8px;color:#2B2F38">{d}</p></div>'
A(f'''<section class="s butter" style="flex-direction:row;gap:100px;align-items:center">
 <div class="col" style="flex:1.1;gap:34px"><p class="eb ink">For consultants</p><h2 style="font-size:130px;letter-spacing:-7px;line-height:.95">Running several campaigns? We keep up.</h2></div>
 <div class="col" style="flex:1">{perk('Volume pricing','Preferred rates when you bring three or more sites in a cycle.')}{perk('Reserved slots','Your clients go to the front of the queue, still in one week.')}{perk('One contact','Clean files and notes your team can run with.')}</div>
 <p class="mk">DBF Designs</p><p class="pg"></p>
</section>''')

# 19 ABOUT
A(f'''<section class="s light" style="flex-direction:row;align-items:center;gap:80px">
 <div class="col fx" style="gap:34px"><p class="eb pk">About</p><h2 style="font-size:112px;letter-spacing:-6px">One designer.<br>Start to finish.</h2><p class="lead">DBF Designs is David Friedman, a web designer who designs, builds and launches every site himself, so you talk to the person doing the work.</p>
 <div class="row" style="gap:14px;flex-wrap:wrap;font-size:26px;font-weight:560"><span style="padding:14px 26px;border-radius:999px;background:var(--mint)">Design</span><span style="padding:14px 26px;border-radius:999px;background:var(--butter)">Development</span><span style="padding:14px 26px;border-radius:999px;background:var(--sky)">Security</span><span style="padding:14px 26px;border-radius:999px;background:var(--pink)">Launch and care</span></div></div>
 <div style="position:relative;width:820px;height:800px;flex:none">
  <div style="position:absolute;inset:50px 20px 20px 60px;border-radius:44px;background:var(--co);transform:rotate(4deg)"></div>
  <a class="br" href="{BASE}sites/council/" style="position:absolute;left:0;top:120px;width:640px;transform:rotate(-2deg)"><div class="bar"><b></b><b></b><b></b></div><img src="img/council-d.png"></a>
  <a class="br" href="{BASE}sites/governor/" style="position:absolute;left:190px;top:440px;width:560px;transform:rotate(3deg)"><div class="bar"><b></b><b></b><b></b></div><img src="img/governor-d.png"></a>
 </div>
 <p class="mk">DBF Designs</p><p class="pg"></p>
</section>''')

# 20 CTA
A(f'''<section class="s dark" style="justify-content:center;gap:40px">
 <p class="eb bu">Next step</p>
 <h2 style="font-size:184px;letter-spacing:-10px;line-height:.92">Let's build<br><span class="acc">your site.</span></h2>
 <p class="lead" style="max-width:1100px;font-size:38px">Reply to this email to book a 30-minute kickoff. With your content or without it, your site can be live in one week.</p>
 <div class="row"><a class="pill lt" href="{BASE}">See the live work<i>&#8599;</i></a><a class="pill lt" href="https://davidbenjaminfriedman.com">davidbenjaminfriedman.com<i>&#8599;</i></a></div>
 <p class="mk">DBF Designs · Custom campaign websites</p><p class="pg"></p>
</section>''')

html = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>DBF Designs: Capabilities</title>'
        '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;560;600&family=Geist+Mono:wght@500&display=swap" rel="stylesheet">'
        '<style>' + CSS + '</style></head><body>' + "\n".join(parts) + '</body></html>')
open("deck.html", "w").write(html)
print("slides:", len(parts))
