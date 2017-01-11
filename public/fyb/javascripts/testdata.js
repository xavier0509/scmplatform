document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

var myButton = document.getElementById("ensure");

myButton.onclick = function(){
	var mysrc = document.getElementById("interface").value;
	var mypara = document.getElementById("parameter").value;
	var myreturn = document.getElementById("return").value;
	
	sendHTTPRequest(mysrc, '{"data":""}', returnInfo);
}

function returnInfo(){
	console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var mydata = JSON.parse(this.responseText);
            console.log("lxw "+ mydata);
            document.getElementById("return").value = this.responseText;
        }
    }
}


