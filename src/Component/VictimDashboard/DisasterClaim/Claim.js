// src/Component/VictimDashboard/DisasterClaim/Claim.js
import React, { useEffect, useState } from "react";
import "./Claim.css";
import Dashboard from "../Dashboard";
import Footer from "../Footer/Footer";

export default function Claim() {
  
  const [form, setForm] = useState({
    fullName: "",
    nic: "",
    phone: "",
    address: "",
    incidentDate: "",
    location: "",
    claimType: "",
    estimate: "",
    description: "",
    files: []
  });

  const images = [
    "/images/claims/house_1.jpg",
    "/images/claims/house_2.jpg",
    "/images/claims/infrastructure.jpg",
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), 4200);
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
    // TODO: POST multipart/form-data to /api/claims
    console.log("Claim payload:", form);
    alert("Claim submitted (demo).");
  }

  return (
    <main className="claim container">
      <header className="page-head">
        <div>
          <h1>Damage Claim</h1>
          <p className="muted">Submit your claim with evidence for assessment.</p>
        </div>
        <button className="btn-ghost" type="button" onClick={useMyLocation}>Use My Location</button>
      </header>

      <section className="page-grid">
        <form className="card form" onSubmit={onSubmit}>
          <div className="row two">
            <label>
              <span>Full name</span>
              <input className="input" name="fullName" value={form.fullName} onChange={onChange} required />
            </label>
            <label>
              <span>NIC</span>
              <input className="input" name="nic" value={form.nic} onChange={onChange} required />
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Phone</span>
              <input className="input" name="phone" value={form.phone} onChange={onChange} required />
            </label>
            <label>
              <span>Incident date</span>
              <input className="input" type="date" name="incidentDate" value={form.incidentDate} onChange={onChange} required />
            </label>
          </div>

          <div className="row">
            <label>
              <span>Address</span>
              <input className="input" name="address" value={form.address} onChange={onChange} />
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Location (lat, lng)</span>
              <input className="input" name="location" value={form.location} onChange={onChange} placeholder="6.927079, 79.861244" />
            </label>
            <label>
              <span>Estimated cost (LKR)</span>
              <input className="input" name="estimate" value={form.estimate} onChange={onChange} inputMode="numeric" placeholder="0.00" />
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Claim type</span>
              <select className="select" name="claimType" value={form.claimType} onChange={onChange} required>
                <option value="">Select…</option>
                <option value="property">Property Damage</option>
                <option value="injury">Medical / Injury</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="upload">
              <span>Evidence (images / PDFs)</span>
              <input id="claimFiles" type="file" name="files" onChange={onChange} multiple accept=".jpg,.jpeg,.png,.pdf" />
            </label>
          </div>

          <div className="row">
            <label>
              <span>Description</span>
              <textarea className="textarea" name="description" value={form.description} onChange={onChange}
                        placeholder="Describe the damage and circumstances…" />
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-ghost" type="reset">Clear</button>
            <button className="btn btn-primary" type="submit">Submit Claim</button>
          </div>
        </form>

        <aside className="card slider">
          <figure className="slider__viewport">
            {images.map((src, i) => (
              <img key={src} src={src} alt="" className={"slide" + (i === slide ? " is-active" : "")} />
            ))}
          </figure>
          <div className="slider__controls">
            <button className="dot" onClick={() => setSlide((s)=> (s-1+images.length)%images.length)} />
            <div className="dots">
              {images.map((_, i) => (
                <button key={i} className={"dot" + (i===slide ? " is-on" : "")} onClick={()=>setSlide(i)} />
              ))}
            </div>
            <button className="dot" onClick={() => setSlide((s)=> (s+1)%images.length)} />
          </div>
          <p className="slider__hint">Swap in your own images.</p>
        </aside>
      </section>
    </main>
  );
}

export function ClaimPage() {
  return (
    <>
      <Dashboard />
      <Footer />
    </>
  );
}

