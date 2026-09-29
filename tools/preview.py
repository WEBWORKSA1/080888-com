#!/usr/bin/env python3
"""Local preview: renders Jekyll pages the way GitHub Pages does (only the simple Liquid used here)
into _site/ so you can test without Ruby.  Run: python3 tools/preview.py && python3 -m http.server -d _site"""
import pathlib, re, shutil, yaml
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"
cfg = yaml.safe_load((ROOT / "_config.yml").read_text())
layout = (ROOT / "_layouts/default.html").read_text(encoding="utf-8")
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
skip = set(cfg.get("exclude", [])) | {"_site", "_layouts", "_config.yml", ".git"}
for p in ROOT.iterdir():
    if p.name in skip or p.name.startswith((".", "_")) and p.name != ".nojekyll": continue
    if p.is_dir(): shutil.copytree(p, OUT / p.name); continue
    txt = p.read_text(encoding="utf-8") if p.suffix in (".html", ".xml", ".txt", ".webmanifest") else None
    if txt is not None and txt.startswith("---\n"):
        _, fm, content = txt.split("---\n", 2)
        page = yaml.safe_load(fm)
        html = layout.replace("{{ content }}", content)
        html = re.sub(r"\{\{ page\.robots \| default: '([^']*)' \}\}", lambda m: page.get("robots") or m.group(1), html)
        html = html.replace("{{ site.version }}", str(cfg["version"]))
        for k in ("title", "description", "canonical", "jsonld"):
            html = html.replace("{{ page.%s }}" % k, str(page.get(k, "")))
        (OUT / p.name).write_text(html, encoding="utf-8")
    else:
        shutil.copy2(p, OUT / p.name)
print("preview built in _site/")
