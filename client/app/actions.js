const fetchAndLoadFile = (wineName) =>
  fetch("/api/wines/" + encodeURIComponent(wineName))
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((wineData) => loadFileToEditor(wineData.name, wineData.text))
    .catch((err) => console.error(err));

const saveFile = (wineName, wineText) => {
  fetch("/api/wines/" + encodeURIComponent(wineName), {
    method: "POST",
    body: JSON.stringify({ text: wineText }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((winesList) => {
      renderFilesList(winesList);
      alert("your changes are saved");
    })
    .catch((err) => {
      alert("unable to save your changes");
      console.log(err);
    });
};
