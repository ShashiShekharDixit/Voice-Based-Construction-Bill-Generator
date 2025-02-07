let itemCount = 0;
function addItem() {
  itemCount++;
  let table = document.getElementById("billBody");
  let row = table.insertRow();
  row.innerHTML = `
                <td>${itemCount}</td>
                <td><button onclick="startListening(this, 'description')">🎤</button> <span class="description"></span></td>
                <td><button onclick="startListening(this, 'rate')">🎤</button> <span class="rate"></span></td>
                <td><button onclick="startListening(this, 'quantity')">🎤</button> <span class="quantity"></span></td>
                <td class="amount">0</td>
            `;
}

function startListening(button, type) {
  let recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function (event) {
    let transcript = event.results[0][0].transcript.trim();
    let span = button.nextElementSibling;
    span.innerText = transcript;
    calculateAmount(button.closest("tr"));
  };
}

function calculateAmount(row) {
  let rate = parseFloat(row.querySelector(".rate").innerText) || 0;
  let quantity = parseFloat(row.querySelector(".quantity").innerText) || 0;
  let amount = rate * quantity;
  row.querySelector(".amount").innerText = amount.toFixed(2);
  updateTotal();
}

function updateTotal() {
  let totalAmount = 0;
  document.querySelectorAll(".amount").forEach((td) => {
    totalAmount += parseFloat(td.innerText) || 0;
  });
  let sgst = totalAmount * 0.09;
  let cgst = totalAmount * 0.09;
  let finalTotal = totalAmount + sgst + cgst;
  document.getElementById("sgst").innerText = sgst.toFixed(2);
  document.getElementById("cgst").innerText = cgst.toFixed(2);
  document.getElementById("total").innerText = finalTotal.toFixed(2);
}
