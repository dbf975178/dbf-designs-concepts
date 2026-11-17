#!/usr/bin/env python3
"""deck.html -> DBF-Designs-Capabilities.pdf with tidy link annotations and DBF metadata."""
import subprocess, fitz
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
subprocess.run([C,"--headless=new","--disable-gpu","--no-pdf-header-footer","--virtual-time-budget=15000","--print-to-pdf=raw.pdf","file://"+__import__("os").path.abspath("deck.html")],check=True,capture_output=True)
d=fitz.open("raw.pdf")
for p in d:
    for l in p.get_links():
        r=l["from"]
        if r.width*r.height>40000:
            cx,cy=(r.x0+r.x1)/2,(r.y0+r.y1)/2
            l["from"]=fitz.Rect(cx-r.width*.4,cy-r.height*.4,cx+r.width*.4,cy+r.height*.4); p.update_link(l)
    for a in p.annots(types=[fitz.PDF_ANNOT_LINK]) if False else []: pass
for p in d:
    ln=p.first_link
    while ln:
        x=ln.xref
        d.xref_set_key(x,"Border","[0 0 0]"); d.xref_set_key(x,"H","/N"); d.xref_set_key(x,"C","[]")
        ln=ln.next
d.set_metadata({"title":"DBF Designs: Capabilities","author":"DBF Designs","creator":"DBF Designs","producer":"DBF Designs","subject":"","keywords":""})
d.save("DBF-Designs-Capabilities.pdf",garbage=3,deflate=True)
print(len(d),"pages",sum(len(p.get_links()) for p in d),"links")
