/**
 * Contact form: checks name / email / message, then either opens the visitor's email app
 * to your Google Form (`site.contact.googleForm` in src/data/site.js). Until that is filled in, it falls back to
 * opening the visitor's email app (mailto:).
 */
import { site } from '../data/site.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELDS = ['name', 'email', 'message'];

/** Returns { fieldName: 'error message' } for anything invalid (empty object = all good). */
export function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please tell me your name.';
  if (!email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Is that an email address..?";
  if (message.trim().length < 5) errors.message = 'Please write a message!';
  return errors;
}

export function setupContactForm(root = document) {
  const form = root.querySelector('#contact-form');
  if (!form) return;
  const status = root.querySelector('.cf-status'); // lives next to the Send button, outside the <form>
  const values = () => ({
    name: form.elements.name.value,
    email: form.elements.email.value,
    message: form.elements.message.value,
    website: form.elements.website.value, // hidden "honeypot" field: real people leave it empty
  });

  /** Show (or clear) the error under one field. */
  function showError(field, message = '') {
    const input = form.elements[field];
    input.classList.toggle('bad', !!message);
    input.setAttribute('aria-invalid', String(!!message));
    input.parentElement.querySelector('.err').textContent = message;
  }

  // check a field when you leave it, and clear its error as soon as you fix it
  FIELDS.forEach((field) => {
    form.elements[field].addEventListener('blur', () => showError(field, validate(values())[field]));
    form.elements[field].addEventListener('input', () => {
      if (form.elements[field].classList.contains('bad')) showError(field, validate(values())[field]);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = values();
    const errors = validate(v);
    FIELDS.forEach((field) => showError(field, errors[field]));
    const firstBad = FIELDS.find((field) => errors[field]);
    if (firstBad) {
      status.textContent = '';
      form.elements[firstBad].focus();
      return;
    }
    if (v.website) return; // a bot filled the hidden field

    const gf = site.contact.googleForm;
    if (gf && gf.url) {
      // Google Form wrapper: post the answers to the form's /formResponse address.
      // (Google does not allow reading the reply from another site, so "no-cors" is used and success is assumed.)
      status.textContent = 'Sending...';
      const data = new URLSearchParams();
      data.append(gf.fields.name, v.name.trim());
      data.append(gf.fields.email, v.email.trim());
      data.append(gf.fields.message, v.message.trim());
      try {
        await fetch(gf.url, { method: 'POST', mode: 'no-cors', body: data });
        status.textContent = 'Thank you! Your message was sent.';
        form.reset();
      } catch {
        status.textContent = `Something went wrong. You can email me directly at ${site.email}.`;
      }
    } else {
      // standard email wrapper: open the visitor's email app with everything filled in
      const subject = `Message from ${v.name.trim()}`;
      const body = `${v.message.trim()}\n\n${v.name.trim()}\n${v.email.trim()}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = `Opening your email app... if nothing opens, write to ${site.email}.`;
    }
  });
}
