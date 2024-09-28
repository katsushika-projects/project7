"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Data {
  id: string;
  memo: string;
  qr_img: string;
  passkey: string;
  created_at: string;
}

export default function Home() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [inputIndex, setIndex] = useState(0);
  const [textareaValue, setTextareaValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [flexDirection, setFlexDirection] = useState<"row" | "column">("row");
  const [containerHeight, setContainerHeight] = useState<string>("100vh");
  const [data, setData] = useState<Data | null>(null); // レスポンスデータを保存するステート
  const [query, setQuery] = useState<string | null>(null);

  // クエリパラメータの取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("id"));
    }
  }, []);

  const inputRef: React.RefObject<HTMLInputElement>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const bsFunction = (event: KeyboardEvent) => {
    if (event.key === "Backspace" && inputIndex > 0) {
      inputRef[inputIndex - 1].current?.focus();
      setIndex(inputIndex - 1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", bsFunction, false);
    return () => {
      document.removeEventListener("keydown", bsFunction, false);
    };
  }, [bsFunction]);

  // ウィンドウのサイズに応じてflexDirectionを変更
  useEffect(() => {
    const updateFlexDirection = () => {
      if (window.innerWidth <= 940) {
        setFlexDirection("column");
        setContainerHeight("auto");
      } else {
        setFlexDirection("row");
        setContainerHeight("100vh");
      }
    };

    // 初期ロード時のflexDirectionの設定
    updateFlexDirection();

    // リサイズイベントのリスナーを追加
    window.addEventListener("resize", updateFlexDirection);

    // クリーンアップ関数でリスナーを削除
    return () => {
      window.removeEventListener("resize", updateFlexDirection);
    };
  }, []);

  useEffect(() => {
    // コードが6桁入力されたか確認
    const isSixDigits = code.every((digit) => digit !== "");
    setIsCodeEntered(isSixDigits);

    if (isSixDigits) {
      handleCodePost(); // 6文字が入力されたらリクエストを送る
    }
  }, [code]);

  // コピーボタンの機能実装
  const handleCopy = () => {
    navigator.clipboard.writeText(textareaValue).then(() => {});
  };

  // 確認ボタン押下でPOSTリクエストを送信
  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        "https://project7.uni-bo.net/memos/create/",
        {
          memo: textareaValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const responseData = response.data;
        console.log(responseData);
        setData(responseData); // レスポンスデータを保存
      } else {
        console.error("失敗:", response.statusText);
      }
    } catch (error) {
      console.error("エラー:", error);
    }
  };

  // passkeyのPOSTリクエストを送信
  const handleCodePost = async () => {
    const passkey = code.join(""); // 6文字のコードを文字列に変換
    try {
      const response = await axios.post(
        "https://project7.uni-bo.net/memos/",
        {
          passkey: passkey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data;
        console.log(responseData);
        setTextareaValue(responseData.memo);
      } else {
        console.error("失敗:", response.statusText);
      }
    } catch (error) {
      console.error("エラー:", error);
    }
  };

  // QRのPOSTリクエストを送信
  const handleQueryPost = async () => {
    try {
      const response = await axios.get(
        `https://project7.uni-bo.net/memos/${query}`
      );

      if (response.status === 200) {
        const responseData = response.data;
        console.log(responseData);
        setTextareaValue(responseData.memo);
      } else {
        console.error("失敗:", response.statusText);
      }
    } catch (error) {
      console.error("エラー:", error);
    }
  };

  //queryが存在する場合、リクエストを送る
  useEffect(() => {
    if (query) {
      handleQueryPost();
    }
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        padding: "82px 79px",
        height: containerHeight,
        boxSizing: "border-box",
        color: "#FFFFFF",
        backgroundColor: "#333",
        justifyContent: "center",
        flexDirection: flexDirection,
        whiteSpace: "nowrap",
        gap: "134px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ margin: "0", fontWeight: "400", fontSize: "28px" }}>
            PC←→スマホ
            <br />
            ログイン不要で
            <br />
            自由にコピペができます
          </h1>
        </div>
        <div>
          <p style={{ margin: "0", paddingTop: "20px" }}>
            コピペ内容を貼り付けて、端末にコードが表示されている方↓
          </p>
          <div
            style={{
              padding: "20px",
              borderRadius: "10px",
              background: "#555",
              margin: "12px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ margin: "0" }}>
              端末に表示されているコードを入力してください
            </p>
            <div
              style={{
                display: "flex",
                gap: "7px",
                marginTop: "20px",
                padding: "6px 0",
                width: "250px",
                backgroundColor: "#FFF",
                borderRadius: "10px",
                justifyContent: "center",
              }}
            >
              {[...Array(6)].map((_, i) => (
                <input
                  maxLength={1} // 入力を1文字に制限
                  key={i}
                  autoFocus={i === 0}
                  value={code[i]}
                  type="tel"
                  ref={inputRef[i]}
                  onChange={(e) => {
                    const value = e.target.value;

                    // 入力が1文字でない場合には、処理をスキップ
                    if (value.length > 1) return;

                    const codeArray = [
                      i !== 0 ? code[0] : value,
                      i !== 1 ? code[1] : value,
                      i !== 2 ? code[2] : value,
                      i !== 3 ? code[3] : value,
                      i !== 4 ? code[4] : value,
                      i !== 5 ? code[5] : value,
                    ];
                    setCode([...codeArray]);

                    // 最後の入力欄では次のインプットにフォーカスを移さない
                    if (value !== "" && i < 5) {
                      inputRef[i + 1]?.current?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && code[i] === "") {
                      // 現在のinputが空でbackspaceキーが押された場合、前のinputに移動
                      if (i > 0) {
                        (inputRef[i - 1]?.current as HTMLInputElement)?.focus();
                      }
                    }
                  }}
                  style={{
                    width: "20px",
                    height: "35px",
                    textAlign: "center",
                    fontSize: "20px",
                    border: "none",
                    borderBottom: "2px solid #000", // 下線を表示
                    outline: "none",
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
            }}
          >
            <p style={{ margin: "0" }}>
              入力後、貼り付けた内容が上記に表示されます。
            </p>
            <p style={{ margin: "0" }}>半角英数字6字</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {!isCodeEntered ? (
            <>
              <h3 style={{ margin: "0", paddingTop: "20px" }}>
                手順
                <br />
                ①コピペする内容を下の欄に入力する
              </h3>
            </>
          ) : (
            <h3 style={{ margin: "0", paddingTop: "20px" }}>結果</h3>
          )}
          <textarea
            placeholder="コピペ内容を貼り付けてください"
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            style={{
              resize: "none",
              padding: "4px 12px",
              borderRadius: "10px",
              outline: "none",
              height: "40px", // 5行分の高さを設定
              overflowY: "auto", // 垂直スクロールバーを表示
              border: "2px solid #FFFFFF",
            }}
            onFocus={(e) => (e.target.style.border = "2px solid #D65C5C")}
            onBlur={(e) => (e.target.style.border = "2px solid #FFFFFF")} // フォーカスが外れた時に元に戻す
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            {!isCodeEntered ? (
              <>
                <h3 style={{ margin: "0" }}>②「確定」ボタンを押す</h3>
                <button
                  onClick={
                    textareaValue
                      ? () => {
                          setIsConfirmed(true);
                          handleConfirm();
                        }
                      : undefined
                  }
                  style={{
                    padding: "9px 24px",
                    color: "#ECECEC",
                    backgroundColor: isConfirmed
                      ? "#C0C0C0"
                      : textareaValue
                      ? "#FF5B5B"
                      : "#C0C0C0",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: isConfirmed ? "" : textareaValue ? "pointer" : "",
                  }}
                >
                  確定する
                </button>
              </>
            ) : (
              <button
                onClick={handleCopy}
                style={{
                  padding: "9px 24px",
                  color: "#ECECEC",
                  backgroundColor: "#FF5B5B",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                コピーする
              </button>
            )}
          </div>
          {isConfirmed && !code ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <p style={{ margin: "0", fontSize: "12px" }}>
                QRコードを削除してもう一度やり直す
              </p>
              <button
                onClick={() => {
                  setTextareaValue("");
                  setIsConfirmed(false);
                  setData(null);
                  setCode(["", "", "", "", "", ""]);
                }}
                style={{
                  padding: "6px 21px",
                  color: "#FF5B5B",
                  backgroundColor: "#333333",
                  border: "3px solid #FF5B5B",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                リセット
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: "0" }}>③QRコードをスマートフォンで読み込む</h3>
        <p
          style={{
            margin: "12px 0 0 0",
            fontSize: "12px",
            outline: "none",
          }}
        >
          コピペ内容を貼り付けるとQRコードが表示されます。
        </p>
        {data ? (
          <img
            src={data?.qr_img} // qr_imgをimgのsrcに設定
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              borderRadius: "10px",
              margin: "20px 0",
              aspectRatio: "1 / 1",
              height: "300px",
              minHeight: "200px",
            }}
          />
        ) : (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              borderRadius: "10px",
              margin: "20px 0",
              aspectRatio: "1 / 1",
              height: "300px",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "16px",
          }}
        >
          <p style={{ margin: "0" }}>スマートフォンでスキャン</p>
          <p style={{ margin: "8px 0 0 0" }}>
            または表示されているコードを入力
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ margin: "32px 0 16px 0" }}>
            次のコードを入力してください
          </p>
          <p
            style={{
              color: data ? "#333" : "#7D7D7D",
              backgroundColor: "#FFF",
              justifyContent: "center",
              alignItems: "center",
              height: "51px",
              display: "flex",
              borderRadius: "10px",
              fontWeight: "700",
              width: "100%",
              margin: "0",
              fontSize: data ? "24px" : "12px",
              padding: "0 10px",
            }}
          >
            {data ? data.passkey : "コピペ内容を貼り付けると表示されます"}
          </p>
        </div>
        <p style={{ marginBottom: "0" }}>※有効期限は15分です</p>
      </div>
    </div>
  );
}
