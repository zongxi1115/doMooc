// ==UserScript==
// @name         慕课通识课脚本
// @namespace    http://tampermonkey.net/
// @version      2024-09-23
// @description  try to take over the world!
// @author       Zongxi

// @match        https://www.icourse163.org/spoc/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icourse163.org
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function $$(selector) {
        let result = document.querySelectorAll(selector);
        if (result.length == 1) {
            return result[0];
        } else {
            return result;
        }
    }


    console.log("脚本start")
    function shua() {

        var Answers = [
            '',
            '',
            '',
            '',
            'biggest/Britain/private/Arts/Idea of/modesty/impersonal/Strictness/purpose/idealist',
            'multiple/2 hours and 45/Australia/matching/6/11-14/2-minute/2/3/level of difficulty',
            'Juda/4/The dis/Ang/Easter/the Bi/the Eas/The Re/the Pop/Pro',
            'omni/sphinx/uranus/leto/metis/rhea/sea/artem/heracles/leda', //8
            'colla/ritual/jane/wild/comm/thea/putting/41/commercial/off',
            'flower/emily/corre/birth/chry/red rose/apollo/lotus/above/above',
            'indivi/greek/cultures/jesus/chinese/ABC/gold/respect/construct/peril',
            'spring/first/arrival/above/gift m/putting/attracting/abundance/luckiest/from the line',
            'charlie/deadpan/oneself/cartoon/satire/laugh/paro/comedy/optim/humor',
            'polite/[ɪgˈzæmpl]/individual/[ˈhɒstaɪl]/tradition, conservative, omit, progressive/of a word,pron/volution,engl/vowels,ga/garage [gəˈrɑʒ], tomato [təˈmeɪtoʊ], neither [ˈniðɚ]/strict and formal, heritage, extroverted, diversity',
            'comm/urgent/doctors/private/medicare/insurance/plan/card/provider/premium',
            'better deal/products/less/above/20 to 45/tenants/three months/one-month/renting/one month notice',
            'four thousand/green/black/nothing/butter/above/11:00/4 to 5/meat/above',
            'prompt/1400s/business/15 and 20%/banker/1910/1920s/10%/waiter/customer was'
        ]

        let content = $$('.j-title.f-fl').innerHTML;
        let unit = parseInt(content.split('&nbsp;').splice(-1)[0].substring(0, content.length - 1)) - 1
        // console.log(unit);
        if (unit <= 4) {
            alert('前4课不提供答案请自行解决')
        }



        var answers = Answers[unit].split("/")
        if (answers.length != 10) {
            console.error("answers length is not 10!!!")
        } else {
            let els = $$(".m-choiceQuestion")



            var index = 0;
            var randomMS = Math.floor(Math.random() * 1000) + 10000;

            var timer = setInterval(() => {
                let options = Array.from(els[index].querySelectorAll(".f-richEditorText.optionCnt")).map(el => el.textContent.toLowerCase().replaceAll(" ", ""))
                // console.log(options);
                let lis = els[index].querySelector(".choices.f-cb").querySelectorAll("li")
                let target = 0;
                options.forEach(option => {
                    let t = answers[index]
                    if (option.includes(t.toLowerCase().replaceAll(" ", ""))) {
                        target = options.indexOf(option)
                        // console.log(target)
                    }
                })
                lis[target].querySelector("input").click();
                index++;
                if (index >= answers.length) {
                    clearInterval(timer);
                }
            }, randomMS);

        }
    }


    let li = document.createElement("li");
    let a_li = document.createElement("a");
    li.appendChild(a_li)
    // a_li.href = "javascript:void(0)";

    a_li.textContent = "开始刷题";
    a_li.className = 'f-thide f-fc3'
    li.classList.add("u-greentab")
    li.classList.add("j-tabitem")
    setTimeout(() => {
        document.querySelector('.ant-menu.ant-menu-root').appendChild(li)
    }, 3500);

    li.onclick = onclick;
    function onclick() {

        let confirm = window.confirm("请注意：请进入到答题页面时点击，否则出现bug，网页崩溃等问题后果自负！");
        if (confirm) {

            let result = parseInt(prompt("选择当前模式：\n 1.选择题 2.简答题 3.评论题"));
            switch (result) {
                case 1:
                    shua();
                    break;
                case 2:
                    createAiBtns();
                    break;
                case 3:
                    writeComment();
                    break;
                default:
                    alert("请选择正确的模式！");
                    break;

            }
        }
    }




    // // ai part

    async function forAnswer(question) {
        let ans = await fetch("//zongxi.xyz/answer/tsk", {
            method: "POST",
            body: JSON.stringify({
                content: question
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        // return ans.text()
        if (ans.ok) {
            return ans.text()
        } else {
            return 'error'
        }
    }

    async function answerAi(index) {
        $$(".zongxi-ai")[index].disabled = true;
        let ans = [];
        $$('.f-richEditorText.j-richTxt.f-fl').forEach(item => {
            let question = item.textContent;
            ans.push(question);
        })
        let answer = await forAnswer(ans[index]);
        console.log(answer);
        if (answer.includes("AI")) {
            alert("注意该回答包含AI自爆内容，请注意检查")
        }
        if (answer.includes("error")) {
            alert("网络错误，请重试")
        }
        var r;
        if (index == 0) r = 1;
        if (index == 1) r = 3;
        $$(".ql-editor")[r].innerHTML = answer;
        $$(".zongxi-ai")[index].disabled = false;

    }



    function createAiBtns() {
        $$(".ql-formats").forEach((item, key) => {
            let btn = document.createElement("button");
            btn.className = "zongxi-ai"
            btn.innerHTML = `<svg t="1727171541019" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3473" width="18" height="18"><path d="M409.6 750.933l34.133 68.267H170.667v136.533h682.666V819.2H580.267l34.133-68.267h238.933A68.267 68.267 0 0 1 921.6 819.2v136.533A68.267 68.267 0 0 1 853.333 1024H170.667a68.267 68.267 0 0 1-68.267-68.267V819.2a68.267 68.267 0 0 1 68.267-68.267H409.6zM273.067 68.267h477.866a68.267 68.267 0 0 1 68.267 68.266V614.4a68.267 68.267 0 0 1-68.267 68.267H273.067A68.267 68.267 0 0 1 204.8 614.4V136.533a68.267 68.267 0 0 1 68.267-68.266z m0 68.266V614.4h477.866V136.533H273.067z m614.4 102.4a34.133 34.133 0 0 1 34.133 34.134v204.8a34.133 34.133 0 1 1-68.267 0v-204.8a34.133 34.133 0 0 1 34.134-34.134z m-750.934 0a34.133 34.133 0 0 1 34.134 34.134v204.8a34.133 34.133 0 0 1-68.267 0v-204.8a34.133 34.133 0 0 1 34.133-34.134zM989.867 307.2A34.133 34.133 0 0 1 1024 341.333V409.6a34.133 34.133 0 1 1-68.267 0v-68.267a34.133 34.133 0 0 1 34.134-34.133z m-955.734 0a34.133 34.133 0 0 1 34.134 34.133V409.6A34.133 34.133 0 0 1 0 409.6v-68.267A34.133 34.133 0 0 1 34.133 307.2z m341.334 102.4a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z m273.066 0a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4zM512 0a34.133 34.133 0 0 1 34.133 34.133V102.4a34.133 34.133 0 0 1-68.266 0V34.133A34.133 34.133 0 0 1 512 0z m-68.267 614.4a34.133 34.133 0 0 1 34.134 34.133v136.534a34.133 34.133 0 1 1-68.267 0V648.533a34.133 34.133 0 0 1 34.133-34.133z m136.534 0a34.133 34.133 0 0 1 34.133 34.133v136.534a34.133 34.133 0 1 1-68.267 0V648.533a34.133 34.133 0 0 1 34.134-34.133z" p-id="3474"></path></svg>`;
            btn.onclick = () => answerAi(key)
            item.appendChild(btn);
        });
    }

    async function writeComment() {

        let question = $$(".j-content")[0].textContent;
        let answer = await forAnswer(question);
        console.log(answer);
        var flag = false
        if (answer.includes("AI") || answer.includes("language model")) {
            alert("注意该回答包含AI自爆内容，请注意检查")
            flag = true
        }
        if (answer.includes("error")) {
            alert("网络错误，请重试")
            flag = true
        }
        document.querySelector(".ql-editor").innerHTML = answer;
        if (flag) {
            return
        }
        setTimeout(() => {
            $$('.j-edit-btn').click()
            setTimeout(() => {
                Array.from(document.querySelectorAll('.m-detailInfoItem')).slice(-1)[0].querySelector('.j-up').click()
            }, 1500);
        }, 1000);

    }





})();
