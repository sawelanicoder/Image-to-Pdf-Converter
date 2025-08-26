document.getElementById("convertBtn").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const files = document.getElementById("imageInput").files;

  if (files.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imgData = await toBase64(file);

    if (i > 0) {
      pdf.addPage();
    }
    pdf.addImage(imgData, "JPEG", 10, 10, 180, 160);
  }

  pdf.save("converted.pdf");
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
