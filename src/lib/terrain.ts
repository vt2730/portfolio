// Contour-map background for the hero: isolines of a slowly drifting noise
// field, drawn by one full-screen fragment shader. Under the pointer a hill
// rises, pushing the lines apart and tinting them with the accent. Devices
// without hover get a hill that wanders on its own and jumps to each tap.
//
// The field drifts for as long as the hero is on screen and the tab is
// visible. Idle frames are capped at ~30fps and phones render at 1x, so the
// ambient motion stays cheap; following the pointer runs at full rate.

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uSize;
uniform float uTime;
uniform vec2 uPointer;
uniform float uLift;
uniform vec3 uInk;
uniform vec3 uAccent;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), s.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), s.x),
    s.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 5; octave++) {
    sum += amplitude * noise(p);
    p = p * 2.03 + vec2(11.7, 5.3);
    amplitude *= 0.5;
  }
  return sum;
}

// 1 on an isoline of height, fading out over width screen pixels.
float isoline(float height, float width) {
  float distanceToLine = abs(fract(height + 0.5) - 0.5);
  return 1.0 - smoothstep(0.0, fwidth(height) * width, distanceToLine);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uSize.y;
  vec2 pointer = uPointer / uSize.y;
  float reach = distance(uv, pointer);
  float hill = exp(-reach * reach * 5.0) * uLift;

  float height = fbm(uv * 1.35 + uTime * vec2(0.018, 0.011)) + hill * 0.55;
  float level = height * 18.0;
  float minor = isoline(level, 1.2);
  float major = isoline(level / 5.0, 2.0);
  float band = step(0.5, fract(level / 2.0));

  // Quiet behind the headline on the left and towards the bottom, where the
  // intro and buttons sit; livelier on the right.
  vec2 at = gl_FragCoord.xy / uSize;
  float fade = (smoothstep(0.25, 0.85, at.x) * 0.85 + 0.15) * smoothstep(0.0, 0.3, at.y);

  float alpha = (minor * 0.34 + major * 0.62 + hill * minor * 0.5 + band * hill * 0.1) * fade;
  vec3 color = mix(uInk, uAccent, clamp(hill * 1.8, 0.0, 1.0));
  fragColor = vec4(color * alpha, alpha);
}`

type Rgb = [number, number, number]

/** Resolves a CSS custom property on <html> to RGB in 0–1. */
function readColor(name: string): Rgb {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  probe.style.color = `var(${name})`
  document.body.append(probe)
  const [r = 0, g = 0, b = 0] =
    getComputedStyle(probe).color.match(/[\d.]+/g)?.map(Number) ?? []
  probe.remove()
  return [r / 255, g / 255, b / 255]
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

export interface TerrainOptions {
  /** Drift and react to the pointer; false paints one still frame. */
  motion: boolean
  /** No hover (touch screens): the hill wanders between taps. */
  wander: boolean
}

const AMBIENT_FRAME = 32 // ms between idle frames (~30fps)
const ACTIVE_AFTER_MOVE = 1500 // ms of full-rate frames after pointer input
const HOLD_AFTER_TAP = 2500 // ms the hill stays where a finger left it

/**
 * Draws the terrain into `canvas`, following the pointer over `host`.
 * Returns a cleanup function, or null where WebGL2 isn't available.
 */
export function mountTerrain(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  { motion, wander }: TerrainOptions,
): (() => void) | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
  })
  if (!gl) return null

  const program = gl.createProgram()
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vertex || !fragment) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  // One triangle that covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  )
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const uSize = uniform('uSize')
  const uTime = uniform('uTime')
  const uPointer = uniform('uPointer')
  const uLift = uniform('uLift')
  const uInk = uniform('uInk')
  const uAccent = uniform('uAccent')

  // Phones render at 1x: the lines are soft anyway and it saves the battery.
  const ratio = Math.min(window.devicePixelRatio || 1, wander ? 1 : 1.5)

  // Pointer in canvas pixels, origin bottom-left; eased towards the target.
  const pointer = { x: -1e4, y: -1e4, targetX: -1e4, targetY: -1e4 }
  let lift = 0
  let liftTarget = 0
  let time = 0
  let last = 0
  let painted = 0
  let activeUntil = 0
  let heldUntil = 0
  let frame = 0
  let visible = true

  const paint = () => {
    gl.uniform1f(uTime, time)
    gl.uniform2f(uPointer, pointer.x, pointer.y)
    gl.uniform1f(uLift, lift)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const syncColors = () => {
    gl.uniform3fv(uInk, readColor('--ink'))
    gl.uniform3fv(uAccent, readColor('--accent'))
  }

  const resize = () => {
    const { width, height } = host.getBoundingClientRect()
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(uSize, canvas.width, canvas.height)
  }

  /** A slow loop over the right of the hero, where the copy is lightest. */
  const wanderTo = () => {
    pointer.targetX = canvas.width * (0.68 + 0.2 * Math.sin(time * 0.21))
    pointer.targetY = canvas.height * (0.55 + 0.22 * Math.sin(time * 0.29 + 1.3))
    liftTarget = 0.85
  }

  const loop = (now: number) => {
    frame = 0
    if (!visible || document.hidden) return
    const delta = Math.min(now - last, 100) / 1000
    last = now
    time += delta

    if (wander && now > heldUntil) wanderTo()
    // Easing tuned at 60fps, independent of the actual frame rate.
    const ease = (amount: number) => 1 - (1 - amount) ** (delta * 60)
    pointer.x += (pointer.targetX - pointer.x) * ease(0.08)
    pointer.y += (pointer.targetY - pointer.y) * ease(0.08)
    lift += (liftTarget - lift) * ease(0.04)

    if (now < activeUntil || now - painted >= AMBIENT_FRAME) {
      paint()
      painted = now
    }
    frame = requestAnimationFrame(loop)
  }

  const start = () => {
    if (!motion || frame || !visible || document.hidden) return
    last = performance.now()
    frame = requestAnimationFrame(loop)
  }

  /** Moves the hill to a viewport point, at once if it isn't up yet. */
  const raiseAt = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect()
    pointer.targetX = (clientX - rect.left) * ratio
    pointer.targetY = (rect.bottom - clientY) * ratio
    if (pointer.x < -1000) {
      pointer.x = pointer.targetX
      pointer.y = pointer.targetY
    }
    liftTarget = 1
    activeUntil = performance.now() + ACTIVE_AFTER_MOVE
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    raiseAt(event.clientX, event.clientY)
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch' && !wander) return
    raiseAt(event.clientX, event.clientY)
    heldUntil = performance.now() + HOLD_AFTER_TAP
  }

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || wander) return
    liftTarget = 0
    activeUntil = performance.now() + ACTIVE_AFTER_MOVE
  }

  const onVisibilityChange = () => start()

  syncColors()
  resize()
  if (wander && motion) {
    wanderTo()
    pointer.x = pointer.targetX
    pointer.y = pointer.targetY
  }
  paint()

  const themeObserver = new MutationObserver(() => {
    syncColors()
    paint()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-accent'],
  })
  const resizeObserver = new ResizeObserver(() => {
    resize()
    paint()
  })
  resizeObserver.observe(host)
  const viewObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    start()
  })
  viewObserver.observe(host)

  if (motion) {
    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerdown', onPointerDown, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    start()
  }

  return () => {
    cancelAnimationFrame(frame)
    themeObserver.disconnect()
    resizeObserver.disconnect()
    viewObserver.disconnect()
    host.removeEventListener('pointermove', onPointerMove)
    host.removeEventListener('pointerdown', onPointerDown)
    host.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
