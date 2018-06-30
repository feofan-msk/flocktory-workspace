function qs(s) {
  return document.querySelector(s);
}

// document.addEventListener("DOMContentLoaded", function() {});

widget.ready(() => {
  qs(".js-to-terms").addEventListener("click", () => {
    widget.setScreen("terms");
  });
  qs(".js-to-terms").addEventListener("click", () => {
    widget.setScreen("login");
  });

  /* eslint-disable-next-line */
  new Cleave('[name="user_phone"]', {
    phone: true,
    phoneRegionCode: "RU",
    prefix: "+7",
    noImmediatePrefix: true
  });

  const form = document.querySelector(".form");

  form.addEventListener("submit", event => {
    const name = form.elements.user_name.value;
    const email = form.elements.user_mail.value;
    const phone = form.elements.user_phone.value;

    widget
      .collectEmail(email, name, {
        phone,
        decision: "true"
      })
      .then(() => {
        widget.setScreen("success");
      });

    event.preventDefault();
  });
});
