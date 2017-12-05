
"use strict";

// simple calculator as JavaScript exercise

var m_value1 = 0;
var m_value2 = 0;
var m_result = 0;
var m_comma = false;
var m_fracQueue = 1;

var m_action = {
  plus: function(a, b) { return a + b; },
  minu: function(a, b) { return a - b; },
  mult: function(a, b) { return a * b; },
  divi: function(a, b) { return a / b; },
  operation: "undef"
}

var m_unAction = {
  unsqrt: function(a) { return a * a; },
  unloga: function(a) { return Math.log(a); },
  unexpo: function(a) { return Math.exp(a); },
  unsqrx: function(a) { return Math.sqrt(a); }
}

var m_unValidation = {
  unsqrt: function(a) { return true; },
  unloga: function(a) { return a > 0; },
  unexpo: function(a) { return true; },
  unsqrx: function(a) { return a >= 0; }	
}

var m_resAction = {
  unsqrt: function(x, y) { return String(x) + " x " + String(x) + " = " + String(y); },
  unloga: function(x, y) { return "ln" + String(x) + " = " + String(y); },
  unexpo: function(x, y) { return "e<sup>" + String(x) + "</sup> = " + String(y); },
  unsqrx: function(x, y) { return "&radic;" + String(x) + " = " + String(y); }
}

function digitOnClick(eventObj) {
	var elem = document.getElementById("resultTag");
	var oper = document.getElementById("memoryId");
	var operText = oper.innerHTML;	

	//console.log("eventObj.target.id.length: " + String(eventObj.target.id.length));

	if (eventObj.target.id.length == 3) { // digit		

		if (IsResultReady())
			ClearData();

		if (document.getElementById("memoryId").innerHTML.length == 0) {
		    if (!m_comma) {
				m_value1 *= 10;
				m_value1 += Number(eventObj.target.innerHTML);
		    }
		    else {
		    	var frac = Number(eventObj.target.innerHTML);
		    	var newstr = "0.";

		    	for (var i = 1; i < m_fracQueue; i++) {
		    		newstr += "0";
		    	}

		    	var power = newstr + String(frac);
		    	
		    	m_value1 += parseFloat(power);
		    	m_value1 = parseFloat(m_value1.toFixed(m_fracQueue));
		    	m_fracQueue++;
		    }
	    
			elem.innerHTML = GetStringForResult(String(m_value1));
		}
		else {
			if (!m_comma) {
				m_value2 *= 10;
				m_value2 += Number(eventObj.target.innerHTML);
		    }
		    else {
		    	var frac = Number(eventObj.target.innerHTML);
		    	var newstr = "0.";

		    	for (var i = 1; i < m_fracQueue; i++) {
		    		newstr += "0";
		    	}

		    	var power = newstr + String(frac);
		    	
		    	m_value2 += parseFloat(power);
		    	m_value2 = parseFloat(m_value2.toFixed(m_fracQueue));
		    	m_fracQueue++;
		    }		   

			elem.innerHTML = GetStringForResult(String(m_value2));
		}
	}
	else if (eventObj.target.id.length == 5) { // clear the last
		if (!IsResultReady()) {
			if (operText.length == 0) {
				var rem = m_value1 % 10;
				m_value1 -=	rem;
				m_value1 /= 10;
				elem.innerHTML = GetStringForResult(String(m_value1));
			}
			else {
				var rem = m_value2 % 10;
				m_value2 -=	rem;
				m_value2 /= 10;
				elem.innerHTML = GetStringForResult(String(m_value2));
			}
		}
		else {
			ClearData();
		}
	}
	else if (eventObj.target.id.length == 4) { // binary operation
		var action = eventObj.target.innerHTML;		

		if (IsResultReady()) {
            m_value1 = m_result;
            m_value2 = 0;
            m_result = 0;
            oper.innerHTML = String(m_value1) + action;
            m_action.operation = eventObj.target.id;
		}
		else {
            oper.innerHTML = String(m_value1) + action;
            m_action.operation = eventObj.target.id;
		}

		m_comma = false;
        m_fracQueue = 1;
	}
    else if (eventObj.target.id.length == 6) { // unary operation
    	if (m_unValidation[eventObj.target.id](m_value1)) {
	        m_result = m_unAction[eventObj.target.id](m_value1);
	        elem.innerHTML = GetStringForResult(String(m_result));
	        oper.innerHTML = m_resAction[eventObj.target.id](m_value1, m_result);
	        m_value1 = m_result; 

	        console.log(oper.innerHTML);
    	}
    	else {
			elem.innerHTML = "ERROR";
			console.log(oper.innerHTML);
    	}

    	m_comma = false;
        m_fracQueue = 1;
    }
	else if (eventObj.target.id.length == 7) { // =	
		if (!IsResultReady()) {
			if (operText.length > 0) {
				m_result = m_action[m_action.operation](m_value1, m_value2);
				elem.innerHTML = GetStringForResult(String(m_result));
				oper.innerHTML += String(m_value2) + " = " + String(m_result);
                m_value1 = m_result;
                m_comma = false;
                m_fracQueue = 1;

                console.log(oper.innerHTML);
			}			
		}
	}
	else if (eventObj.target.id.length == 2) {
		if (!IsResultReady()) {
			m_comma = true;
		}
	}
	else if (eventObj.target.id.length == 8) { // clear all		
			ClearData();
	}
}

function GetStringForResult(s) {
	var maxs = 15;
	var r = s;

	if (s.length > maxs) {
		r = s.substr(0, maxs) + "..";
	}

	return r;
}

function IsResultReady() {
	var text = document.getElementById("memoryId").innerHTML;
	return text.indexOf("=") >= 0;
}

function ClearData() {
	m_value1 = m_value2 = 0;
    m_result = 0;
    m_comma = false;
    m_fracQueue = 1;
	m_action.operation = "undef";
	document.getElementById("resultTag").innerHTML = "0";
	document.getElementById("memoryId").innerHTML = "";
}

function CreateCaclMarkup() {
	// TODO:
}

function AddEventListeners() {
	var all = document.getElementsByClassName('btn btn-primary');

	for (var i = 0; i < all.length; i++) {
		all[i].addEventListener('click', digitOnClick, false);
	}	
}

function Init() {
	console.log("Start Calculator JS ->");

	CreateCaclMarkup();
	AddEventListeners();
}

window.onload = Init;