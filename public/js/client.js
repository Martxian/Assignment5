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

    document.querySelector("#launchtimesHTML").addEventListener("click", function (e) {
        ajaxGET("/launchtimes?format=html", function (data) {
            let d1 = document.createElement("div");
            d1.innerHTML = data;
            d1.classList.add("popup");
            let closeBtn = document.createElement("span");
            closeBtn.innerHTML = "X";
            closeBtn.classList.add("popup-close");
            closeBtn.addEventListener("click", function () {
                d1.parentNode.removeChild(d1);
            });
            d1.appendChild(closeBtn);
            document.body.appendChild(d1);
        });
    });


    document.querySelector("#launchtimesJSON").addEventListener("click", function (e) {
        ajaxGET("/launchtimes?format=json", function (data) {
            //console.log("before parsing", data);
            // this call is JSON so we have to parse it:
            let parsedData = JSON.parse(data);
            let str = "<table>";
            for (let i = 0; i < parsedData.length; i++) {
                let item = parsedData[i];
                str += "<tr><td>" + item["Mission"] + "</td><td>" + item["Date"]
                    + "</td><td>" + item["Priority"]
                    + "</td><td>" + item["Astronaut"]
                    + "</td><td>" + item["description"] + "</td></tr><tr>";
            }
            str += "</table>";
            let d1 = document.createElement("div");
            d1.innerHTML = str;
            d1.classList.add("popup");
            let closeBtn = document.createElement("span");
            closeBtn.innerHTML = "X";
            closeBtn.classList.add("popup-close");
            closeBtn.addEventListener("click", function () {
                d1.parentNode.removeChild(d1);
            });
            d1.appendChild(closeBtn);
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
