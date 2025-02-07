let itemCount = 0;

function addItem() {
    itemCount++;
    let table = document.getElementById("billBody");
    let row = table.insertRow();
    row.innerHTML = `
        <td>${itemCount}</td>
        <td><textarea class="description" oninput="autoResize(this)"></textarea> <button onclick="startListening(this, 'description')" class="mic">🎤</button></td>
        <td><textarea class="rate" oninput="autoResize(this)"></textarea> <button onclick="startListening(this, 'rate')" class="mic">🎤</button></td>
        <td><textarea class="quantity" oninput="autoResize(this)"></textarea> <button onclick="startListening(this, 'quantity')" class="mic">🎤</button></td>
        <td class="amount">0</td>
    `;

    row.querySelector(".rate").addEventListener("input", () => calculateAmount(row));
    row.querySelector(".quantity").addEventListener("input", () => calculateAmount(row));
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function startHeadingRecognition() {
    let recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript.trim();
        document.getElementById("editableHeading").innerText = transcript;
    };
}

function startListening(button, type) {
    let recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript.trim().replace(/\.$/, '');
        let input = button.previousElementSibling;
        input.value = transcript;
        calculateAmount(button.closest("tr"));
    };
}

function calculateAmount(row) {
    let rate = parseFloat(row.querySelector(".rate").value) || 0;
    let quantity = parseFloat(row.querySelector(".quantity").value) || 0;
    let amount = rate * quantity;

    row.querySelector(".amount").innerText = amount.toFixed(2);
    updateTotal();
}

function updateTotal() {
    let totalAmount = 0;
    document.querySelectorAll(".amount").forEach(td => {
        totalAmount += parseFloat(td.innerText) || 0;
    });

    let sgst = totalAmount * 0.09;
    let cgst = totalAmount * 0.09;
    let finalTotal = totalAmount + sgst + cgst;

    document.getElementById("sgst").innerText = sgst.toFixed(2);
    document.getElementById("cgst").innerText = cgst.toFixed(2);
    document.getElementById("total").innerText = finalTotal.toFixed(2);
    document.getElementById("amountWords").innerText = numberToWordsIndian(Math.round(finalTotal)) + " only/-";
}

function finalizeBill() {
    document.querySelectorAll(".mic").forEach(btn => btn.classList.add("hide"));
    document.getElementById("addItemBtn").classList.add("hide");
    document.getElementById("doneBtn").classList.add("hide");
    document.getElementById("editableHeading").classList.add("no-underline");
    document.getElementById("printBtn").classList.remove("hide");
}

function printBill() {
    let printBtn = document.getElementById("printBtn");
    printBtn.style.display = "none";
    window.print();
    printBtn.style.display = "block";
}


function numberToWordsIndian(num) {
    if (num === 0) return "Zero";

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    function convertChunk(n) {
        let result = "";
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }
        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + " ";
            n %= 10;
        }
        if (n > 0) {
            result += ones[n] + " ";
        }
        return result.trim();
    }

    let parts = [];
    let scaleIndex = 0;
    let chunkCount = 0;

    while (num > 0) {
        let chunk;

        if (chunkCount === 0) { 
            chunk = num % 1000; 
            num = Math.floor(num / 1000);
        } else {
            chunk = num % 100;
            num = Math.floor(num / 100);
        }

        if (chunk > 0) {
            parts.push(convertChunk(chunk) + " " + scales[scaleIndex]);
        }

        scaleIndex++;
        chunkCount++;
    }

    return parts.reverse().join(" ").trim();
}
