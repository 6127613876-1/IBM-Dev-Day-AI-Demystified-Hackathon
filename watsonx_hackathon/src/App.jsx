import { useState } from "react"
import { motion } from "framer-motion"

const PIPELINE_STEPS = ["Detection", "Reasoning", "Action", "Governance"]

export default function App() {
  const [alertText, setAlertText] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)

  const runAI = async () => {
    try {
      setLoading(true)
      setActiveStep(0) // Detection started
      setData(null)

      const res = await fetch("http://localhost:8000/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert: alertText }),
      })

      const result = await res.json()

      const rawText =
        result?.results?.[0]?.generated_text ||
        result?.results?.[0]?.output_text ||
        ""

      console.log("RAW AI OUTPUT:", rawText)

      // Extract FIRST JSON object only
      const match = rawText.match(/\{[\s\S]*?\}\s*(?=\{|$)/)
      if (!match) throw new Error("No valid JSON found")

      const parsed = JSON.parse(match[0])
      setData(parsed)

      // Advance pipeline based on data readiness
      setActiveStep(1) // Reasoning ready
      setTimeout(() => setActiveStep(2), 300) // Action
      setTimeout(() => setActiveStep(3), 600) // Governance

    } catch (err) {
      console.error("AI ERROR:", err)
      window.alert("Watsonx failed or returned invalid JSON.")
      setActiveStep(-1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020b2d] to-black p-6 text-white">
      {/* HEADER */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          🚨 Incident Autopilot AI
        </h1>
        <p className="text-gray-400 mt-2">
          Enterprise Autonomous SOC & IT Governance Platform<br/>
          Powered by IBM watsonx Orchestrate — Enterprise AI for Autonomous Operations
        </p>
      </motion.div>

      {/* PIPELINE BAR */}
      <PipelineBar activeStep={activeStep} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mt-6">

        {/* SYSTEM INPUT */}
        <GlassCard title="System Alert Input">
          <textarea
            value={alertText}
            onChange={(e) => setAlertText(e.target.value)}
            placeholder="Paste live system alert..."
            className="w-full h-32 p-3 bg-black/40 rounded border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
          <button
            onClick={runAI}
            disabled={loading || !alertText.trim()}
            className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "🤖 AI Orchestrating..." : "🚀 Run AI Orchestration"}
          </button>
        </GlassCard>

        {/* DETECTION */}
        <GlassCard title="Detection Agent">
          {loading ? (
            <LoadingBlock />
          ) : (
            data?.detection && (
              <AnimatedBlock>
                <Badge label={data.detection.severity} />
                <p><strong>System:</strong> {data.detection.system}</p>
                <p><strong>Pattern:</strong> {data.detection.pattern}</p>
                <p><strong>Escalation:</strong> {String(data.detection.escalation)}</p>
              </AnimatedBlock>
            )
          )}
        </GlassCard>

        {/* REASONING */}
        <GlassCard title="Reasoning Agent">
          {loading ? (
            <LoadingBlock />
          ) : (
            data?.reasoning && (
              <AnimatedBlock>
                <p><strong>Root Cause:</strong> {data.reasoning.rootCause}</p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Risk label="Revenue" value={data.reasoning.risks.revenue} />
                  <Risk label="Security" value={data.reasoning.risks.security} />
                  <Risk label="Ops" value={data.reasoning.risks.operations} />
                </div>
              </AnimatedBlock>
            )
          )}
        </GlassCard>

        {/* ACTION */}
        <GlassCard title="Action Agent">
          {loading ? (
            <LoadingBlock />
          ) : (
            data?.action && (
              <AnimatedBlock>
                <p><strong>Ticket:</strong> {data.action.ticket}</p>
                <p><strong>Email:</strong> {data.action.email}</p>
                <p className="text-cyan-400 font-bold mt-2">
                  Status: {data.action.status}
                </p>
              </AnimatedBlock>
            )
          )}
        </GlassCard>

        {/* TIMELINE */}
        <GlassCard title="AI Audit Timeline">
          {loading ? (
            <LoadingBlock />
          ) : (
            Array.isArray(data?.timeline) && (
              <div className="space-y-3">
                {data.timeline.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="p-3 bg-cyan-500/10 border border-cyan-400/20 rounded"
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
            )
          )}
        </GlassCard>

      </div>
    </div>
  )
}

/* ---------------- PIPELINE BAR ---------------- */

function PipelineBar({ activeStep }) {
  return (
    <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
      {PIPELINE_STEPS.map((step, i) => {
        const active = i <= activeStep
        return (
          <div key={step} className="flex-1 flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: active ? 1.1 : 0.9,
                opacity: active ? 1 : 0.4,
              }}
              className={`px-4 py-2 rounded-full text-sm font-bold text-center
                ${
                  active
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-400/50"
                    : "bg-white/10 text-gray-400"
                }`}
            >
              {step}
            </motion.div>

            {i < PIPELINE_STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded
                  ${i < activeStep ? "bg-cyan-400" : "bg-white/10"}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- UI COMPONENTS ---------------- */

function GlassCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 shadow-xl min-h-[300px] flex flex-col"
    >
      <h2 className="text-lg font-bold text-cyan-400 mb-4">
        {title}
      </h2>
      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  )
}

function AnimatedBlock({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 text-gray-300"
    >
      {children}
    </motion.div>
  )
}

function Badge({ label }) {
  return (
    <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm mb-3">
      {label}
    </span>
  )
}

function Risk({ label, value }) {
  const color =
    value === "High"
      ? "text-red-400"
      : value === "Medium"
      ? "text-yellow-400"
      : "text-green-400"

  return (
    <div className="bg-black/40 p-3 rounded border border-white/10 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`font-bold ${color}`}>{value}</p>
    </div>
  )
}

function LoadingBlock() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  )
}
