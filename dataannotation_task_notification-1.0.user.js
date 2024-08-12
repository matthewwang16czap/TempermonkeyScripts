// ==UserScript==
// @name         dataannotation_task_notification
// @namespace    https://github.com/matthewwang16czap
// @version      1.0
// @description  Auto login and auto refresh pages to find new available projects.
// @author       You
// @match        https://www.dataannotation.tech/*
// @match        https://app.dataannotation.tech/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';



    const login = (email, password) => {
        document.getElementById("user_email").value = email;
        document.getElementById("user_password").value = password;
        document.querySelector("input.btn").click();
    };
    const set_account = (email, password) => {
        GM_setValue("email", email);
        GM_setValue("password", password);
    };

    let clear_storage = GM_registerMenuCommand ("Clear storage", () => set_account('', ''));
    let goto_login = GM_registerMenuCommand ("Login your account", () => {
        window.location.href = "https://app.dataannotation.tech/users/sign_in";
        // GM.unregisterMenuCommand(get_user_login); //delete manu
    });



    // if it is the login page
    if (window.location.href == "https://app.dataannotation.tech/users/sign_in") {
        // if failed login, clear storage of current account
        if (document.querySelector(".alert") && !document.querySelector(".alert").innerText.includes('success')) {
            set_account('', '');
        }
        // if has stored account
        let email = GM_getValue("email", '');
        let password = GM_getValue("password", '');
        if (email != '' && password != '') {
            login(email, password);
        }
        // if does not have stored account, wait for record user's account
        else {
            let form = document.querySelector("#new_user");
            let new_div = document.createElement("div");
            new_div.innerHTML = `</br><button style="color:red;">save my account for auto login</button>`;
            new_div.addEventListener("click", () => {
                set_account(document.getElementById("user_email").value, document.getElementById("user_password").value);
                alert("successfully save your account!");
            });
            form.parentNode.appendChild(new_div);
        }
    }

    // set up notifications
    if (window.location.href == "https://app.dataannotation.tech/workers/projects") {
        let tasks = document.getElementsByTagName("table")[1].childNodes[1].childNodes;
        for (let task of tasks) {
            if (task.childNodes[2].innerText > 1) {
                console.log("found");
                GM_notification({
                  text: "New Projects available",
                  title: "DataAnnotation",
                  url: 'https://app.dataannotation.tech/workers/projects',
                  onclick: (event) => {
                    // The userscript is still running, so don't open example.com
                    event.preventDefault();
                    // Display an alert message instead
                    // alert('I was clicked!')
                  }
                });
                break;
            }
        }
        // set sleep time to refresh (10 mins)
        setTimeout(() => {
          location.reload();
        }, 10*60*1000);
    }
})();