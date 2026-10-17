import { useState } from "react";
import React from "react";

function MoodMatcher({ onFindMovie }) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!mood.trim() || loading) return;

    try {
      setLoading(true);
      setMessage("");
      const title = await onFindMovie(mood);
      setMessage(`AI suggested: ${title}`);
    } catch (error) {
      setMessage(error.message || "Could not get an AI recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mood-box">
      <div>
        <p className="eyebrow">AI MOOD MATCHER</p>
        <h2>Tell us how you feel.</h2>
        <p>
          Example: “I am feeling sad but want an action movie.”
        </p>
      </div>

      <form onSubmit={submit} className="mood-form">
        <label htmlFor="mood-input" className="visually-hidden">
          Describe your mood
        </label>
        <input
          id="mood-input"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          placeholder="Describe your mood..."
          maxLength={300}
        />
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Find a Movie"}
        </button>
      </form>

      {message && <p className="mood-message">{message}</p>}
    </section>
  );
}

export default MoodMatcher;
