export async function sendReport(data) {
  await fetch("https://script.google.com/macros/s/AKfycbxY-9bdSVSy8iPgok9M4DMLI93FBWsCxQ6HXN9J3rMw6Ws6dEZJZQJjDPW-YBJyx2NPIg/exec", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
