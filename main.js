(function(){
  "use strict";

  // Rellenar los Likert declarados con data-likert en el HTML
  document.querySelectorAll("[data-likert]").forEach(function(box){
    var name = box.getAttribute("data-likert");
    var h = "";
    for(var i = 1; i <= 5; i++){
      h += '<label><input type="radio" name="' + name + '" value="' + i + '"> ' + i + '</label>';
    }
    box.innerHTML = h;
  });

  // Fecha por defecto = hoy
  try{
    document.getElementById("fecha").valueAsDate = new Date();
  }catch(e){}

  // ── Envío (Web3Forms) ───────────────────────────────────────
  var form     = document.getElementById("du-form");
  var sendBtn  = document.getElementById("send-btn");
  var statusEl = document.getElementById("status");

  function setStatus(msg, kind){
    statusEl.textContent = msg;
    statusEl.className   = "status " + (kind || "");
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(form.botcheck && form.botcheck.checked) return;

    var uid = (form.ID_Usuario && form.ID_Usuario.value) ? form.ID_Usuario.value : "";
    document.getElementById("subject").value =
      "Datos de Participante LIMA — " + (uid || "Segunda Tanda");

    var data = Object.fromEntries(new FormData(form).entries());
    sendBtn.disabled = true;
    setStatus("Enviando…", "");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
    .then(function(r){ return r.json(); })
    .then(function(res){
      if(res.success){
        setStatus("✅ ¡Enviado! Los datos llegaron a tu correo.", "ok");
        form.reset();
        try{ document.getElementById("fecha").valueAsDate = new Date(); }catch(e){}
      } else {
        setStatus("No se pudo enviar: " + (res.message || "error desconocido"), "err");
      }
    })
    .catch(function(){
      setStatus("Problema de red. Revisa tu conexión e inténtalo de nuevo.", "err");
    })
    .finally(function(){ sendBtn.disabled = false; });
  });
})();
