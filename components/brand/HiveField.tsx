interface Cell {
  top: string
  left: string
  size: number
  opacity: number
  lit?: boolean
}

const cells: Cell[] = [
  { top: '4%', left: '80%', size: 40, opacity: 1, lit: true },
  { top: '10%', left: '64%', size: 92, opacity: 0.16 },
  { top: '22%', left: '90%', size: 58, opacity: 0.12 },
  { top: '34%', left: '72%', size: 66, opacity: 0.14 },
  { top: '48%', left: '88%', size: 46, opacity: 0.1 },
  { top: '58%', left: '62%', size: 104, opacity: 0.09 },
  { top: '6%', left: '10%', size: 52, opacity: 0.08 },
  { top: '24%', left: '2%', size: 74, opacity: 0.07 },
  { top: '62%', left: '12%', size: 58, opacity: 0.08 },
  { top: '74%', left: '26%', size: 40, opacity: 0.06 },
]

/**
 * Scattered hex lattice used behind the homepage hero. One "lit" cell (solid
 * amber) stands in for the hive that already lives in the wordmark — everywhere
 * else on the site follows this same shape.
 */
export default function HiveField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {cells.map((cell, i) =>
        cell.lit ? (
          <div
            key={i}
            className="hex-clip absolute bg-[#F5A623]"
            style={{
              top: cell.top,
              left: cell.left,
              width: cell.size,
              height: cell.size * 1.06,
              opacity: cell.opacity,
              boxShadow: '0 0 60px 20px rgba(245, 166, 35, 0.35)',
            }}
          />
        ) : (
          <div
            key={i}
            className="hex-clip absolute bg-white"
            style={{
              top: cell.top,
              left: cell.left,
              width: cell.size,
              height: cell.size * 1.06,
              opacity: cell.opacity,
            }}
          >
            <div
              className="hex-clip absolute bg-hive-black"
              style={{ inset: 1.5 }}
            />
          </div>
        )
      )}
    </div>
  )
}
