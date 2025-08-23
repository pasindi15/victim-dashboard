// src/Component/VictimDashboard/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";  

export default function Dashboard() {
  return (

    <main className="vdash container">
      {/* Hero */}
      <section className="hero">
        <div className="hero__text">
          <h1>Victim Dashboard</h1>
          <p>Report incidents, request urgent aid, and submit damage claims.</p>
        </div>
        <Link to="/report" className="btn-cta">New Report</Link>
      </section>

      {/* Grid */}
      <section className="grid">
        {/* Quick actions */}
        <div className="cards">
          <article className="card c-report">
            <div className="card__head">
              <h3>Report Disaster</h3>
              <span className="pill pill-warn">Urgent</span>
            </div>
            <p>
              Quickly report an incident with live GPS location, photos and a
              short description to alert authorities.
            </p>
            <Link to="/report" className="card__action">Report Now →</Link>
            <span className="glow" />
          </article>

          <article className="card c-aid">
            <div className="card__head">
              <h3>Request Aid</h3>
              <span className="pill pill-ok">Live</span>
            </div>
            <p>
              Ask for food, water, shelter, medical help or other essentials and
              track status in real-time.
            </p>
            <Link to="/aid" className="card__action">Request Aid →</Link>
            <span className="glow" />
          </article>

          <article className="card c-claim">
            <div className="card__head">
              <h3>Damage Claiming</h3>
            </div>
            <p>
              Submit your damage claim with evidence and follow up on approvals
              and payouts.
            </p>
            <Link to="/claim" className="card__action">Start Claim →</Link>
            <span className="glow" />
          </article>
        </div>

        {/* Side widgets */}
        <aside className="side">
          <section className="widget">
            <header className="widget__head">
              <h4>Recent Requests</h4>
              <span className="pill">Live</span>
            </header>
            <div className="widget__body">
              <table className="table">
                <thead>
                  <tr><th>Type</th><th>Ref</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr><td>Report</td><td>#R-1028</td><td><span className="dot dot-warn" /> Pending</td></tr>
                  <tr><td>Aid</td><td>#A-343</td><td><span className="dot dot-ok" /> Approved</td></tr>
                  <tr><td>Claim</td><td>#C-87</td><td><span className="dot dot-bad" /> Rejected</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="widget">
            <header className="widget__head"><h4>Safety Tips</h4></header>
            <div className="widget__body">
              Keep your phone charged, share location when reporting, and follow
              official instructions from authorities.
            </div>
          </section>
        </aside>
      </section>

      <p className="footnote">If this is an emergency, call local authorities immediately.</p>
    </main>
  );
}

