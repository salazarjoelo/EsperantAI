#!/usr/bin/env python
"""
Empaqueta EsperantAI como ZIP descargable para Windows.

Genera:
  dist/EsperantAI-v{VERSION}-Windows.zip

Estructura del ZIP (lo que descarga el cliente):
  EsperantAI-v1.0.0-Windows/
  ├── EsperantAI.bat              ← doble click para arrancar
  ├── LEEME.txt                   ← instrucciones cliente final (sin acentos en filename para evitar bugs de unzip)
  ├── LICENSE.txt                 ← licencia legal
  ├── index.html                  ← la app
  ├── landing.html                ← página de info/compra
  ├── app.js
  ├── oauth-callback.html         (para OAuth de plataformas)
  ├── core/, adapters/, platforms/, libs/, models/, css/, js/, locales/, assets/
  └── docs/                       ← manual + legales + visor

EXCLUYE (no se distribuye al cliente):
  - backend/                      (server de licencias - corre en VPS de Joel)
  - tests/                        (testing interno)
  - scripts/                      (scripts de build interno)
  - .github/                      (CI/CD)
  - .vps-work/                    (artefactos de deploy a VPS)
  - .git/, .gitignore
  - node_modules/, package*.json  (development deps)
  - vitest.config.js
  - README.md, ROADMAP.md, etc.   (documentación de DEV, no de USUARIO)
  - RUN_LOCAL.bat                 (legacy launcher de dev — el cliente usa EsperantAI.bat)
  - pr-body.txt, pr-description.md
  - cualquier *.py, *.sh, *.mjs   (scripts no para el cliente)
"""
import json
import shutil
import zipfile
from pathlib import Path
import sys

REPO = Path(__file__).parent.parent
DIST = REPO / "dist"


def read_version():
    pkg = json.loads((REPO / "package.json").read_text(encoding="utf-8"))
    return pkg.get("version", "0.0.0")


# Archivos del producto que SÍ van al cliente (relative paths desde REPO)
PRODUCT_FILES = [
    "index.html",
    "landing.html",
    "oauth-callback.html",
    "app.js",
    "EsperantAI.bat",
    "LEEME.txt",
    "LICENSE.txt",
]

# Directorios del producto que SÍ van al cliente (recursivos)
PRODUCT_DIRS = [
    "core",
    "adapters",
    "platforms",
    "libs",
    "models",
    "css",
    "js",
    "locales",
    "assets",
    "docs",
]

# Patrones a excluir DENTRO de los directorios que sí van
# (ej: dentro de docs/ no queremos *.md de AI_BRIEFS, solo el manual final)
DIR_EXCLUDES = {
    "docs": [
        "AI_BRIEFS",        # comunicación interna entre AIs
        "ARCHITECTURE.md",  # docs de dev
        "PRODUCT_SPEC.md",  # spec interno
        "ROADMAP.md",
        "EXTENSION_SPEC.json",
        "RECOMMENDATIONS.md",
        "SETUP_VENTAS.md",
        "*.draft.*",
    ],
}


def should_exclude(path_rel_str, dirname):
    """Filtra archivos dentro de un directorio por nombre/pattern."""
    excludes = DIR_EXCLUDES.get(dirname, [])
    for ex in excludes:
        if ex.endswith("/") and path_rel_str.startswith(ex):
            return True
        if ex == path_rel_str or path_rel_str.endswith("/" + ex):
            return True
        if ex.startswith("*"):
            ext = ex.lstrip("*")
            if path_rel_str.endswith(ext):
                return True
    return False


def build():
    version = read_version()
    pkg_name = f"EsperantAI-v{version}-Windows"
    out_dir = DIST / pkg_name
    out_zip = DIST / f"{pkg_name}.zip"

    # ─── Limpiar anterior ───────────────────────────────────────────────────
    if out_dir.exists():
        print(f"[clean] borrando {out_dir}")
        shutil.rmtree(out_dir)
    if out_zip.exists():
        out_zip.unlink()
    DIST.mkdir(exist_ok=True)
    out_dir.mkdir(parents=True)

    # ─── Pre-condicion: los archivos clave existen ─────────────────────────
    missing = []
    for f in PRODUCT_FILES:
        if not (REPO / f).exists():
            missing.append(f)
    for d in PRODUCT_DIRS:
        if not (REPO / d).exists():
            missing.append(d + "/")
    if missing:
        print(f"[!] Archivos/dirs faltantes en el repo:")
        for m in missing:
            print(f"     - {m}")
        sys.exit(1)

    # ─── Copiar archivos sueltos ───────────────────────────────────────────
    print(f"[1] Copiando {len(PRODUCT_FILES)} archivos del producto...")
    for f in PRODUCT_FILES:
        src = REPO / f
        dst = out_dir / f
        shutil.copy2(src, dst)
        print(f"    + {f} ({src.stat().st_size:,} bytes)")

    # ─── Copiar directorios ─────────────────────────────────────────────────
    print(f"\n[2] Copiando {len(PRODUCT_DIRS)} directorios...")
    for d in PRODUCT_DIRS:
        src = REPO / d
        dst = out_dir / d

        excluded_count = 0
        copied_count = 0
        total_bytes = 0

        for item in src.rglob("*"):
            if item.is_dir():
                continue
            rel = item.relative_to(src)
            rel_str = str(rel).replace("\\", "/")

            if should_exclude(rel_str, d):
                excluded_count += 1
                continue

            target = dst / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)
            copied_count += 1
            total_bytes += item.stat().st_size

        print(f"    + {d}/  ({copied_count} archivos, {total_bytes:,} bytes, {excluded_count} excluidos)")

    # ─── Crear ZIP ─────────────────────────────────────────────────────────
    print(f"\n[3] Comprimiendo {out_dir.name}.zip ...")
    with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for f in out_dir.rglob("*"):
            if f.is_file():
                # arcname: EsperantAI-v1.0.0-Windows/path/to/file
                arcname = pkg_name + "/" + str(f.relative_to(out_dir)).replace("\\", "/")
                zf.write(f, arcname)

    zip_size = out_zip.stat().st_size
    folder_size = sum(f.stat().st_size for f in out_dir.rglob("*") if f.is_file())

    print(f"\n{'=' * 70}")
    print(f"PAQUETE WINDOWS GENERADO")
    print(f"{'=' * 70}")
    print(f"  Carpeta:       {out_dir}")
    print(f"  Tamaño:        {folder_size / 1024 / 1024:.2f} MB sin comprimir")
    print(f"  ZIP:           {out_zip}")
    print(f"  Tamaño ZIP:    {zip_size / 1024 / 1024:.2f} MB")
    print(f"  Ratio:         {zip_size / folder_size * 100:.1f}% del original")
    print(f"")
    print(f"  Para probar el flujo del cliente:")
    print(f"     1. Extrae el ZIP en una carpeta nueva (simula descarga)")
    print(f"     2. Doble click en EsperantAI.bat")
    print(f"     3. Verifica que se abre el browser y la landing carga")
    print(f"")
    print(f"  Subir a:  pendiente (Joel decide host: VPS, GitHub Releases, etc.)")


if __name__ == "__main__":
    build()
