import { useId, useMemo, useState } from 'react'
import {
  layerLabels,
  layerOrder,
  toolEdges,
  toolLayers,
  type StackLayer,
} from '../../data/stackGraph'
import { formatList } from '../../lib/format'

interface StackGraphProps {
  items: string[]
  /** Accessible name for the diagram, e.g. "Stack map for Hashbyt". */
  label: string
  className?: string
}

interface Node {
  name: string
  layer: StackLayer
  col: number
  row: number
}

interface Edge {
  from: Node
  to: Node
  path: string
}

// Grid geometry in px. The diagram scrolls sideways when it's wider than
// its container rather than shrinking the labels.
const COL = 184
const ROW = 60
const NODE_W = 156
const NODE_H = 40
const HEADER = 24

function center(node: Node) {
  return {
    x: node.col * COL + COL / 2,
    y: HEADER + node.row * ROW + ROW / 2,
  }
}

/** True when a node in a column between `from` and `to` sits in the band a
 *  straight curve between them would cross. */
function blocked(from: Node, to: Node, nodes: Node[]): boolean {
  const a = center(from)
  const b = center(to)
  const top = Math.min(a.y, b.y) - NODE_H / 2
  const bottom = Math.max(a.y, b.y) + NODE_H / 2
  return nodes.some((node) => {
    if (node.col <= from.col || node.col >= to.col) return false
    const { y } = center(node)
    return y + NODE_H / 2 > top && y - NODE_H / 2 < bottom
  })
}

/** Cubic curve from the right edge of `from` to the left edge of `to`, or a
 *  short bow between stacked nodes in the same column. Edges that would run
 *  through a node in an intermediate column arc above or below it instead. */
function edgePath(from: Node, to: Node, nodes: Node[]): string {
  const a = center(from)
  const b = center(to)
  if (from.col === to.col) {
    const x = a.x + NODE_W / 2 - 12
    const y1 = a.y + NODE_H / 2
    const y2 = b.y - NODE_H / 2
    const bow = x + 28
    return `M${x},${y1} C${bow},${y1} ${bow},${y2} ${x},${y2}`
  }
  const x1 = a.x + NODE_W / 2
  const x2 = b.x - NODE_W / 2
  if (to.col - from.col > 1 && blocked(from, to, nodes)) {
    const roomAbove = Math.min(a.y, b.y) - ROW * 0.6 > HEADER
    const lift = roomAbove ? -ROW * 0.6 : ROW * 0.6
    const c1 = x1 + (x2 - x1) * 0.3
    const c2 = x2 - (x2 - x1) * 0.3
    return `M${x1},${a.y} C${c1},${a.y + lift} ${c2},${b.y + lift} ${x2},${b.y}`
  }
  const mid = (x1 + x2) / 2
  return `M${x1},${a.y} C${mid},${a.y} ${mid},${b.y} ${x2},${b.y}`
}

function layout(items: string[]) {
  const layers = layerOrder.filter((layer) =>
    items.some((item) => (toolLayers[item] ?? 'tools') === layer),
  )
  const groups = layers.map((layer) =>
    items.filter((item) => (toolLayers[item] ?? 'tools') === layer),
  )
  const rows = Math.max(...groups.map((group) => group.length))

  const nodes: Node[] = []
  groups.forEach((group, col) => {
    // Centre shorter columns vertically.
    const offset = (rows - group.length) / 2
    group.forEach((name, index) => {
      nodes.push({ name, layer: layers[col], col, row: offset + index })
    })
  })

  const byName = new Map(nodes.map((node) => [node.name, node]))
  const edges: Edge[] = []
  for (const [left, right] of toolEdges) {
    const a = byName.get(left)
    const b = byName.get(right)
    if (!a || !b) continue
    // Orient left-to-right, then top-to-bottom.
    const [from, to] =
      a.col < b.col || (a.col === b.col && a.row < b.row) ? [a, b] : [b, a]
    edges.push({ from, to, path: edgePath(from, to, nodes) })
  }

  return {
    layers,
    nodes,
    edges,
    width: layers.length * COL,
    height: HEADER + rows * ROW,
  }
}

