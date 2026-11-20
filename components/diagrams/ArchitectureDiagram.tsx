import { useId } from "react";
import type { DiagramId } from "@/lib/schemas";

interface ArchitectureDiagramProps {
  diagramId: DiagramId;
  caption: string;
  textAlternative: string;
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  tone?: "default" | "accent" | "muted";
}

function DiagramBox({ x, y, w, h, title, subtitle, tone = "default" }: BoxProps) {
  const fill = tone === "accent" ? "#eef3f8" : tone === "muted" ? "#f3f3ef" : "#ffffff";
  const stroke = tone === "accent" ? "#1d4368" : "#cfcfc6";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.25}
      />
      <text
        x={x + w / 2}
        y={subtitle ? y + h / 2 - 6 : y + h / 2 + 4}
        textAnchor="middle"
        fill="#14171c"
        fontSize={12.5}
        fontWeight={600}
        fontFamily="var(--font-plex-sans), sans-serif"
      >
        {title}
      </text>
      {subtitle ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          fill="#59626f"
          fontSize={10.5}
          fontFamily="var(--font-plex-mono), monospace"
        >
          {subtitle}
        </text>
      ) : null}
    </g>
  );
}

function BoundaryFrame({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill="none"
        stroke="#8c8c82"
        strokeWidth={1.2}
        strokeDasharray="5 4"
      />
      <text
        x={x + 12}
        y={y + 18}
        fill="#59626f"
        fontSize={10}
        fontWeight={600}
        letterSpacing="0.06em"
        fontFamily="var(--font-plex-mono), monospace"
      >
        {label}
      </text>
    </g>
  );
}

