// src/Component/VictimDashboard/RequestAid/Aid.js
import React, { useEffect, useState } from "react";
import "./Aid.css";

export default function Aid() {
  const [form, setForm] = useState({
    requesterName: "",
    phone: "",
    needType: "",
    quantity: "",
    priority: "urgent",
    address: "",
    location: "",
    notes: "",
  });

  const images = [
    "/images/aid/food.jpg",
    "/images/aid/water.jpg",
    "/images/aid/medical.jpg",
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
    // TODO: POST /api/aid-requests
    console.log("Aid request:", form);
    alert("Aid request submitted (demo).");
  }

  return (
    <main className="aid container">
      <header className="page-head">
        <div>
          <h1>Request Aid</h1>
          <p className="muted">Ask for essentials and track your request.</p>
        </div>
        <button className="btn-ghost" type="button" onClick={useMyLocation}>Use My Location</button>
      </header>

      <section className="page-grid">
        <form className="card form" onSubmit={onSubmit}>
          <div className="row two">
            <label>
              <span>Your name</span>
              <input className="input" name="requesterName" value={form.requesterName} onChange={onChange} required />
            </label>
            <label>
              <span>Phone</span>
              <input className="input" name="phone" value={form.phone} onChange={onChange} required />
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Need type</span>
              <select className="select" name="needType" value={form.needType} onChange={onChange} required>
                <option value="">Select…</option>
                <option>Food</option><option>Water</option><option>Shelter</option>
                <option>Medical</option><option>Rescue</option><option>Other</option>
              </select>
            </label>
            <label>
              <span>Quantity / People</span>
              <input className="input" name="quantity" value={form.quantity} onChange={onChange} placeholder="eg. 5 packs / 3 people" />
            </label>
          </div>

          <div className="row two">
            <label>
              <span>Priority</span>
              <select className="select" name="priority" value={form.priority} onChange={onChange}>
                <option value="urgent">Urgent</option><option value="normal">Normal</option>
              </select>
            </label>
            <label>
              <span>Location (lat, lng)</span>
              <input className="input" name="location" value={form.location} onChange={onChange} />
            </label>
          </div>

          <div className="row">
            <label>
              <span>Address / nearest landmark</span>
              <input className="input" name="address" value={form.address} onChange={onChange} />
            </label>
          </div>

          <div className="row">
            <label>
              <span>Notes</span>
              <textarea className="textarea" name="notes" value={form.notes} onChange={onChange}
                        placeholder="Any additional information (children, elderly, medical needs)..." />
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-ghost" type="reset">Clear</button>
            <button className="btn btn-primary" type="submit">Send Request</button>
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
          <p className="slider__hint">Replace the image URLs with yours.</p>
        </aside>
      </section>
    </main>
  );
}