export function StackGraph({ items, label, className = '' }: StackGraphProps) {
  const captionId = useId()
  const { layers, nodes, edges, width, height } = useMemo(
    () => layout(items),
    [items],
  )
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const focus = pinned ?? hovered

  const connected = useMemo(() => {
    const set = new Set<string>()
    if (!focus) return set
    for (const edge of edges) {
      if (edge.from.name === focus) set.add(edge.to.name)
      if (edge.to.name === focus) set.add(edge.from.name)
    }
    return set
  }, [edges, focus])

  const focusNode = nodes.find((node) => node.name === focus)
  const caption = focusNode
    ? `${focusNode.name} · ${layerLabels[focusNode.layer]}${
        connected.size > 0
          ? ` · connects to ${formatList([...connected])}`
          : ''
      }`
    : 'Hover or select a node to trace its connections.'

  return (
    <figure
      aria-label={label}
      aria-describedby={captionId}
      className={`rounded-lg border border-line bg-canvas ${className}`}
    >
      <div className="overflow-x-auto">
        <div
          className="relative m-4"
          style={{ width, height }}
          onPointerLeave={() => setHovered(null)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setPinned(null)
          }}
        >
          {layers.map((layer, col) => (
            <span
              key={layer}
              aria-hidden="true"
              className="label absolute top-0 text-faint"
              style={{ left: col * COL + (COL - NODE_W) / 2 }}
            >
              {layerLabels[layer]}
            </span>
          ))}

          <svg
            aria-hidden="true"
            width={width}
            height={height}
            className="pointer-events-none absolute inset-0 overflow-visible"
          >
            {edges.map((edge) => {
              const on =
                focus !== null &&
                (edge.from.name === focus || edge.to.name === focus)
              return (
                <path
                  key={`${edge.from.name}-${edge.to.name}`}
                  d={edge.path}
                  fill="none"
                  strokeWidth={on ? 1.5 : 1}
                  className={`transition-[stroke,opacity] duration-200 motion-reduce:transition-none ${
                    on
                      ? 'stroke-accent'
                      : focus
                        ? 'stroke-line-strong opacity-30'
                        : 'stroke-line-strong'
                  }`}
                />
              )
            })}
          </svg>

          {nodes.map((node) => {
            const { x, y } = center(node)
            const isFocus = node.name === focus
            const isConnected = connected.has(node.name)
            const dimmed = focus !== null && !isFocus && !isConnected
            return (
              <button
                key={node.name}
                type="button"
                aria-pressed={pinned === node.name}
                onPointerEnter={() => setHovered(node.name)}
                onFocus={() => setHovered(node.name)}
                onBlur={() => setHovered(null)}
                onClick={() =>
                  setPinned((current) =>
                    current === node.name ? null : node.name,
                  )
                }
                style={{
                  left: x - NODE_W / 2,
                  top: y - NODE_H / 2,
                  width: NODE_W,
                  height: NODE_H,
                }}
                className={`absolute inline-flex cursor-pointer items-center justify-center rounded-md border bg-surface px-5 font-mono text-xs transition-[border-color,opacity,color] duration-200 motion-reduce:transition-none ${
                  isFocus
                    ? 'border-accent text-ink'
                    : isConnected
                      ? 'border-line-strong text-ink'
                      : 'border-line text-muted hover:border-line-strong hover:text-ink'
                } ${dimmed ? 'opacity-40' : ''}`}
              >
                {/* Status dot sits in the padding so the label never shifts. */}
                {(isFocus || isConnected) && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-2.5 size-1.5 rounded-full ${
                      isFocus ? 'bg-accent' : 'bg-line-strong'
                    }`}
                  />
                )}
                <span className="truncate">{node.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      <figcaption
        id={captionId}
        aria-live="polite"
        className="label border-t border-line px-4 py-2.5 text-faint"
      >
        {caption}
      </figcaption>
    </figure>
  )
}
