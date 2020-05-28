document.getElementById("getPairing").addEventListener("click", getPairing);

async function getPairing() {
  const wineSuggestion = document.getElementById("pairedWines");
  const wineText = document.getElementById("pairingText");
  const food = document.querySelector("#search").value;
  console.log(food);

  try {
    const res = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine/pairing?food=${food}`,

      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "b1a0cdbbdamsh5ed46a233af9927p1314dejsndde4aedcb331",

          "Content-type": "application/json",
        },
      }
    );
    let suggestion = await res.json();
    console.log(JSON.parse(JSON.stringify(suggestion)));
    //wine.innerHTML = suggestion;
    const pairedWines = suggestion.pairedWines;
    const pairingText = suggestion.pairingText;
    const productMatches = suggestion.productMatches;
    // console.log(pairedWines);
    wineSuggestion.innerHTML = pairedWines;
    wineText.innerHTML = pairingText;
    // wine.innerHTML = productMatches;
  } catch (err) {
    console.log(err);
  }
}
