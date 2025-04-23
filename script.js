let tripCount = 0;
const maxTrips = 5;

// Add new trip option form block
function addTripOption() {
  if (tripCount >= maxTrips) return;

  tripCount++;
  const container = document.getElementById("tripOptions");

  const tripDiv = document.createElement("div");
  tripDiv.classList.add("trip-option");
  tripDiv.setAttribute("id", `trip${tripCount}`);

  tripDiv.innerHTML = `
    <h4>Trip Option ${tripCount}</h4>
    <div class="input-group">
      <label>Destination</label>
      <input type="text" id="destination${tripCount}" />
    </div>
    <div class="input-group">
      <label>Package Name</label>
      <input type="text" id="package${tripCount}" />
    </div>
    <div class="input-group">
      <label>Price</label>
      <input type="text" id="price${tripCount}" />
    </div>
    <div class="input-group">
      <label>Description</label>
      <textarea id="description${tripCount}"></textarea>
    </div>
    <div class="input-group">
      <label>Upload Photo</label>
      <input type="file" accept="image/*" id="photo${tripCount}" onchange="previewImage(this, ${tripCount})" />
      <img id="preview${tripCount}" class="thumbnail-preview" />
    </div>
  `;

  container.appendChild(tripDiv);
}


function previewImage(input, count) {
    const file = input.files[0];
    const preview = document.getElementById(`preview${count}`);
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.alt = "Trip photo preview";
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  }
  



  async function generateEmail() {
    const client = document.getElementById("clientName").value.trim();
    const agent = document.getElementById("agentName")?.value.trim();
    const agency = document.getElementById("agencyName")?.value.trim();

  
    const intro = document.getElementById("emailIntro");
    const closing = document.getElementById("emailClosing");
    const previewBody = document.getElementById("emailPreview");
  
    // Clear previous content
    previewBody.innerHTML = "";
    intro.innerHTML = `Dear ${client},<br></br>Thank you for reaching out! Here are the trip options we discussed:`;
  
    for (let i = 1; i <= tripCount; i++) {
      const destination = document.getElementById(`destination${i}`).value.trim();
      const pkg = document.getElementById(`package${i}`).value.trim();
      const price = document.getElementById(`price${i}`).value.trim();
      const desc = document.getElementById(`description${i}`).value.trim();
      const fileInput = document.getElementById(`photo${i}`);
      const file = fileInput.files[0];
  
      const row = document.createElement("tr");
  
      // Trip Details
      const detailsCell = document.createElement("td");
      detailsCell.innerHTML = `
        <strong>Option ${i}:</strong>
        <br>${destination} - ${pkg}<br>
        <strong>Price $:</strong> ${price}
        <br><strong>Description:</strong> ${desc}</br>
      `;
      row.appendChild(detailsCell);
  
      // Image Cell
      const imageCell = document.createElement("td");
      if (file) {
        const imageUrl = await readImageAsDataURL(file);
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Photo of ${destination}`;
        img.classList.add("table-thumbnail");
        imageCell.appendChild(img);
      } else {
        imageCell.textContent = "No image provided";
      }
      row.appendChild(imageCell);
  
  
      // Add the row to the preview table
      previewBody.appendChild(row);
    }
  
    closing.innerHTML = `Let me know which one you love most, and I’d be happy to assist further! <br></br>Warm regards,<br></br>${agent|| agency}`;

   }
  
      //Email copy function 
      async function copyScreenshot() { 
        const element = document.getElementById("emailContainer");
      
        if (!element) {
          alert("Element not found!");
          return;
        }
      
        try {
          const canvas = await html2canvas(element);
      
          canvas.toBlob(async (blob) => {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
              ]);
              alert("✅ Screenshot copied to clipboard!");
            } catch (err) {
              alert("⚠️ Failed to copy screenshot.");
              console.error(err);
            }
          });
        } catch (err) {
          alert("⚠️ Error generating screenshot.");
          console.error(err);
        }
      }

      //Copy Email as HTML
      async function copyEmailHTML() {
        const element = document.getElementById("emailContainer");
      
        if (!element) {
          alert("Element not found!");
          return;
        }
      
        try {
          const htmlContent = element.innerHTML;
      
          await navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([htmlContent], { type: "text/html" }),
              "text/plain": new Blob([element.innerText], { type: "text/plain" })
            })
          ]);
      
          alert("✅ Email content copied with images and links!");
        } catch (err) {
          alert("⚠️ Failed to copy content. Please copy manually.");
          console.error("Copy error:", err);
        }
      }
     
  
  // Final thank-you and reminder message
  const finalMsg = document.getElementById("finalMessage");
  finalMsg.innerHTML = `
    <p>
      <strong>Thank you for using Travel Savvy Quote Builder!</strong><br>
      For best practice, please attach your quote documents directly into your email to clients!<br>
      For additional support or Travel Agent Savvy Tips contact us at 
      <a href="mailto:agents@travelsavvy.co">agents@travelsavvy.co</a><br>
      <em>Happy Booking!</em> ✈️
    </p>
  `;
  
  // 🔁 Helper function to read files as base64 (promisified FileReader)
  function readImageAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  