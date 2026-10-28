import React, { useState } from "react";
import { contacts, notifyEndpoint, notifyLabel } from "../mootConfig";

const EMPTY = { name: "", email: "", institution: "", country: "" };

// Collects interest while registration is closed. Posts to `notifyEndpoint`
// when one is configured, and otherwise opens a prefilled email.
export default function NotifyForm({ idPrefix = "notify" }) {
  const [values, setValues] = useState(EMPTY);
  const [state, setState] = useState("idle");

  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (!notifyEndpoint) {
      const subject = encodeURIComponent("IIDW Moot 2027 registration notification");
      const body = encodeURIComponent(
        `Please notify me when registration opens.\n\nName ${values.name}\nEmail ${values.email}\nInstitution ${values.institution}\nCountry ${values.country}`
      );
      window.location.href = `mailto:${contacts.primary}?subject=${subject}&body=${body}`;
      setState("mailto");
      return;
    }
    setState("sending");
    try {
      const response = await fetch(notifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "moot-2027" }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState("done");
      setValues(EMPTY);
    } catch (e) {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="moot-form__done" role="status">
        <p>
          Thank you for your interest. We have added your address to the list, and we will write to you on the day
          registration opens.
        </p>
      </div>
    );
  }

  const field = (name, label, type = "text", autoComplete) => (
    <div className="moot-field">
      <label htmlFor={`${idPrefix}-${name}`}>{label}</label>
      <input
        id={`${idPrefix}-${name}`}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        value={values[name]}
        onChange={update}
      />
    </div>
  );

  return (
    <form className="moot-form" onSubmit={submit} noValidate={false}>
      {field("name", "Full name", "text", "name")}
      {field("email", "Email", "email", "email")}
      {field("institution", "Institution", "text", "organization")}
      {field("country", "Country", "text", "country-name")}
      <div className="moot-form__foot">
        <button className="moot-btn moot-btn--gold" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending your request" : notifyLabel()}
        </button>
        <p className="moot-form__note" role="status">
          {state === "error"
            ? `We could not send your request, so please write to ${contacts.primary} instead.`
            : state === "mailto"
            ? "Your email application should now open with a prefilled message for you to send."
            : "We will use these details only to notify you when registration opens."}
        </p>
      </div>
    </form>
  );
}
