//gets our state from form input
let state = {
	price: getNumber(document.querySelectorAll('[name="price"]')[0].value),
	loan_years: document.querySelectorAll('[name="loan_years"]')[0].value,
	down_payment: document.querySelectorAll('[name="down_payment"]')[0].value,
	interest_rate: document.querySelectorAll('[name="interest_rate"]')[0].value,
	proverty_tax: document.querySelectorAll('[name="property_tax"]')[0].value,
	home_insurance: document.querySelectorAll('[name="home_insurance"]')[0]
		.value,
	hoa: document.querySelectorAll('[name="hoa"]')[0].value,
};
//multiple variables
//labels are the things that will show in our pie chart
// this will grab our data from input and put it out to the chart
//global variables
let totalLoan,
	totalMonths,
	monthlyInterest,
	monthyPrincipalInterest,
	monthlyPropertyTaxes,
	monthlyHomeInsurance,
	monthlyHOA,
	monthlyTotal,
	labels = ["Principal & Interest", "Property Tax", "Home Insurance", "HOA"],
	backgroundColor = [
		"rgba(255,99,132, 1)",
		"rgba(54,162,235, 1)",
		"rgba(255,206,86, 1)",
		"rgba(75,192,192, 1)",
		"rgba(153,102,255, 1)",
		"rgba(255,159,64, 1)",
	];
borderColor = [
	"rgba(255,99,132, 1)",
	"rgba(54,162,235, 1)",
	"rgba(255,206,86, 1)",
	"rgba(75,192,192, 1)",
	"rgba(153,102,255, 1)",
	"rgba(255,159,64, 1)",
];
//function so we only grt numbers back no comas
//use regex to return only numbers
function getNumber(str) {
	return Number(str.replace(/[^0-9\.-]+/g, ""));
}
//this uses the element id which you will find on line 114
//it goes to layers deep
// witb new it creates new chart
//we also pass in our data which we declared early
let ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
	type: "doughnut",
	data: {
		labels: labels,
		datasets: [
			{
				label: "# of Votes",
				data: [
					monthyPrincipalInterest,
					monthlyPropertyTaxes,
					monthlyHomeInsurance,
					monthlyHOA,
				],
				backgroundColor: backgroundColor,
				borderColor: borderColor,
				borderWidth: 1,
			},
		],
	},
});
// getting rid of animations
myChart.options.animation = false;
//adding event listener to make it dynamic
// we dont use index of [0] because we want it for all of the inputs of text
let i;
let inputTexts = document.getElementsByClassName("form-group__textInput");
//for loop with event listener for text
for (i = 0; i < inputTexts.length; i++) {
	inputTexts[i].addEventListener("input", updateInputState);
}
//for loop with event listener for range
let inputSlides = document.getElementsByClassName("form-group__range-slide");
for (i = 0; i < inputSlides.length; i++) {
	inputSlides[i].addEventListener("input", updateInputState);
}
//function handle and change the properties of our state

function updateInputState(event) {
	let name = event.target.name;
	// we get value here
	let value = event.target.value;
	// here if value is equal to price
	// we then reassign value
	if (name == "price") {
		value = getNumber(value);
	}
	//updates any chance on any range input
	//input coming from the percentage range
	//total__${name} is == to total__down_paymnet for example
	if (event.target.type == "range") {
		let total = (document.getElementsByClassName(
			`total__${name}`
		)[0].innerHTML = `${value}`);
	}
	state = {
		...state,
		[name]: value,
	};
	calculateData();
}
//shows the donut chart when the info is submited
document.getElementsByTagName("form")[0].addEventListener("submit", (event) => {
	event.preventDefault();
	document
		.getElementsByClassName("mg-page__right")[0]
		.classList.add("mg-page__right--animate");
	calculateData();
});
//right to left math
// down payment 20 / by 100 = .20
// price * .20 = 20,000 of hundrathousand
// 100,000 - 20,000 = 80,000 total loan
function calculateData() {
	totalLoan = state.price - state.price * (state.down_payment / 100);
	totalMonths = state.loan_years * 12;
	monthlyInterest = state.interest_rate / 100 / 12;
	monthyPrincipalInterest = (
		totalLoan *
		((monthlyInterest * (1 + monthlyInterest) ** totalMonths) /
			((1 + monthlyInterest) ** totalMonths - 1))
	).toFixed(2);
	monthlyPropertyTaxes = (
		(state.price * (state.proverty_tax / 100)) /
		12
	).toFixed(2);
	monthlyHomeInsurance = state.home_insurance / 12;
	monthlyHOA = state.hoa / 12;
	monthlyTotal =
		parseFloat(monthyPrincipalInterest) +
		parseFloat(monthlyPropertyTaxes) +
		parseFloat(monthlyHomeInsurance) +
		parseFloat(monthlyHOA);

	document.getElementsByClassName(
		"info__numbers--principal"
	)[0].innerHTML = parseFloat("monthlyPrincipalInterest").toFixed(2);
	document.getElementsByClassName(
		"info__numbers--property_taxes"
	)[0].innerHTML = parseFloat("monthlyPrincipalInterest").toFixed(2);
	document.getElementsByClassName(
		"info__numbers--home_insurance"
	)[0].innerHTML = parseFloat("monthlyPrincipalInterest").toFixed(2);
	document.getElementsByClassName(
		"info__numbers--hoa"
	)[0].innerHTML = parseFloat("monthlyPrincipalInterest").toFixed(2);
	document.getElementsByClassName(
		"info__numbers--total"
	)[0].innerHTML = monthlyTotal;
	updateChart(myChart, labels, backgroundColor);
}
//update chart
function updateChart(chart, label, color) {
	chart.data.datasets.pop();
	chart.data.datasets.push({
		label: label,
		backgroundColor: color,
		data: [
			monthyPrincipalInterest,
			monthlyPropertyTaxes,
			monthlyHomeInsurance,
			monthlyHOA,
		],
	});
	chart.options.transitions.active.animation.duration = 0;
	chart.update();
}
calculateData();
