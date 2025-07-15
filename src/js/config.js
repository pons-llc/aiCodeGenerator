(async (PLUGIN_ID) => {
    'use strict';

    const samples = {
      "非表示":`kintone.app.record.setFieldShown(fieldCode, isShown)`,
      "submitエラー":`event.record.フィールドコード.error = ‘エラーメッセージ’; event.error = ‘エラーメッセージ’;`,
      "loogup取得":`event.record.フィールドコード.lookup = true; return event;`,
      "テーブルの形式":`{
          "テーブル": {
            "type": "SUBTABLE",
            "value": [
              {
                "id": "1923",
                "value": {
                  "行番号": {
                    "type": "NUMBER",
                    "value": "1"
                  },
                  "テキスト": {
                    "type": "SINGLE_LINE_TEXT",
                    "value": "サンプルテキスト1"
                  }
                }
              },
              {
                "id": "1925",
                "value": {
                  "行番号": {
                    "type": "NUMBER",
                    "value": "2"
                  },
                  "テキスト": {
                    "type": "SINGLE_LINE_TEXT",
                    "value": "サンプルテキスト2"
                  }
                }
              }
            ]
          }
        }`
    }

    const sampleText = JSON.stringify(samples,null,2)
    
    const MODEL_NAME = "gemini-2.5-flash";
    const appId = kintone.app.getId()

    const formGetBody = {
      app: appId,
      lang: "ja"
    }

    const formbody = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', formGetBody);
    const props = formbody.properties
    const keys = Object.keys(props)
    keys.forEach(key =>{
      const insertButton = makeButtons(`{${key}}`);
      document.getElementById("pons-button-space").appendChild(insertButton)
    })

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;
    let header;

    const proxyConfig = kintone.plugin.app.getProxyConfig(API_URL,"POST")
    console.log(proxyConfig)
    if (!proxyConfig){
      document.getElementById("api-key-input").style.display = "block" 
    }else{
      document.getElementById("promptField").style.display = "block";
      header = proxyConfig.headers
    }

    document.getElementById("geminiKeySave").addEventListener("click",async()=>{
      const API_KEY = document.getElementById("gemini-API-key").value
      if (API_KEY){
        const heads = {
          "x-goog-api-key": API_KEY,
          "Content-Type": "application/json"
        };
        await kintone.plugin.app.setProxyConfig(API_URL,"POST",heads,{},()=>{
          alert("APIキーを保存しました。一度設定を保存してから再度この画面を開いてください。");
          window.location.href = "/k/admin/app/flow?app=" + appId;
          },(error)=>{alert("APIキーの保存に失敗しました。")}
        )
      }
    })

    document.getElementById("apiShow").addEventListener("click",(e)=>{
      e.preventDefault();
      if(document.getElementById("api-key-input").style.display === "block"){
        document.getElementById("api-key-input").style.display = "none";
      }else{document.getElementById("api-key-input").style.display = "block"}
    })

    

      const insertItemButtons = document.querySelectorAll('.insert-item-btn');
      const myTextarea = document.getElementById('myTextarea');

      insertItemButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const valueToInsert = event.target.innerText;

          const start = myTextarea.selectionStart;
          const end = myTextarea.selectionEnd;
          const currentText = myTextarea.value;

          myTextarea.value = currentText.substring(0, start) + valueToInsert + currentText.substring(end);

          myTextarea.selectionStart = start + valueToInsert.length;
          myTextarea.selectionEnd = start + valueToInsert.length;

          myTextarea.focus();
        });
      });

      document.getElementById("prompting").addEventListener("click", async () => {
        const ponsmodal = document.getElementById("loadingModal");
        const promptBody = document.getElementById("myTextarea").value;

        if (!promptBody) {
          alert("入力内容が空です。");
          return;
        }

      ponsmodal.style.display = "flex";

      const promptCondition = document.getElementById("pons-event-condition").value
      const promptConditionDetail = document.getElementById("pons-event-condition-detail").value;
      const promptHeader = "kintoneのカスタマイズファイルを作成したい。使用するフィールドコードは波括弧で囲んで表示している。コードのみを出力してほしいが、こちらの指示に足りない事項があればコードを出力せずに、きちんとコードが出せるようアドバイスをすること。";
      const usedCodes = [...promptBody.matchAll(/\{(.*?)\}/g)].map(match => match[1]);
      const filteredProps = usedCodes.reduce((acc, code) => {
        if (props[code]) {
          acc[code] = props[code];
        }
        return acc;
      }, {});
      const stringFilteredProps = JSON.stringify(filteredProps, null, 2);
      try {

        const contents = [
          {
            parts: [
              { text: promptHeader },
              { text: `実行されるイベントは：${promptCondition}の${promptConditionDetail}。`},
              { text: `アプリの構成は:${stringFilteredProps}`},
              { text: `出力してほしい内容:${promptBody}`},
              { text: `公式のドキュメントとして以下のサンプルも参考にすること:${sampleText}`}
            ],
          },
        ];

        const [body, status, headers] = await kintone.proxy(
          API_URL,
          'POST',
          header,
          JSON.stringify({ contents })
        );

        if (status >= 400) {
          const errorData = JSON.parse(body);
          const message = `エラーが発生しました: ${status} - ${errorData.error}`;
          alert(message);
          document.getElementById("responseTextarea").value = message;
          return;
        }

        console.log(body)

        const data = JSON.parse(body);
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "結果が取得できませんでした。";
        document.getElementById("responseTextarea").value = resultText;

      } catch (error) {
        alert(`例外が発生しました: ${error.message}`);
        document.getElementById("responseTextarea").value = `例外が発生しました: ${error.message}`;
        console.error(error);
      } finally {
        ponsmodal.style.display = "none";
      }
    });
    
    document.getElementById("pons-download").addEventListener("click",()=>{
      const resText = document.getElementById("responseTextarea").value;
      downloadJSFile(resText)    
    })

  function extractCodeBlocks(text) {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const matches = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }

    return matches;
  }

  async function downloadJSFile(text) {
    const content = extractCodeBlocks(text);
    if (content.length === 0) {
      alert("コードが中にありません。");
      return;
    }

    const blob = new Blob([content.join("\n\n")], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const fileName = prompt("保存するファイル名を入力してください。(拡張子不要)");
    if (fileName) {
      a.download = fileName + ".js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert("ファイル名を入力してください。");
    }
  }


  function makeButtons(key){
    const keyButton = document.createElement("button")
    keyButton.type = "button"
    keyButton.innerText = key;
    keyButton.classList.add("insert-item-btn")
    return keyButton
  }

  
})(kintone.$PLUGIN_ID);
  