// invoke ready and pass in a callback function
ready(function () {

    console.log("Client script loaded.");

    // a function declaration inside of a callback ... which takes a callback function :O
    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        console.log("xhr", xhr);
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                //console.log('responseText:' + xhr.responseText);
                callback(this.responseText);

            } else {
                console.log(this.status);
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    document.querySelectorAll(".clear").forEach(function (currentElement, currentIndex, listObj) {
        //console.log(currentElement, currentIndex, listObj);
        currentElement.addEventListener("click", function (e) {

            for (let i = 0; i < this.parentNode.childNodes.length; i++) {
                if (this.parentNode.childNodes[i].nodeType == Node.ELEMENT_NODE) {
                    if (this.parentNode.childNodes[i].getAttribute("class") == "ajax-stuff") {
                        this.parentNode.childNodes[i].innerHTML = "";
                        break;
                    }
                }
            }

        });
    });

    //  /path-to?key2=value1&key2=value2&key3=value3
    /*  { key1: value1, key2: value2, key3: value3 }
     */
    document.querySelector("#weekdaysJSON").addEventListener("click", function (e) {
        let something = null;
        ajaxGET("/weekdays?format=json", function (data) {
            console.log("Before parsing", data);
            // this call is JSON so we have to parse it:
            let parsedData = JSON.parse(data);
            something = parsedData;
            console.log("what is something in the AJAX call?", something);
            console.log("Before parsing", parsedData);
            let str = "<ol>"
            for (let i = 0; i < parsedData.length; i++) {
                str += "<li>" + parsedData[i] + "</li>";
            }
            str += "</ol>";
            document.getElementById("weekdays-json").innerHTML = str;
        });
        console.log("what is something?", something);
    });

    document.querySelector("#weekdaysHTML").addEventListener("click", function (e) {
        ajaxGET("/weekdays?format=html", function (data) {
            console.log(data);
            // since it's HTML, let's drop it right in
            document.getElementById("weekdays-html").innerHTML = data;
        });
    });

    // let's wire our ajax call function to an mouse click so we get data
    // when the user clicks
    document.querySelector("#marker").addEventListener("click", function (e) {
        ajaxGET("/markers", function (data) {
            //console.log("before parsing", data);
            // this call is JSON so we have to parse it:
            let parsedData = JSON.parse(data);
            let str = "<table>";
            for(let i = 0; i < parsedData.length; i++) {
                let item = parsedData[i];
                str += "<tr><td>" + item["title"] + "</td><td>" + item["lat"] + "</td><td>" + item["lng"]
                    + "</td><td>" + item["description"] + "</td></tr><tr>";
            }
            str += "</table>";
            let d1 = document.createElement("div");
            d1.innerHTML = str;
            document.body.appendChild(d1);
            console.log("after parsing", parsedData);
        });
    });

});

// callback function declaration
function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}
