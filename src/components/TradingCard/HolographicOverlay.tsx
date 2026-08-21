import { useEffect, useRef } from 'react'

/**
 * Premium foil overlay: CSS sheen always visible + WebGL interference on top.
 * Self-sized via ResizeObserver (no react-shaders sizing bugs).
 */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 m = u_mouse;
  float t = u_time * 0.35;

  float wave = sin((uv.x + uv.y) * 14.0 + t * 2.0) * cos((uv.x - uv.y) * 20.0 - t);
  float bands = 0.5 + 0.5 * sin(uv.x * 42.0 + wave * 3.5 + t * 2.5);
  float spark = pow(0.5 + 0.5 * sin((uv.x - uv.y) * 80.0 + t * 4.0), 10.0);

  vec3 c1 = vec3(0.40, 0.98, 0.85);
  vec3 c2 = vec3(0.78, 0.42, 1.00);
  vec3 c3 = vec3(1.00, 0.86, 0.30);
  vec3 c4 = vec3(0.30, 0.60, 1.00);
  vec3 foil = mix(c1, c2, bands);
  foil = mix(foil, c3, smoothstep(0.2, 0.9, sin(uv.y * 12.0 + t + wave)));
  foil = mix(foil, c4, spark);

  float sheen = smoothstep(0.7, 0.0, length(uv - m));
  float a = 0.25 + bands * 0.2 + sheen * 0.45 + spark * 0.25;
  gl_FragColor = vec4(foil, clamp(a, 0.15, 0.85));
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s)
    return null
  }
  return s
}

export interface HolographicOverlayProps {
  prefersReducedMotion: boolean
}

export function HolographicOverlay({ prefersReducedMotion }: HolographicOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.55, y: 0.45 })

  useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let raf = 0
    const start = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = Math.max(1, parent.clientWidth)
      const h = Math.max(1, parent.clientHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    resize()

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.current = {
        x: (e.clientX - r.left) / Math.max(r.width, 1),
        y: 1 - (e.clientY - r.top) / Math.max(r.height, 1),
      }
    }
    window.addEventListener('pointermove', onMove)

    const draw = (now: number) => {
      resize()
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [prefersReducedMotion])

  return (
    <div className="holographic-shader-wrap" aria-hidden>
      {/* Always-visible CSS foil so something shows even if WebGL fails */}
      <div className="holographic-css-foil" />
      {!prefersReducedMotion && <canvas ref={canvasRef} className="holographic-canvas" />}
    </div>
  )
}

export function isHolographicCard(version: string): boolean {
  return version === 'holographic'
}
