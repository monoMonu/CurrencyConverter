
import {api_key} from './config.js'
const baseUrl = (endpoint) => `https://api.currencybeacon.com/v1/${endpoint}?api_key=${api_key}`;

const fetchData = async (url) =>{
   const res = await fetch(url);
   const data = await res.json();
   return data;
}

const symbolEl = document.querySelector('#symbol')

let currencyData;
async function populateCurrencyList(){
   try {
      loader.style.display = "grid";
      const {response} = await fetchData(baseUrl("currencies"));
      currencyData = response;
      response.forEach(el => {
         const option = `<option value="${el.short_code}">${el.name} (${el.symbol})</option>`;
         fromCurrency.innerHTML += option;
         toCurrency.innerHTML += option;
   
         if(el.short_code=='USD'){
            symbolEl.innerText =  el.symbol;
         }

      });
      document.querySelector("#fromCurrency option[value='USD']").setAttribute("selected",true);
      document.querySelector("#toCurrency option[value='INR']").setAttribute("selected",true);
      loader.style.display = "none";
   } catch (error) {
      console.log("Error while fetching data. Please try again later."+error)
      loader.style.display = "none";
   }
};
populateCurrencyList();

fromCurrency.addEventListener('change', ()=>{
   Object.keys(currencyData).forEach( el => {
      if(currencyData[el].short_code==fromCurrency.value){
         symbol.innerText = currencyData[el].symbol;
         return;
      }
   })
})


async function determineRate(base, symbols){
   loader.style.display = "grid";
   const data = await fetchData(`${baseUrl("latest")}&base=${base}&symbols=${symbols}`);
   const currentRate = data.rates[symbols];
   loader.style.display = "none";
   return currentRate;
}

convertBtn.addEventListener('click', async () => {
   if(isNaN(amount.value)){
      alert("Please enter the amount");
      return;
   }
   const rate = await determineRate(fromCurrency.value, toCurrency.value);
   const amt = amount.value;
   let toCurrencySymbol;
   Object.keys(currencyData).forEach( el => {
      if(currencyData[el].short_code==toCurrency.value){
         toCurrencySymbol = currencyData[el].symbol;
         return;
      }
      // else if(currencyData[el].short_code==fromCurrency.value){
      //    fromCurrencySymbol = currencyData[el].symbol;
      // }
   })
   rate_box.innerText = ` ${toCurrencySymbol} ${rate.toFixed(2)} `;
   result_amount.innerText = `${toCurrencySymbol} ${(amt*rate).toFixed(2)} `;
})

// Disable right click
window.addEventListener('contextmenu', (e)=> e.preventDefault());