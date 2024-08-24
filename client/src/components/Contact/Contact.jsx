import React from "react";

function Contact() {
  return (
    <div>
      <div className="container-contact">
        <h2>Contact Us</h2>
        <div className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>
          <button>Submit</button>
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1454.1767758982016!2d15.63798305309829!3d46.5588393587904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1shr!2ssi!4v1716490807600!5m2!1shr!2ssi"
        width="800"
        height="400"
        title="Contact Adress"
        style={{ border: 0, marginBottom: 50 }}
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default Contact;
