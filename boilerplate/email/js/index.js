function qs(s) {
  return document.querySelector(s);
}

// document.addEventListener("DOMContentLoaded", function() {});

widget.ready(() => {
  const form = qs(".js-form");

  form.addEventListener("submit", event => {
    const email = form.elements.user_mail.value;
    const checkbox = form.elements.checkbox.checked.toString();

    widget
      .collectEmail(email, null, {
        decision: checkbox
      })
      .then(() => {
        widget.setScreen("success");
      });

    event.preventDefault();
  });
});
