let itemCount = 0;
        function addItem() {
            itemCount++;
            let table = document.getElementById("billBody");
            let row = table.insertRow();
            row.innerHTML = `
                <td>${itemCount}</td>
                <td><input type="text" class="description"> <button onclick="startListening(this, 'description')" class="mic">🎤</button></td>
                <td><input type="text" class="rate"> <button onclick="startListening(this, 'rate')" class="mic">🎤</button></td>
                <td><input type="text" class="quantity"> <button onclick="startListening(this, 'quantity')" class="mic">🎤</button></td>
                <td class="amount">0</td>
            `;
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
                input.addEventListener("change", () => calculateAmount(button.closest("tr")));
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
            document.getElementById("amountWords").innerText = numberToWordsIndian(finalTotal) + " only/-";
        }

        function finalizeBill() {
            document.querySelectorAll(".mic").forEach(btn => btn.classList.add("hide"));
            document.getElementById("addItemBtn").classList.add("hide");
            document.getElementById("doneBtn").classList.add("hide");
            document.getElementById("printBtn").classList.remove("hide");
        }

        function printBill() {
            window.print();
        }

        function numberToWordsIndian(num) {
            if (num === 0) return "Zero";
            const units = ["", "Thousand", "Lakh", "Crore"];
            const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
            const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            function convert(n, index) {
                if (n === 0) return "";
                if (n < 20) return a[n] + " " + units[index];
                if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "") + " " + units[index];
                return a[Math.floor(n / 100)] + " Hundred " + convert(n % 100, index);
            }
            let parts = [];
            let i = 0;
            while (num > 0) {
                let chunk = num % 1000;
                if (chunk) parts.push(convert(chunk, i));
                num = Math.floor(num / 1000);
                i++;
            }
            return parts.reverse().join(" ").trim();
        }