function FlowArrow({
  d,
  kind,
  label,
  labelX,
  labelY,
}: {
  d: string;
  kind: "data" | "control";
  label?: string;
  labelX?: number;
  labelY?: number;
}) {
  const isControl = kind === "control";
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={isControl ? "#8a5a18" : "#1d4368"}
        strokeWidth={1.6}
        strokeDasharray={isControl ? "5 3" : undefined}
        markerEnd={isControl ? "url(#arrow-control)" : "url(#arrow-data)"}
      />
      {label && labelX !== undefined && labelY !== undefined ? (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fill={isControl ? "#74490f" : "#1d4368"}
          fontSize={10}
          fontFamily="var(--font-plex-mono), monospace"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function renderDiagramBody(diagramId: DiagramId) {
  switch (diagramId) {
    case "real-estate-tokenization":
      return (
        <>
          <BoundaryFrame
            x={20}
            y={46}
            w={380}
            h={278}
            label="OFF-CHAIN COMPLIANCE & LEGAL BOUNDARY (PII KEPT HERE)"
          />
          <BoundaryFrame
            x={440}
            y={46}
            w={380}
            h={278}
            label="ON-CHAIN PROTOTYPE LEDGER (PSEUDONYMOUS STATE ONLY)"
          />

          <DiagramBox
            x={48}
            y={82}
            w={150}
            h={64}
            title="Investor Intake"
            subtitle="KYC / KYB docs"
          />
          <DiagramBox
            x={224}
            y={82}
            w={150}
            h={64}
            title="Attestation Issuer"
            subtitle="Eligibility & expiry"
            tone="accent"
          />
          <DiagramBox
            x={48}
            y={216}
            w={326}
            h={72}
            title="Legal SPV Register & Audit Log"
            subtitle="Authoritative legal records + reconciliation"
            tone="muted"
          />

          <DiagramBox
            x={468}
            y={82}
            w={150}
            h={64}
            title="Identity Registry"
            subtitle="Allowlist flags"
            tone="accent"
          />
          <DiagramBox
            x={644}
            y={82}
            w={150}
            h={64}
            title="Compliance Module"
            subtitle="Lockup / freeze"
          />
          <DiagramBox
            x={468}
            y={216}
            w={326}
            h={72}
            title="Restricted Token Contract"
            subtitle="Fail-closed mint, freeze & transfer gate"
            tone="accent"
          />

          <FlowArrow d="M 198 114 L 220 114" kind="data" />
          <FlowArrow
            d="M 374 114 L 464 114"
            kind="control"
            label="Signed claim"
            labelX={419}
            labelY={104}
          />
          <FlowArrow
            d="M 543 146 L 543 212"
            kind="control"
            label="Allow?"
            labelX={515}
            labelY={184}
          />
          <FlowArrow
            d="M 719 146 L 719 212"
            kind="control"
            label="Rule gate"
            labelX={754}
            labelY={184}
          />
          <FlowArrow d="M 618 114 L 640 114" kind="control" />
          <FlowArrow d="M 468 252 L 378 252" kind="data" label="Events" labelX={421} labelY={243} />
        </>
      );

    case "financial-intelligence-lakehouse":
      return (
        <>
          <BoundaryFrame
            x={20}
            y={46}
            w={800}
            h={190}
            label="LAKEHOUSE STORAGE & VALIDATION BOUNDARY"
          />
          <BoundaryFrame
            x={20}
            y={248}
            w={800}
            h={82}
            label="ORCHESTRATION, QUARANTINE & EXPERIMENT TRACKING PLANE"
          />

          <DiagramBox
            x={40}
            y={96}
            w={132}
            h={72}
            title="Source Feeds"
            subtitle="Market / ledger"
          />
          <DiagramBox
            x={208}
            y={96}
            w={146}
            h={72}
            title="Bronze Zone"
            subtitle="Immutable raw"
            tone="muted"
          />
          <DiagramBox
            x={390}
            y={96}
            w={156}
            h={72}
            title="Silver Zone"
            subtitle="Typed & deduped"
            tone="accent"
          />
          <DiagramBox
            x={582}
            y={96}
            w={214}
            h={72}
            title="Gold Risk Features"
            subtitle="Versioned snapshots"
            tone="accent"
          />

          <DiagramBox
            x={40}
            y={266}
            w={240}
            h={50}
            title="Batch Orchestrator"
            subtitle="DAG & retries"
          />
          <DiagramBox
            x={348}
            y={266}
            w={200}
            h={50}
            title="Quarantine Sink"
            subtitle="Malformed records"
            tone="muted"
          />
          <DiagramBox
            x={582}
            y={266}
            w={214}
            h={50}
            title="Experiment Tracker"
            subtitle="Snapshot lineage"
          />

          <FlowArrow d="M 172 132 L 204 132" kind="data" />
          <FlowArrow
            d="M 354 132 L 386 132"
            kind="data"
            label="Validate"
            labelX={370}
            labelY={122}
          />
          <FlowArrow d="M 546 132 L 578 132" kind="data" />
          <FlowArrow
            d="M 468 168 L 468 262"
            kind="data"
            label="Rejects"
            labelX={496}
            labelY={214}
          />
          <FlowArrow
            d="M 689 168 L 689 262"
            kind="data"
            label="Snapshots"
            labelX={726}
            labelY={214}
          />
          <FlowArrow d="M 160 266 L 281 172" kind="control" label="Run" labelX={206} labelY={212} />
          <FlowArrow
            d="M 280 291 L 344 291"
            kind="control"
            label="Halt?"
            labelX={312}
            labelY={282}
          />
        </>
      );

    case "transaction-risk-engine":
      return (
        <>
          <BoundaryFrame x={20} y={46} w={206} h={278} label="UNTRUSTED INPUT BOUNDARY" />
          <BoundaryFrame
            x={244}
            y={46}
            w={576}
            h={278}
            label="RUST PURE EVALUATION & INVARIANT BOUNDARY"
          />

          <DiagramBox
            x={40}
            y={136}
            w={166}
            h={72}
            title="Raw Tx Event"
            subtitle="Untyped payload"
          />
          <DiagramBox
            x={270}
            y={136}
            w={156}
            h={72}
            title="Newtype Parser"
            subtitle="Minor units / ISO"
            tone="accent"
          />
          <DiagramBox
            x={464}
            y={76}
            w={158}
            h={64}
            title="Window Store"
            subtitle="Account history"
            tone="muted"
          />
          <DiagramBox
            x={464}
            y={196}
            w={158}
            h={72}
            title="Pure Rule Loop"
            subtitle="All rules evaluated"
            tone="accent"
          />
          <DiagramBox
            x={658}
            y={136}
            w={142}
            h={72}
            title="Verdict + Trace"
            subtitle="Allow/Rev/Block"
          />

          <FlowArrow d="M 206 172 L 266 172" kind="data" label="Parse" labelX={236} labelY={162} />
          <FlowArrow d="M 426 154 L 460 112" kind="data" label="Lookup" labelX={428} labelY={122} />
          <FlowArrow
            d="M 426 190 L 460 228"
            kind="control"
            label="Valid tx"
            labelX={426}
            labelY={222}
          />
          <FlowArrow
            d="M 543 140 L 543 192"
            kind="data"
            label="Snapshot"
            labelX={576}
            labelY={170}
          />
          <FlowArrow
            d="M 622 232 L 654 182"
            kind="control"
            label="Precedence"
            labelX={660}
            labelY={228}
          />
        </>
      );

    case "distributed-systems-simulator":
      return (
        <>
          <BoundaryFrame
            x={20}
            y={46}
            w={800}
            h={278}
            label="SINGLE-PROCESS DETERMINISTIC SIMULATION BOUNDARY"
          />

          <DiagramBox
            x={44}
            y={96}
            w={172}
            h={68}
            title="Seed & Scenario"
            subtitle="PRNG + topology"
            tone="muted"
          />
          <DiagramBox
            x={260}
            y={96}
            w={194}
            h={68}
            title="Event Scheduler"
            subtitle="Global virtual clock"
            tone="accent"
          />
          <DiagramBox
            x={508}
            y={96}
            w={286}
            h={68}
            title="Fault-Injecting Network"
            subtitle="Delay / drop / partition matrix"
          />
          <DiagramBox
            x={260}
            y={220}
            w={238}
            h={72}
            title="Virtual Node Actors"
            subtitle="Isolated state machines"
            tone="accent"
          />
          <DiagramBox
            x={548}
            y={220}
            w={246}
            h={72}
            title="Trace & Invariant Check"
            subtitle="Causality + safety assertions"
            tone="muted"
          />

          <FlowArrow d="M 216 130 L 256 130" kind="control" />
          <FlowArrow
            d="M 454 130 L 504 130"
            kind="control"
            label="Dispatch"
            labelX={479}
            labelY={120}
          />
          <FlowArrow
            d="M 357 164 L 357 216"
            kind="control"
            label="Timer tick"
            labelX={318}
            labelY={194}
          />
          <FlowArrow
            d="M 620 164 L 498 238"
            kind="data"
            label="Delivered msg"
            labelX={584}
            labelY={204}
          />
          <FlowArrow d="M 498 264 L 544 264" kind="data" />
        </>
      );

    case "financial-document-forensics":
      return (
        <>
          <BoundaryFrame x={20} y={46} w={206} h={278} label="SANDBOXED PARSER BOUNDARY" />
          <BoundaryFrame
            x={244}
            y={46}
            w={370}
            h={278}
            label="MULTI-SIGNAL EXTRACTION (PROPOSED)"
          />
          <BoundaryFrame x={632} y={46} w={188} h={278} label="HUMAN REVIEW BOUNDARY" />

          <DiagramBox
            x={38}
            y={142}
            w={170}
            h={72}
            title="Document Upload"
            subtitle="Resource-capped PDF"
          />
          <DiagramBox
            x={270}
            y={76}
            w={156}
            h={58}
            title="Metadata & Fonts"
            subtitle="Producer checks"
          />
          <DiagramBox
            x={270}
            y={154}
            w={156}
            h={58}
            title="Layout & OCR"
            subtitle="Arithmetic check"
            tone="accent"
          />
          <DiagramBox
            x={270}
            y={232}
            w={156}
            h={58}
            title="Image Forensics"
            subtitle="Weak pixel signals"
            tone="muted"
          />
          <DiagramBox
            x={460}
            y={142}
            w={136}
            h={72}
            title="Triage Scorer"
            subtitle="Quality abstain"
            tone="accent"
          />
          <DiagramBox
            x={650}
            y={142}
            w={152}
            h={72}
            title="Human Reviewer"
            subtitle="Final disposition"
          />

          <FlowArrow d="M 208 178 L 266 105" kind="data" />
          <FlowArrow d="M 208 178 L 266 183" kind="data" />
          <FlowArrow d="M 208 178 L 266 261" kind="data" />
          <FlowArrow d="M 426 105 L 460 164" kind="data" />
          <FlowArrow d="M 426 183 L 456 183" kind="data" />
          <FlowArrow d="M 426 261 L 460 194" kind="data" />
          <FlowArrow
            d="M 596 178 L 646 178"
            kind="control"
            label="Escalate"
            labelX={621}
            labelY={168}
          />
        </>
      );
  }
}

export function ArchitectureDiagram({
  diagramId,
  caption,
  textAlternative,
}: ArchitectureDiagramProps) {
  const titleId = useId();
  const descId = useId();

  return (
    <figure className="space-y-3">
      <div className="overflow-x-auto rounded-sm border border-border bg-surface p-3 sm:p-5">
        <div className="min-w-[660px]">
          <svg
            viewBox="0 0 840 344"
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            className="h-auto w-full"
          >
            <title id={titleId}>{caption}</title>
            <desc id={descId}>{textAlternative}</desc>
            <defs>
              <marker
                id="arrow-data"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#1d4368" />
              </marker>
              <marker
                id="arrow-control"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#8a5a18" />
              </marker>
            </defs>

            {/* Legend bar */}
            <g transform="translate(20, 12)">
              <line x1="0" y1="8" x2="26" y2="8" stroke="#1d4368" strokeWidth="1.6" />
              <text
                x="34"
                y="12"
                fill="#47505c"
                fontSize="10.5"
                fontFamily="var(--font-plex-mono), monospace"
              >
                Data flow
              </text>

              <line
                x1="126"
                y1="8"
                x2="152"
                y2="8"
                stroke="#8a5a18"
                strokeWidth="1.6"
                strokeDasharray="5 3"
              />
              <text
                x="160"
                y="12"
                fill="#47505c"
                fontSize="10.5"
                fontFamily="var(--font-plex-mono), monospace"
              >
                Control / policy flow
              </text>

              <rect
                x="324"
                y="1"
                width="22"
                height="14"
                rx="2"
                fill="none"
                stroke="#8c8c82"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text
                x="354"
                y="12"
                fill="#47505c"
                fontSize="10.5"
                fontFamily="var(--font-plex-mono), monospace"
              >
                Trust / scope boundary
              </text>
            </g>

            {renderDiagramBody(diagramId)}
          </svg>
        </div>
      </div>

      <figcaption className="flex flex-col gap-2 text-xs text-ink-muted sm:flex-row sm:items-baseline sm:justify-between">
        <span>{caption}</span>
        <span className="font-mono">Scroll horizontally on narrow screens if needed</span>
      </figcaption>

      <details className="rounded-sm border border-border bg-subtle/60 px-4 py-2.5 text-sm text-ink-secondary">
        <summary className="cursor-pointer font-mono text-xs font-medium text-ink">
          Accessible text walkthrough of diagram
        </summary>
        <p className="mt-2 leading-relaxed">{textAlternative}</p>
      </details>
    </figure>
  );
}
