document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

var myButton = document.getElementById("ensure");

myButton.onclick = function(){
	var mysrc = document.getElementById("interface").value;
	var mypara = document.getElementById("parameter").value;
	var node = document.getElementById("return").value;
	//机芯机型查询
	//eg：var node = '{"data":{"platformModel":"","productModel":"","androidVersion":"","chipModel":"","memorySize":""}}';
	console.log("lxw "+node);
	
	sendHTTPRequest(mysrc, node, returnInfo);
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


