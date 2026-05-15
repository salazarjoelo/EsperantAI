# Tarea para ChatGPT — TASK-111 (landing.html copy + A/B variants)

## Contexto

`landing.html` es la página de ventas de EsperantAI. El usuario llega ahí desde búsqueda, ads o referral. Si el copy no convierte, no hay clientes. Tu mejora aquí impacta DIRECTO en revenue.

## TASK-111 — Mejorar copy de landing.html + 2 variants A/B

### Lo que existe hoy

Leer `landing.html` de la rama main. Tiene:
- Hero section con tagline "Honest gestures" / "Gestos honestos"
- Features grid (hand gestures, multi-platform, calibration)
- Pricing (MXN, 1 tier Pro)
- CTA → LemonSqueezy checkout

### Lo que necesita

**3 versiones del landing copy** (NO 3 archivos HTML — un solo HTML con copy alternativo marcado):

1. **Variant A — Control** (lo que está hoy, refinado): mantener el tono actual pero pulir headlines + microcopy
2. **Variant B — Función + beneficio**: enfoque en "qué hace por ti el streamer" más que en "qué hace técnicamente"
3. **Variant C — FOMO / social proof**: enfoque en escasez + casos de uso reales

### Entregable

**1 archivo:** `docs/LANDING_COPY_VARIANTS.md` con la estructura:

```markdown
# Landing Copy Variants — TASK-111

## Sections targeted

1. Hero h1 + subtitle + CTA
2. Features grid (3-6 cards)
3. Pricing block
4. FAQ inicial (3-5 preguntas)
5. Footer CTA secundaria

## Variant A — Control (refined current)

### Hero
**h1 (en):** ...
**h1 (es):** ...
**subtitle (en):** ...
**subtitle (es):** ...
**CTA primario:** ...
**CTA secundario:** ...

### Features grid
[cada feature: title + 1 frase de beneficio, en + es]

...

## Variant B — Beneficio (streamer-first)

[mismo schema, copy distinto enfocando en outcome para streamer]

## Variant C — Social proof / FOMO

[mismo schema, copy con urgencia + casos reales]

## Recomendación de A/B test

- Métrica primaria: % de visitantes que click en CTA primario
- Métrica secundaria: tiempo en página
- Tamaño de muestra mínimo: 500 visitantes por variant
- Tool sugerido: PostHog gratis o Google Optimize

## Hipótesis

- A es baseline conservador
- B asume que el comprador típico es un streamer junior que aún no entiende "gestos honestos" como concepto técnico
- C asume que el comprador es senior y reacciona a credibilidad de otros streamers usándolo
```

### Reglas de copywriting

1. **NO inventar testimonios.** Si Variant C menciona "Usado por 1,200 streamers", debe decir explícitamente "(placeholder — Joel debe llenar con número real al lanzar)".
2. **NO mencionar features no implementadas** (Combo Triggers UI sí existe, mergeado en PR #34).
3. **Precio en MXN** consistente con landing actual.
4. **Bilingüe en+es**, sin máquina translate — escribir en ambos directamente.
5. **Headlines breves** (max 8 palabras en h1).
6. **CTA verbos en imperativo**: "Empieza ahora" no "Comienza tu prueba".

### Anti-patterns

- NO clichés tipo "Revoluciona tu stream" (vago, ya saturado en SaaS marketing)
- NO promesas absolutas tipo "Aumenta tus subs un 300%" sin datos reales
- NO copy genérico que aplique a cualquier producto

### Plazo: 1 sesión

### Branch + PR (yo lo abro)

- Branch: `docs/landing-copy-variants-task111`
- Título: `docs(landing): TASK-111 — 3 copy variants para A/B test`

### Post-merge

Joel decide qué variant testear primero. Yo (Claude) o Joel implementa el copy en `landing.html` cuando esté decidido. Este brief NO requiere tocar HTML directamente — solo entregar el doc con copy.
