// src/Component/VictimDashboard/ReportDisaster/Report.js
import React, { useEffect, useState } from "react";
import "./Report.css";

export default function Report() {
  const [form, setForm] = useState({
    reporterName: "",
    phone: "",
    disasterType: "",
    urgency: "high",
    occurredAt: "",
    location: "",
    description: "",
    media: []
  });

  // -------- image slider (replace with your images) --------
  const images = [
    "/images/disasters/flood_1.jpg",
    "/images/disasters/flood_2.jpg",
    "/images/disasters/storm_1.jpg",
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  function onChange(e) {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? [...files] : value }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setForm((f) => ({
          ...f,
          location: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
        })),
      () => alert("Unable to get location")
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    // TODO: send FormData to backend: /api/report
    console.log("Report payload:", form);
    alert("Report submitted (demo). Check console.");
  }

  return (
    <main className="report container">
      <header className="page-head">
        <div>
          <h1>Report Disaster</h1>
          <p className="muted">Report an incident with location and media to alert responders.</p>
        </div>
        <button className="btn-ghost" type="button" onClick={useMyLocation}>Use My Location</button>
      </header>

      <section className="page-grid">
        {/* LEFT: FORM */}
        <form className="card form" onSubmit={onSubmit}>
          <div className="row two">
            <label>
              <span>Reporter name</span>
              <input className="input" name="reporterName" value={form.reporterName} onChange={onChange} required />
            </label>
            <label>
              <span>Phone</span>
              <input className="input" name="phone" value={form.phone} onChange={onChange} required />
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Disaster type</span>
              <select className="select" name="disasterType" value={form.disasterType} onChange={onChange} required>
                <option value="">Select…</option>
                <option>Flood</option><option>Storm</option><option>Landslide</option>
                <option>Fire</option><option>Earthquake</option><option>Other</option>
              </select>
            </label>
            <label>
              <span>Urgency</span>
              <select className="select" name="urgency" value={form.urgency} onChange={onChange}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Occurred at</span>
              <input className="input" type="datetime-local" name="occurredAt" value={form.occurredAt} onChange={onChange} required />
            </label>
            <label>
              <span>Location (lat, lng)</span>
              <input className="input" name="location" value={form.location} onChange={onChange} placeholder="6.927079, 79.861244" />
            </label>
          </div>

          <div className="row">
            <label>
              <span>Description</span>
              <textarea className="textarea" name="description" value={form.description} onChange={onChange}
                        placeholder="Briefly describe what happened…" />
            </label>
          </div>

          <div className="row">
            <label className="upload">
              <span>Attach media (images/videos)</span>
              <input type="file" name="media" multiple accept=".jpg,.jpeg,.png,.mp4,.mov" onChange={onChange} />
            </label>
          </div>

          <div className="actions">
            <button type="reset" className="btn btn-ghost">Clear</button>
            <button type="submit" className="btn btn-primary">Submit Report</button>
          </div>
        </form>

        {/* RIGHT: SLIDER */}
        <aside className="card slider">
          <figure className="slider__viewport">
            {images.map((src, i) => (
              <img key={src} src={src} alt="" className={"slide" + (i === slide ? " is-active" : "")} />
            ))}
          </figure>
          <div className="slider__controls">
            <button className="dot" aria-label="prev" onClick={() => setSlide((s)=> (s-1+images.length)%images.length)} />
            <div className="dots">
              {images.map((_, i) => (
                <button key={i} className={"dot" + (i===slide ? " is-on" : "")} onClick={()=>setSlide(i)} />
              ))}
            </div>
            <button className="dot" aria-label="next" onClick={() => setSlide((s)=> (s+1)%images.length)} />
          </div>
          <p className="slider__hint">Add your own images by replacing the URLs in <code>images</code>.</p>
        </aside>
      </section>
    </main>
  );
}
