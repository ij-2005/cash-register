window.onload = function() {
  updateStatus();
};

const cashStatus = document.querySelector(".status-cashier");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDues = document.getElementById("change-due");
const priceDisplay = document.getElementById("total");

let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
const currencyUnits = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1.00,
  "FIVE": 5.00,
  "TEN": 10.00,
  "TWENTY": 20.00,
  "ONE HUNDRED": 100.00
};

//functions

function updateStatus(){

    cashStatus.innerHTML = `<h3>Change in drawer:</h3>
    <p>Pennies: $${cid[0][1]}</p>
    <p>Nickels: $${cid[1][1]}</p>
    <p>Dimes: $${cid[2][1]}</p>
    <p>Quarters: $${cid[3][1]}</p>
    <p>Ones: $${cid[4][1]}</p>
    <p>Fives: $${cid[5][1]}</p>
    <p>Tens: $${cid[6][1]}</p>
    <p>Twenties: $${cid[7][1]}</p>
    <p>Hundreds: $${cid[8][1]}</p>`;

    priceDisplay.innerHTML = `Total: $${price}`;

}

function changeDue(result){
    changeDues.innerHTML = "";
    changeDues.innerHTML += `<p>STATUS: ${result.status}</p>`;

    if(Array.isArray(result.change)){
        console.log("change exists!");
        result.change.forEach(element => {
        changeDues.innerHTML += `<p>${element.name}: $${element.amount}`;
    });
    }else{
        console.log("array doesn't exist");
    }


}

const overallCid = (array)=>{

    let overall = 0;
    for(let i = array.length - 1; i >= 0; i--){
        overall += array[i][1];
    }
    return overall;

}


const changeLogic = () => {

    let changes = [];
    const overallCash = overallCid(cid);
    console.log(overallCash);
    let change = Number(cashInput.value) - price;


    if(overallCash < change){

        return {status: "INSUFFICIENT_FUNDS", change: []};

    }else if(overallCash > change || overallCash === change){
        console.log("Doing the change process.")
        for(let i = cid.length - 1; i >= 0; i--){

        let unit = currencyUnits[cid[i][0]]; // for the values
        let amountAvailable = cid[i][1]; // for the overall amount for that unit

        let howMuchUnits = Math.floor(change / unit); // how many of that currency to use for that.
        let howMuchGive = unit * howMuchUnits; // multiplying how many units is used

        howMuchGive = Math.min(howMuchGive, amountAvailable); // how many is available.

            if(howMuchGive > 0){
                cid[i][1] -= howMuchGive;
                cid[i][1] = Math.round(cid[i][1] * 100) / 100;
                change = Math.round((change - howMuchGive) * 100) / 100;
                changes.push({name: `${cid[i][0]}`, amount: howMuchGive});
            }
        }

        if(overallCid(cid) === 0){
            return {status: "CLOSED", change: changes};
        }

        if(change !== 0){
                return {status: "INSUFFICIENT_FUNDS", change: []};
        }else{
            console.log("logged open.");
            return { status: "OPEN", change: changes };
        }

        

    }else if(overallCid(cid) === change){
        console.log("returned early else");
        return { status: "CLOSED", change: [] };
    }

}



// listeners

purchaseBtn.addEventListener('click',()=>{

    if(Number(cashInput.value) < price){
        alert("Customer does not have enough money to purchase the item");
    }else if(Number(cashInput.value) === price){
        changeDues.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    }else{
        const result = changeLogic();
        updateStatus();
        changeDue(result);
    }

    cashInput.value = "";
    

});