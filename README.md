<div align="left">
  <h1>Aurel Dental &amp; Aesthetics</h1>
  <p>
    A boutique restorative dentistry and conservative facial aesthetics concept set in Bangsar, Kuala Lumpur.
    Designed in a <strong>Swiss Clinical Atelier</strong> aesthetic and hosted on Cloudflare Workers.
  </p>
  <p>
    <a href="https://aurel-dental.harisuedev.workers.dev">Live Preview on Cloudflare Workers</a>
  </p>
</div>

<hr />

<h2>Project Concept</h2>
<p>
  Dental and aesthetic clinic websites often force patients into opaque enquiry forms without clear pricing,
  realistic recovery expectations, or visibility into clinician availability. Aurel Dental &amp; Aesthetics
  explores a calmer, unhurried clinical experience built around single-suite pacing: one attending clinician,
  one patient, and full diagnostic clarity before any procedure begins.
</p>

<h2>Problems Solved</h2>
<ul>
  <li>
    <strong>Fee &amp; Recovery Uncertainty:</strong> Every procedure publishes transparent Malaysian Ringgit (<code>RM</code>)
    fee ranges, suite durations, and expected downtime upfront across the treatments ledger and pre-consultation readiness guide.
  </li>
  <li>
    <strong>Rushed Scheduling &amp; Double-Booking:</strong> A three-step reservation flow locks occupied clinician slots
    automatically, previews patient age from date of birth, and preserves form input if a network interruption occurs.
  </li>
  <li>
    <strong>Disconnected Front-Desk Operations:</strong> Patient bookings, cancellations, and walk-in registrations
    synchronize immediately in-browser with the Doctor &amp; Staff Portal via <code>localStorage</code> and <code>BroadcastChannel</code>.
  </li>
  <li>
    <strong>Visual Stability &amp; Slow-Network UX:</strong> Progressive image loading with skeleton shimmers,
    compressed clinic photography, route-level loading skeletons, WCAG AA contrast in both Light and Obsidian Dark modes,
    and zero-flash theme persistence eliminate jarring blank states on slow connections.
  </li>
  <li>
    <strong>Edge Performance:</strong> Pre-rendered routes and static assets served from Cloudflare Workers via
    <code>vinext</code> keep initial page delivery fast without requiring backend database infrastructure.
  </li>
</ul>

<h2>Application Surfaces</h2>
<table>
  <thead>
    <tr>
      <th>Route</th>
      <th>Surface</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/</code></td>
      <td>Clinic Atelier Overview</td>
      <td>Architectural hero, expandable discipline index, porcelain craft band, care readiness guide, clinician dossiers, and FAQ.</td>
    </tr>
    <tr>
      <td><code>/treatments</code></td>
      <td>Treatments &amp; RM Fee Guide</td>
      <td>Filterable ledger of 9 procedures across Restorative, Smile Design, and Facial Aesthetics with keyboard search (<code>/</code>).</td>
    </tr>
    <tr>
      <td><code>/book</code></td>
      <td>Suite Reservation &amp; Lookup</td>
      <td>Three-step booking wizard, error recovery simulation, <code>.ics</code> calendar export, and reference code lookup (e.g. <code>AUR-4084</code>).</td>
    </tr>
    <tr>
      <td><code>/dashboard</code></td>
      <td>Doctor &amp; Staff Portal</td>
      <td>Separated operations console with clinician role switcher, KPI strip, roster search (<code>Cmd/Ctrl+K</code>), walk-in modal, and live patient dossier inspector.</td>
    </tr>
  </tbody>
</table>

<h2>Technical Architecture</h2>
<ul>
  <li><strong>Framework &amp; Edge Runtime:</strong> Next.js App Router, React 19, Vite + <code>vinext</code>, Cloudflare Workers (<code>static-assets</code>).</li>
  <li><strong>Styling &amp; Primitives:</strong> Tailwind CSS v4, CSS custom property light/dark token scales, Radix UI (Dialog, AlertDialog, Accordion).</li>
  <li><strong>Typography:</strong> Plus Jakarta Sans, Newsreader, and IBM Plex Mono.</li>
  <li><strong>State &amp; Sync:</strong> Client-side synchronized clinic store powered by <code>localStorage</code> and <code>BroadcastChannel</code>.</li>
</ul>
