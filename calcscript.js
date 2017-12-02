
"use strict";

var m_value1 = 0;
var m_value2 = 0;
var m_result = 0;

var m_action = {
  plus: function(a, b) { return a + b; },
  minu: function(a, b) { return a - b; },
  mult: function(a, b) { return a * b; },
  divi: function(a, b) { return a / b; },
  operation: "undef"
}

var m_unAction = {
  unsqrt: function(a) { return a * a; }
}

function digitOnClick(eventObj) {
	var elem = document.getElementById("resultTag");
	var oper = document.getElementById("memoryId");
	var operText = oper.innerHTML;	

	console.log("eventObj.target.id.length: " + String(eventObj.target.id.length));

	if (eventObj.target.id.length == 3) { // digit		

		if (IsResultReady())
			ClearData();

		if (operText.length == 0) {
			m_value1 *= 10;
			m_value1 += Number(eventObj.target.innerHTML);
			elem.innerHTML = GetStringForResult(String(m_value1));
		}
		else {
			m_value2 *= 10;
			m_value2 += Number(eventObj.target.innerHTML);
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
	else if (eventObj.target.id.length == 4) { // operation
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
	}
    else if (eventObj.target.id.length == 6) { // unary operation
        m_result = m_unAction[eventObj.target.id](m_value1);
        elem.innerHTML = GetStringForResult(String(m_result));
        oper.innerHTML = String(m_value1) + " x " + String(m_value1) + " = " + String(m_result);
        m_value1 = m_result;      
    }
	else if (eventObj.target.id.length == 7) { // =	
		if (!IsResultReady()) {
			if (operText.length > 0) {
				m_result = m_action[m_action.operation](m_value1, m_value2);
				elem.innerHTML = GetStringForResult(String(m_result));
				oper.innerHTML += String(m_value2) + " = " + String(m_result);
                m_value1 = m_result;
			}			
		}
	}
	else if (eventObj.target.id.length == 8) { // clear all		
			ClearData();
	}
}

function GetStringForResult(s) {
	var maxs = 12;
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
	m_action.operation = "undef";
	document.getElementById("resultTag").innerHTML = "0";
	document.getElementById("memoryId").innerHTML = "";
}

function Init() {
	console.log("Init ->");
	var all = document.getElementsByClassName('btn btn-primary');

	for (var i = 0; i < all.length; i++) {
		all[i].addEventListener('click', digitOnClick, false);
	}
}

window.onload = Init;